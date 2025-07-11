<?php

namespace App\Http\Controllers;

use App\Models\Paciente;
use App\Models\Hospital;
use App\Models\Viatura;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;

class DashboardController extends Controller
{
    public function overview(): JsonResponse
    {
        try {
            $hoje = Carbon::now();
            $ontem = $hoje->copy()->subDay();
            $semanaPassada = $hoje->copy()->subWeek();

            // Carregar todos os dados
            $dados = $this->carregarDadosCompletos();
            
            // Processar todos os dados usando arrays
            $resultados = [
                'casos_ativos' => $this->getCasosAtivos($dados),
                'novos_casos_24h' => $this->getNovosCasos24h($dados, $ontem, $hoje),
                'leitos' => $this->getDadosLeitos($dados),
                'ambulancias' => $this->getDadosAmbulancias($dados),
                'tendencias' => $this->calcularTendencias($dados, $ontem, $semanaPassada),
                'distribuicao_risco' => $this->getDistribuicaoRisco($dados),
                'recuperados' => $this->getRecuperados($dados),
                'atualizado_em' => $hoje->toDateTimeString(),
                'dados_completos' => $dados // Inclui todos os dados para depuração
            ];

            return response()->json([
                'success' => true,
                'data' => $resultados
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Erro ao gerar dados do dashboard: ' . $e->getMessage()
            ], 500);
        }
    }

    private function carregarDadosCompletos(): array
    {
        return [
            'pacientes' => Paciente::with(['avaliacaoRisco' => function($query) {
                $query->orderBy('created_at', 'desc');
            }])->get()->toArray(),
            
            'hospitais' => Hospital::with('pacientes')->get()->toArray(),
            
            'ambulancias' => Viatura::where('tipo', 'ambulancia')->get()->toArray()
        ];
    }

    private function processarResultadoAvaliacao(array $avaliacao): array
    {
        // Se já estiver processado, retorna diretamente
        if (isset($avaliacao['resultado_decoded'])) {
            return $avaliacao;
        }
        
        // Processar o campo resultado
        $resultadoString = $avaliacao['resultado'] ?? '{}';
        $avaliacao['resultado_decoded'] = json_decode($resultadoString, true) ?? [];
        
        return $avaliacao;
    }

    private function getNivelRisco(array $avaliacao): string
    {
        $avaliacao = $this->processarResultadoAvaliacao($avaliacao);
        return $avaliacao['resultado_decoded']['nivel_risco'] ?? 'desconhecido';
    }

    private function getCasosAtivos(array $dados): array
    {
        $casos = [
            'total' => 0,
            'alto_risco' => 0,
            'medio_risco' => 0,
            'a' => [],
        ];

        foreach ($dados['pacientes'] as $paciente) {
            // Ignorar pacientes internados
            //if (!empty($paciente['id_hospital'])) continue;
            
            $avaliacoes = $paciente['avaliacao_risco'] ?? [];
            
            $resultadoAvaliacao = json_decode($avaliacoes[0]['resultado'],true) ?? null;
            $ultimaAvaliacao = $resultadoAvaliacao ?? null;
            $casos['a'] = $ultimaAvaliacao;
            
            if ($ultimaAvaliacao) {
                $nivelRisco = $ultimaAvaliacao['nivel_risco'];//$this->getNivelRisco($ultimaAvaliacao);
                
                if (in_array($nivelRisco, ['alto_risco', 'medio_risco'])) {
                    $casos['total']++;
                    
                    if ($nivelRisco === 'alto_risco') {
                        $casos['alto_risco']++;
                    } elseif ($nivelRisco === 'medio_risco') {
                        $casos['medio_risco']++;
                    }
                }
            }
        }

        return $casos;
    }

    private function getRecuperados(array $dados): array
    {
        $recuperados = 0;

        foreach ($dados['pacientes'] as $paciente) {
            // Ignorar pacientes internados
            //if (!empty($paciente['id_hospital'])) continue;
            
            $avaliacoes = $paciente['avaliacao_risco'] ?? [];
            $ultimaAvaliacao = $avaliacoes[0] ?? null;
            
            // Verificar se a última avaliação é baixo risco
            if (!$ultimaAvaliacao) continue;
            
            $nivelAtual = $this->getNivelRisco($ultimaAvaliacao);
            if ($nivelAtual !== 'baixo_risco') continue;

            // Verificar histórico de alto risco
            $teveAltoRisco = false;
            foreach ($avaliacoes as $avaliacao) {
                $nivel = $this->getNivelRisco($avaliacao);
                if ($nivel === 'alto_risco') {
                    $teveAltoRisco = true;
                    break;
                }
            }

            if ($teveAltoRisco) {
                $recuperados++;
            }
        }

        return [
            'total' => $recuperados,
            'descricao' => 'Pacientes recuperados'
        ];
    }

    private function getNovosCasos24h(array $dados, Carbon $inicio, Carbon $fim): array
    {
        $resultado = [
            'total' => 0,
            'por_risco' => [
                'alto' => 0,
                'medio' => 0,
                'baixo' => 0
            ]
        ];

        foreach ($dados['pacientes'] as $paciente) {
            $criadoEm = Carbon::parse($paciente['created_at']);
            
            if ($criadoEm->between($inicio, $fim)) {
                $resultado['total']++;
                
                $avaliacoes = $paciente['avaliacao_risco'] ?? [];
                $ultimaAvaliacao = $avaliacoes[0] ?? null;
                $nivelRisco = 'baixo_risco';
                
                if ($ultimaAvaliacao) {
                    $nivelRisco = $this->getNivelRisco($ultimaAvaliacao);
                }
                
                switch ($nivelRisco) {
                    case 'alto_risco': $resultado['por_risco']['alto']++; break;
                    case 'medio_risco': $resultado['por_risco']['medio']++; break;
                    case 'baixo_risco': $resultado['por_risco']['baixo']++; break;
                }
            }
        }

        return $resultado;
    }

    private function getDadosLeitos(array $dados): array
    {
        $totalLeitos = 0;
        $pacientesInternados = 0;

        // Calcular capacidade total de leitos
        foreach ($dados['hospitais'] as $hospital) {
            $totalLeitos += $hospital['capacidade_leitos'];
        }

        // Contar pacientes internados
        foreach ($dados['pacientes'] as $paciente) {
            if (!empty($paciente['id_hospital'])) {
                $pacientesInternados++;
            }
        }

        $disponiveis = max(0, $totalLeitos - $pacientesInternados);
        $percentual = $totalLeitos > 0 ? round(($pacientesInternados / $totalLeitos) * 100, 2) : 0;

        return [
            'total' => $totalLeitos,
            'ocupados' => $pacientesInternados,
            'disponiveis' => $disponiveis,
            'percentual_ocupacao' => $percentual
        ];
    }

    private function getDadosAmbulancias(array $dados): array
    {
        $resultado = [
            'total' => 0,
            'disponiveis' => 0,
            'em_uso' => 0,
            'manutencao' => 0
        ];

        foreach ($dados['ambulancias'] as $ambulancia) {
            $resultado['total']++;
            
            switch ($ambulancia['status']) {
                case 'disponivel': $resultado['disponiveis']++; break;
                case 'em_uso': $resultado['em_uso']++; break;
                case 'manutencao': $resultado['manutencao']++; break;
            }
        }

        return $resultado;
    }

    private function getDistribuicaoRisco(array $dados): array
    {
        $distribuicao = [];

        foreach ($dados['pacientes'] as $paciente) {
            $avaliacoes = $paciente['avaliacao_risco'] ?? [];
            $ultimaAvaliacao = $avaliacoes[0] ?? null;
            $nivelRisco = 'desconhecido';
            
            if ($ultimaAvaliacao) {
                $nivelRisco = $this->getNivelRisco($ultimaAvaliacao);
            }

            if (!isset($distribuicao[$nivelRisco])) {
                $distribuicao[$nivelRisco] = 0;
            }
            $distribuicao[$nivelRisco]++;
        }

        // Converter para formato de saída
        $resultado = [];
        foreach ($distribuicao as $nivel => $quantidade) {
            $resultado[] = [
                'nivel' => $nivel,
                'quantidade' => $quantidade
            ];
        }

        return $resultado;
    }

    private function calcularTendencias(array $dados, Carbon $ontem, Carbon $semanaPassada): array
    {
        // 1. Casos ativos hoje
        $casosAtivosHoje = $this->getCasosAtivos($dados)['total'];
        
        // 2. Casos ativos ontem
        $casosAtivosOntem = 0;
        foreach ($dados['pacientes'] as $paciente) {
            // Ignorar pacientes internados
            //if (!empty($paciente['id_hospital'])) continue;
            
            $criadoEm = Carbon::parse($paciente['created_at']);
            if ($criadoEm->greaterThan($ontem)) continue;
            
            // Encontrar avaliação mais recente antes de ontem
            $avaliacoes = $paciente['avaliacao_risco'] ?? [];
            $avaliacaoValida = null;
            
            foreach ($avaliacoes as $avaliacao) {
                $avaliacaoData = Carbon::parse($avaliacao['created_at']);
                
                if ($avaliacaoData->lte($ontem)) {
                    $nivelRisco = $this->getNivelRisco($avaliacao);
                    if (in_array($nivelRisco, ['alto_risco', 'medio_risco'])) {
                        $casosAtivosOntem++;
                    }
                    break;
                }
            }
        }

        // 3. Novos casos hoje
        $novosCasosHoje = $this->getNovosCasos24h($dados, $ontem, Carbon::now())['total'];
        
        // 4. Novos casos semana passada
        $novosCasosSemanaPassada = 0;
        $inicioSemanaPassada = $semanaPassada->copy()->subDay();
        foreach ($dados['pacientes'] as $paciente) {
            $criadoEm = Carbon::parse($paciente['created_at']);
            if ($criadoEm->between($inicioSemanaPassada, $semanaPassada)) {
                $novosCasosSemanaPassada++;
            }
        }

        // 5. Leitos ocupados hoje
        $leitosOcupadosHoje = 0;
        foreach ($dados['pacientes'] as $paciente) {
            if (!empty($paciente['id_hospital'])) {
                $leitosOcupadosHoje++;
            }
        }
        
        // 6. Leitos ocupados semana passada
        $leitosOcupadosSemanaPassada = 0;
        foreach ($dados['pacientes'] as $paciente) {
            if (!empty($paciente['id_hospital'])) {
                $criadoEm = Carbon::parse($paciente['created_at']);
                if ($criadoEm->lte($semanaPassada)) {
                    $leitosOcupadosSemanaPassada++;
                }
            }
        }

        // 7. Ambulâncias disponíveis hoje
        $ambulanciasHoje = $this->getDadosAmbulancias($dados)['disponiveis'];
        
        // 8. Ambulâncias disponíveis semana passada
        $ambulanciasSemanaPassada = 0;
        foreach ($dados['ambulancias'] as $ambulancia) {
            if ($ambulancia['status'] === 'disponivel') {
                $criadoEm = Carbon::parse($ambulancia['created_at']);
                if ($criadoEm->lte($semanaPassada)) {
                    $ambulanciasSemanaPassada++;
                }
            }
        }

        return [
            'casos_ativos' => $this->calcularVariacao($casosAtivosHoje, $casosAtivosOntem),
            'novos_casos' => $this->calcularVariacao($novosCasosHoje, $novosCasosSemanaPassada),
            'leitos_ocupados' => $this->calcularVariacao($leitosOcupadosHoje, $leitosOcupadosSemanaPassada),
            'ambulancias_disponiveis' => $this->calcularVariacao($ambulanciasHoje, $ambulanciasSemanaPassada)
        ];
    }

    private function calcularVariacao(float $atual, float $anterior): array
    {
        $variacao = $atual - $anterior;
        $percentual = $anterior != 0 ? ($variacao / $anterior) * 100 : 0;

        return [
            'valor' => abs($variacao),
            'percentual' => round(abs($percentual), 2) . '%',
            'tendencia' => $percentual > 0 ? 'aumento' : ($percentual < 0 ? 'reducao' : 'estavel'),
            'detalhes' => $this->getDescricaoTendencia($percentual)
        ];
    }

    private function getDescricaoTendencia(float $percentual): string
    {
        $abs = abs($percentual);
        $tipo = $percentual > 0 ? 'aumento' : 'reducao';

        if ($abs < 5) return 'Estabilidade';
        if ($abs < 15) return "Pequeno $tipo";
        if ($abs < 30) return ucfirst("{$tipo} moderado");
        return ucfirst("{$tipo} significativo");
    }
}