<?php

namespace App\Services;

use App\Models\Hospital;
use Illuminate\Support\Facades\Log;
use SimpleSoftwareIO\QrCode\Facades\QrCode;

class TriageService
{
    /**
     * Avalia os sintomas do paciente e determina o risco de cólera (alto ou baixo).
     *
     * @param array $sintomas Lista de sintomas informados pelo paciente (em português)
     * @return string 'alto_risco' ou 'baixo_risco'
     * @throws \InvalidArgumentException Se algum sintoma não for válido
     */
    public function avaliarRisco(array $sintomas): string
    {
        // Sintomas críticos associados à cólera
        $sintomasCriticos = config('triagem.sintomasCriticos');

        // Valida se todos os sintomas fornecidos são válidos
        $opcoesValidas = array_keys(config('triagem.sintomas'));

        if (!empty(array_diff($sintomas, $opcoesValidas))) {
            //dd($sintomas);
            throw new \InvalidArgumentException("Um ou mais sintomas não são válidos.");
        }

        // Verifica quantos sintomas críticos foram informados
        $pontuacao = count(array_intersect($sintomas, $sintomasCriticos));

        return $pontuacao >= 2 ? 'alto_risco' : 'baixo_risco';
    }

    /**
     * Encontra o hospital mais próximo com base na localização do paciente.
     * Usa a classe OpenRouteService para calcular distâncias reais entre pontos.
     *
     * @param float $latitude Latitude do paciente
     * @param float $longitude Longitude do paciente
     * @return Hospital|null Retorna o hospital mais próximo ou null se não encontrado
     */
    public function encontrarHospitalMaisProximo(float $latitude, float $longitude): ?Hospital
    {
        try {
            $hospitais = Hospital::all();
            $hospitalMaisProximo = null;
            $menorDistancia = PHP_INT_MAX;
            $d = [];
            $o = [];

            foreach ($hospitais as $hospital) {
                // Coordenadas do paciente e do hospital
                $coordinates = [
                    [$longitude, $latitude],
                    [$hospital->longitude, $hospital->latitude]
                ];

                // Nova classe: faz a requisição ao OpenRouteService
                $openRoute = new OpenRouteService($coordinates);
                array_push($o,$openRoute->obterDadosBrutos()['routes'][0]['summary']['distance']);

                if (!$openRoute->sucesso()) {
                    continue; // Ignora hospitais com falha na rota
                }

                $distancia = $openRoute->obterDistanciaTotal();
                array_push($d,[$distancia,$hospital->nome]);

                if ($distancia !== null && $distancia < $menorDistancia) {
                    $menorDistancia = $distancia;
                    $hospitalMaisProximo = $hospital;
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
     */
    private function obterHospitalPadrao(): ?Hospital
    {
        return Hospital::orderBy('capacidade_leitos', 'desc')->first();
    }

    /**
     * Gera um QR Code contendo dados importantes do paciente.
     *
     * @param array $dadosPaciente Dados do paciente (ID, BI, resultado do triagem)
     * @return string Conteúdo do QR Code em formato PNG
     */
    public function gerarQrCodeDoPaciente(array $dadosPaciente): string
    {
        $conteudoQR = json_encode([
            'id' => $dadosPaciente['id_paciente'],
            'numero_bi' => $dadosPaciente['numero_bi'],
            'telefone' => $dadosPaciente['telefone'],
            'resultado_triagem' => $dadosPaciente['resultado_triagem']
        ]);

        return QrCode::size(200)
        ->format('png')
        ->generate($conteudoQR);
    }
}
