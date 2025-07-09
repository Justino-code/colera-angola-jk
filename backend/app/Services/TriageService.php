<?php

namespace App\Services;

use App\Models\Hospital;
use App\Models\AvaliacaoRisco;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Auth;
use SimpleSoftwareIO\QrCode\Facades\QrCode;

class TriageService
{
    /**
     * Avalia os sintomas do paciente e determina o risco de cólera (alto, medio ou baixo).
     *
     * @param array $sintomas Lista de sintomas informados pelo paciente (em português)
     * @param int|null $id_paciente ID do paciente (opcional, usado para registrar histórico)
     * @return array Resultado completo da avaliação
     * @throws \InvalidArgumentException Se algum sintoma não for válido
     * @throws \RuntimeException Se ocorrer um erro durante o processamento
     */
    public function avaliarRisco(array $sintomas, int|null $id_paciente=null): array
    {
        try {
            $config = config('triagem');

            if (empty($config)) {
                throw new \RuntimeException("Configuração de triagem não encontrada.");
            }

            // Valida sintomas
            $opcoesValidas = array_keys($config['sintomas']);
            if (empty($sintomas)) {
                throw new \InvalidArgumentException("Nenhum sintoma foi informado.");
            }
            if (!empty(array_diff($sintomas, $opcoesValidas))) {
                throw new \InvalidArgumentException("Um ou mais sintomas não são válidos.");
            }

            // Calcula pontuação total
            $pontuacao = array_reduce($sintomas, function ($total, $sintoma) use ($config) {
                if (!isset($config['sintomas'][$sintoma]['peso'])) {
                    throw new \RuntimeException("Peso não configurado para o sintoma: {$sintoma}");
                }
                return $total + $config['sintomas'][$sintoma]['peso'];
            }, 0);

            // Verifica combinações críticas
            $combinacaoCritica = false;
            foreach ($config['combinacoes_criticas'] as $combinacao) {
                if (empty(array_diff($combinacao, $sintomas))) {
                    $combinacaoCritica = true;
                    $resultado = [
                        'nivel_risco' => 'alto_risco',
                        'pontuacao' => $pontuacao,
                        'protocolo' => $config['protocolos']['alto_risco'],
                        'combinacao_critica' => true
                    ];
                    if ($id_paciente) {
                        $this->registrarHistorico($sintomas, $resultado, $id_paciente);
                    }
                    return $resultado;
                }
            }

            // Determina nível de risco baseado na pontuação
            if (!isset($config['limiares_risco'])) {
                throw new \RuntimeException("Limiares de risco não configurados.");
            }

            if ($pontuacao >= $config['limiares_risco']['alto_risco']) {
                $nivel = 'alto_risco';
            } elseif ($pontuacao >= $config['limiares_risco']['medio_risco']) {
                $nivel = 'medio_risco';
            } else {
                $nivel = 'baixo_risco';
            }

            $resultado = [
                'nivel_risco' => $nivel,
                'pontuacao' => $pontuacao,
                'protocolo' => $config['protocolos'][$nivel],
                'combinacao_critica' => $combinacaoCritica
            ];

            if ($id_paciente) {
                $this->registrarHistorico($sintomas, $resultado, $id_paciente);
            }

            return $resultado;
        } catch (\Exception $e) {
            Log::error("Erro ao avaliar risco: " . $e->getMessage());
            throw new \RuntimeException("Erro ao processar avaliação de risco.". $e->getMessage(), 0, $e);
        }
    }

    /**
     * Gera uma chave única para cache baseada nos sintomas
     * @param array $sintomas Lista de sintomas informados pelo paciente
     * @return string Chave de cache gerada
     * @throws \RuntimeException Se ocorrer erro ao gerar chave de cache
     * @throws \InvalidArgumentException Se a lista de sintomas estiver vazia
     */
    protected function gerarChaveCache(array $sintomas): string
    {
        if (empty($sintomas)) {
            throw new \InvalidArgumentException("Lista de sintomas não pode estar vazia para gerar chave de cache.");
        }
        
        try {
            sort($sintomas);
            return 'avaliacao_risco_' . md5(implode(',', $sintomas));
        } catch (\Exception $e) {
            Log::error("Erro ao gerar chave de cache: " . $e->getMessage());
            throw new \RuntimeException("Erro ao gerar chave de cache para sintomas.", 0, $e);
        }
    }

    /**
     * Registra a avaliação no histórico se o usuário estiver autenticado
     * @param array $sintomas Lista de sintomas informados pelo paciente
     * @param array $resultado Resultado da avaliação (inclui nível de risco, pontuação e protocolo)
     * @param int|null $id_paciente ID do paciente (opcional, usado para registrar histórico)
     * @return bool Retorna true se o registro foi bem-sucedo.
     * @throws \InvalidArgumentException Se os sintomas ou resultado estiver
     * @throws \RuntimeException Se ocorrer erro ao registrar histórico
     */
    protected function registrarHistorico(array $sintomas, array $resultado, int|null $id_paciente=null): bool
    {
        try {
            if (auth()->check() && ($sintomas && $resultado)) {
                $historico = AvaliacaoRisco::create([
                    'sintomas' => json_encode($sintomas),
                    'resultado' => json_encode($resultado),
                    'id_paciente' => $id_paciente,
                    'id_usuario' => auth()->id(),
                ]);

                if (!$historico) {
                    throw new \RuntimeException(/*"Falha ao criar registro de histórico de avaliação."*/ );
                }else {
                    Log::info("Histórico de avaliação registrado com sucesso para o paciente ID: {$id_paciente}");
                    return true;
                }
            }else {
                $r = [
                    'sintomas' => $sintomas,
                    'resultado' => $resultado,
                    'id_paciente' => $id_paciente,
                ];

                $s = json_encode($r);
                Log::warning("Usuário não autenticado ou dados incompletos para registrar histórico: " . json_encode($r));
                throw new \RuntimeException("Usuário não autenticado. Não é possível registrar histórico de avaliação. $s");
            }
        } catch (\Exception $e) {
            Log::error("Erro ao registrar histórico de avaliação: " . $e->getMessage());
            throw new \RuntimeException("Erro ao registrar histórico de avaliação de risco.". $e->getMessage(), 0, $e);
        }
    }

    /**
     * Encontra o hospital mais próximo com base na localização do paciente.
     * Usa a classe OpenRouteService para calcular distâncias reais entre pontos.
     *
     * @param float $latitude Latitude do paciente
     * @param float $longitude Longitude do paciente
     * @return Hospital|null Retorna o hospital mais próximo ou null se não encontrado
     * @throws \RuntimeException Se ocorrer erro ao buscar hospitais
     */
    public function encontrarHospitalMaisProximo(float $latitude, float $longitude): ?Hospital
    {
        try {
            $hospitais = Hospital::all();
            
            if ($hospitais->isEmpty()) {
                Log::warning("Nenhum hospital encontrado no banco de dados.");
                return null;
            }

            $hospitalMaisProximo = null;
            $menorDistancia = PHP_INT_MAX;

            foreach ($hospitais as $hospital) {
                try {
                    $coordinates = [
                        [$longitude, $latitude],
                        [$hospital->longitude, $hospital->latitude]
                    ];

                    $openRoute = new OpenRouteService($coordinates);
                    
                    if (!$openRoute->sucesso()) {
                        Log::warning("Falha ao obter rota para hospital ID: {$hospital->id}");
                        continue;
                    }

                    $distancia = $openRoute->obterDistanciaTotal();
                    
                    if ($distancia !== null && $distancia < $menorDistancia) {
                        $menorDistancia = $distancia;
                        $hospitalMaisProximo = $hospital;
                    }
                } catch (\Exception $e) {
                    Log::error("Erro ao processar hospital ID {$hospital->id}: " . $e->getMessage());
                    continue;
                }
            }

            return $hospitalMaisProximo ?? $this->obterHospitalPadrao();

        } catch (\Exception $e) {
            Log::error('Erro ao buscar hospital via ORS: ' . $e->getMessage());
            return $this->obterHospitalPadrao();
        }
    }

    /**
     * Retorna um hospital padrão caso não seja possível calcular distâncias.
     * O hospital com maior capacidade de leitos é retornado como fallback.
     *
     * @return Hospital|null
     * @throws \RuntimeException Se ocorrer erro ao buscar hospital padrão
     */
    private function obterHospitalPadrao(): ?Hospital
    {
        try {
            $hospital = Hospital::orderBy('capacidade_leitos', 'desc')->first();
            
            if (!$hospital) {
                Log::critical("Nenhum hospital encontrado no banco de dados, mesmo para fallback.");
                return null;
            }
            
            return $hospital;
        } catch (\Exception $e) {
            Log::error("Erro ao obter hospital padrão: " . $e->getMessage());
            throw new \RuntimeException("Erro ao obter hospital padrão como fallback.", 0, $e);
        }
    }

    /**
     * Gera um QR Code contendo dados importantes do paciente.
     *
     * @param array $dadosPaciente Dados do paciente (ID, BI, resultado do triagem)
     * @param string $locale Idioma para tradução (opcional)
     * @return string Conteúdo do QR Code em formato PNG
     * @throws \InvalidArgumentException Se dados do paciente estiverem incompletos
     * @throws \RuntimeException Se ocorrer erro ao gerar QR Code
     */
    public function gerarQrCodeDoPaciente(array $dadosPaciente, $result, string $locale = 'pt'): string
    {
        if (empty($dadosPaciente['id_paciente']) || empty($dadosPaciente['numero_bi']) || empty($result['nivel_risco'])) {
            throw new \InvalidArgumentException("Dados do paciente incompletos para gerar QR Code.");
        }

        try {
            $conteudoQR = json_encode([
                'codigo' => $dadosPaciente['codigo'],
                'nome' => $dadosPaciente['nome'],
                'numero_bi' => $dadosPaciente['numero_bi'],
                'telefone' => $dadosPaciente['telefone'] ?? null,
                'resultado_triagem' => $this->traduzirResultado($result['nivel_risco'], $locale),
                //'protocolo' => $this->traduzirProtocolo($result['prioridade'], $locale)
            ]);

            if (json_last_error() !== JSON_ERROR_NONE) {
                throw new \RuntimeException("Erro ao codificar dados do paciente para JSON: " . json_last_error_msg());
            }

            $qrCode = QrCode::size(200)
                ->format('png')
                ->generate($conteudoQR);

            if (empty($qrCode)) {
                throw new \RuntimeException("Falha ao gerar QR Code: conteúdo vazio retornado.");
            }

            return $qrCode;
        } catch (\Exception $e) {
            Log::error("Erro ao gerar QR Code: " . $e->getMessage());
            throw new \RuntimeException("Erro ao gerar QR Code para paciente.", 0, $e);
        }
    }

    /**
     * Traduz o resultado da triagem para o idioma especificado
     * @throws \InvalidArgumentException Se o resultado ou locale forem inválidos
     */
    protected function traduzirResultado(string $resultado, string $locale): string
    {
        if (empty($resultado)) {
            throw new \InvalidArgumentException("Resultado da triagem não pode estar vazio.");
        }

        $traducoes = [
            'pt' => [
                'alto_risco' => 'Alto Risco',
                'medio_risco' => 'Médio Risco',
                'baixo_risco' => 'Baixo Risco'
            ],
            'en' => [
                'alto_risco' => 'High Risk',
                'medio_risco' => 'Medium Risk',
                'baixo_risco' => 'Low Risk'
            ]
        ];

        if (!isset($traducoes[$locale])) {
            Log::warning("Locale não suportado para tradução: {$locale}");
            return $resultado;
        }

        if (!isset($traducoes[$locale][$resultado])) {
            Log::warning("Resultado não traduzível: {$resultado} para locale {$locale}");
            return $resultado;
        }

        return $traducoes[$locale][$resultado];
    }

    /**
     * Traduz o protocolo para o idioma especificado
     * @throws \RuntimeException Se ocorrer erro ao traduzir protocolo
     */
    protected function traduzirProtocolo(string $resultado, string $locale): array
    {
        try {
            $protocolos = config('triagem.protocolos.' . $resultado);
            
            if (empty($protocolos)) {
                throw new \RuntimeException("Protocolo não encontrado para resultado: {$resultado}");
            }

            if ($locale !== 'pt') {
                foreach ($protocolos as $key => $value) {
                    if (is_array($value)) {
                        foreach ($value as $k => $v) {
                            $protocolos[$key][$k] = $this->traduzirTexto($v, $locale);
                        }
                    } else {
                        $protocolos[$key] = $this->traduzirTexto($value, $locale);
                    }
                }
            }
            
            return $protocolos;
        } catch (\Exception $e) {
            Log::error("Erro ao traduzir protocolo: " . $e->getMessage());
            throw new \RuntimeException("Erro ao traduzir protocolo de triagem.", 0, $e);
        }
    }

    /**
     * Método auxiliar para tradução de texto
     * @throws \InvalidArgumentException Se o texto ou locale forem inválidos
     */
    protected function traduzirTexto(string $texto, string $locale): string
    {
        if (empty($texto)) {
            throw new \InvalidArgumentException("Texto para tradução não pode estar vazio.");
        }

        if (empty($locale)) {
            throw new \InvalidArgumentException("Locale para tradução não pode estar vazio.");
        }

        $traducoes = [
            'Encaminhamento imediato para unidade de emergência' => [
                'en' => 'Immediate referral to emergency unit'
            ],
            // Adicionar outras traduções conforme necessário
        ];

        if (!isset($traducoes[$texto][$locale])) {
            Log::warning("Texto não traduzível: {$texto} para locale {$locale}");
            return $texto;
        }

        return $traducoes[$texto][$locale];
    }
}