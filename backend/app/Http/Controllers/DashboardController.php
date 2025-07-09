<?php

namespace App\Http\Controllers;

use App\Models\Paciente;
use App\Models\AvaliacaoRisco;
use App\Models\Hospital;
use App\Models\Viatura;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function overview(): JsonResponse
    {
        try {
            $hoje = Carbon::now();
            $ontem = $hoje->copy()->subDay();
            $semanaPassada = $hoje->copy()->subWeek();

            // 1. Dados principais de pacientes (sempre usando a última avaliação)
            $casosAtivos = $this->getCasosAtivos();
            $novosCasos24h = $this->getNovosCasos24h($ontem, $hoje);
            
            // 2. Dados de leitos
            $dadosLeitos = $this->getDadosLeitos($casosAtivos['total']);
            
            // 3. Dados de ambulâncias
            $dadosAmbulancias = $this->getDadosAmbulancias();

            // 4. Tendências (considerando a última avaliação em cada período)
            $tendencias = $this->calcularTendencias($ontem, $semanaPassada);

            // 5. Distribuição por risco (baseado nas últimas avaliações)
            $distribuicaoRisco = $this->getDistribuicaoRisco();

            return response()->json([
                'success' => true,
                'data' => [
                    'casos_ativos' => $casosAtivos,
                    'novos_casos_24h' => $novosCasos24h,
                    'leitos' => $dadosLeitos,
                    'ambulancias' => $dadosAmbulancias,
                    'tendencias' => $tendencias,
                    'distribuicao_risco' => $distribuicaoRisco,
                    'atualizado_em' => $hoje->toDateTimeString()
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Erro ao gerar dados do dashboard: ' . $e->getMessage()
            ], 500);
        }
    }

    private function getCasosAtivos(): array
    {
        // Subquery para obter a última avaliação de cada paciente ativo
        $ultimasAvaliacoes = AvaliacaoRisco::select(
                'id_paciente',
                DB::raw('MAX(created_at) as ultima_avaliacao')
            )
            ->groupBy('id_paciente');

        // Contagem de pacientes ativos por nível de risco
        $resultados = DB::table('paciente')
            ->leftJoinSub($ultimasAvaliacoes, 'ultimas', function($join) {
                $join->on('paciente.id_paciente', '=', 'ultimas.id_paciente');
            })
            ->leftJoin('avaliacao_riscos', function($join) {
                $join->on('avaliacao_riscos.id_paciente', '=', 'ultimas.id_paciente')
                    ->on('avaliacao_riscos.created_at', '=', 'ultimas.ultima_avaliacao');
            })
            ->whereNull('paciente.id_hospital')
            ->select(
                DB::raw('COUNT(paciente.id_paciente) as total'),
                DB::raw('SUM(CASE WHEN JSON_UNQUOTE(JSON_EXTRACT(avaliacao_riscos.resultado, "$.nivel_risco")) = "alto_risco" THEN 1 ELSE 0 END) as alto_risco'),
                DB::raw('SUM(CASE WHEN JSON_UNQUOTE(JSON_EXTRACT(avaliacao_riscos.resultado, "$.nivel_risco")) = "medio_risco" THEN 1 ELSE 0 END) as medio_risco'),
                DB::raw('SUM(CASE WHEN JSON_UNQUOTE(JSON_EXTRACT(avaliacao_riscos.resultado, "$.nivel_risco")) = "baixo_risco" THEN 1 ELSE 0 END) as baixo_risco')
            )
            ->first();

        return [
            'total' => $resultados->total ?? 0,
            'alto_risco' => $resultados->alto_risco ?? 0,
            'medio_risco' => $resultados->medio_risco ?? 0,
            'baixo_risco' => $resultados->baixo_risco ?? 0,
            'resultado' => $resultados
        ];
    }

    private function getNovosCasos24h(Carbon $inicio, Carbon $fim): array
    {
        // Subquery para obter a última avaliação de cada paciente
        $ultimasAvaliacoes = AvaliacaoRisco::select(
                'id_paciente',
                DB::raw('MAX(created_at) as ultima_avaliacao')
            )
            ->groupBy('id_paciente');

        // Contagem de novos pacientes por nível de risco (última avaliação)
        $resultados = DB::table('paciente')
            ->leftJoinSub($ultimasAvaliacoes, 'ultimas', function($join) {
                $join->on('paciente.id_paciente', '=', 'ultimas.id_paciente');
            })
            ->leftJoin('avaliacao_riscos', function($join) {
                $join->on('avaliacao_riscos.id_paciente', '=', 'ultimas.id_paciente')
                    ->on('avaliacao_riscos.created_at', '=', 'ultimas.ultima_avaliacao');
            })
            ->whereBetween('paciente.created_at', [$inicio, $fim])
            ->select(
                DB::raw('COUNT(paciente.id_paciente) as total'),
                DB::raw('SUM(CASE WHEN JSON_UNQUOTE(JSON_EXTRACT(avaliacao_riscos.resultado, "$.nivel_risco")) = "alto_risco" THEN 1 ELSE 0 END) as alto'),
                DB::raw('SUM(CASE WHEN JSON_UNQUOTE(JSON_EXTRACT(avaliacao_riscos.resultado, "$.nivel_risco")) = "medio_risco" THEN 1 ELSE 0 END) as medio'),
                DB::raw('SUM(CASE WHEN JSON_UNQUOTE(JSON_EXTRACT(avaliacao_riscos.resultado, "$.nivel_risco")) = "baixo_risco" THEN 1 ELSE 0 END) as baixo')
            )
            ->first();

        return [
            'total' => $resultados->total ?? 0,
            'por_risco' => [
                'alto' => $resultados->alto ?? 0,
                'medio' => $resultados->medio ?? 0,
                'baixo' => $resultados->baixo ?? 0
            ]
        ];
    }

    private function getDadosLeitos(int $casosAtivos): array
    {
        $totalLeitos = Hospital::sum('capacidade_leitos');
        $leitosOcupados = Paciente::whereNotNull('id_hospital')->count();
        
        return [
            'total' => $totalLeitos,
            'ocupados' => $leitosOcupados,
            'disponiveis' => max(0, $totalLeitos - $leitosOcupados),
            'percentual_ocupacao' => $totalLeitos > 0 ? 
                round(($leitosOcupados / $totalLeitos) * 100, 2) : 0
        ];
    }

    private function getDadosAmbulancias(): array
    {
        return [
            'total' => Viatura::where('tipo', 'ambulancia')->count(),
            'disponiveis' => Viatura::where('tipo', 'ambulancia')
                                   ->where('status', 'disponivel')
                                   ->count(),
            'em_uso' => Viatura::where('tipo', 'ambulancia')
                             ->where('status', 'em_uso')
                             ->count(),
            'manutencao' => Viatura::where('tipo', 'ambulancia')
                                 ->where('status', 'manutencao')
                                 ->count()
        ];
    }

    private function calcularTendencias(Carbon $ontem, Carbon $semanaPassada): array
    {
        // Casos ativos (considerando última avaliação)
        $casosAtivosHoje = $this->getContagemPacientesAtivos();
        $casosAtivosOntem = $this->getContagemPacientesAtivos($ontem);
        
        // Novos casos (não precisa de avaliação, pois é por criação)
        $novosCasosHoje = Paciente::whereBetween('created_at', [$ontem, Carbon::now()])->count();
        $novosCasosSemanaPassada = Paciente::whereBetween('created_at', [
            $semanaPassada->copy()->subDay(), 
            $semanaPassada
        ])->count();

        return [
            'casos_ativos' => $this->calcularVariacao($casosAtivosHoje, $casosAtivosOntem),
            'novos_casos' => $this->calcularVariacao($novosCasosHoje, $novosCasosSemanaPassada),
            'leitos_ocupados' => $this->calcularVariacao(
                Paciente::whereNotNull('id_hospital')->count(),
                Paciente::whereNotNull('id_hospital')
                       ->where('created_at', '<=', $semanaPassada)
                       ->count()
            ),
            'ambulancias_disponiveis' => $this->calcularVariacao(
                Viatura::where('tipo', 'ambulancia')->where('status', 'disponivel')->count(),
                Viatura::where('tipo', 'ambulancia')
                      ->where('status', 'disponivel')
                      ->where('created_at', '<=', $semanaPassada)
                      ->count()
            )
        ];
    }

    private function getContagemPacientesAtivos(?Carbon $dataLimite = null): int
    {
        $query = Paciente::whereNull('id_hospital');

        if ($dataLimite) {
            $query->where('created_at', '<=', $dataLimite);
        }

        return $query->count();
    }

    private function calcularVariacao(float $atual, float $anterior): array
    {
        if ($anterior == 0) {
            return [
                'valor' => $atual,
                'percentual' => '0%',
                'tendencia' => $atual > 0 ? 'aumento' : 'estavel',
                'detalhes' => $atual > 0 ? 'Novos casos registrados' : 'Sem variação'
            ];
        }

        $variacao = $atual - $anterior;
        $percentual = ($variacao / $anterior) * 100;

        return [
            'valor' => abs($variacao),
            'percentual' => round(abs($percentual), 2) . '%',
            'tendencia' => $percentual > 0 ? 'aumento' : ($percentual < 0 ? 'reducao' : 'estavel'),
            'detalhes' => $this->getDescricaoTendencia($percentual)
        ];
    }

    private function getDescricaoTendencia(float $percentual): string
    {
        $absPercentual = abs($percentual);

        if ($absPercentual < 5) return 'Estabilidade';
        if ($absPercentual < 15) return $percentual > 0 ? 'Pequeno aumento' : 'Pequena redução';
        if ($absPercentual < 30) return $percentual > 0 ? 'Aumento moderado' : 'Redução moderada';
        return $percentual > 0 ? 'Aumento significativo' : 'Redução significativa';
    }

    private function getDistribuicaoRisco(): array
    {
        // Subquery para obter apenas a última avaliação de cada paciente
        $subquery = AvaliacaoRisco::select(
                'id_paciente',
                DB::raw('MAX(created_at) as ultima_avaliacao')
            )
            ->groupBy('id_paciente');

        // Distribuição por nível de risco
        $resultados = DB::table('avaliacao_riscos')
            ->joinSub($subquery, 'ultimas', function($join) {
                $join->on('avaliacao_riscos.id_paciente', '=', 'ultimas.id_paciente')
                    ->on('avaliacao_riscos.created_at', '=', 'ultimas.ultima_avaliacao');
            })
            ->select(
                DB::raw('JSON_UNQUOTE(JSON_EXTRACT(avaliacao_riscos.resultado, "$.nivel")) as nivel'),
                DB::raw('COUNT(*) as quantidade')
            )
            ->groupBy('nivel')
            ->orderBy('quantidade', 'desc')
            ->get();

        return $resultados->map(function($item) {
            return [
                'nivel' => $item->nivel,
                'quantidade' => $item->quantidade
            ];
        })->toArray();
    }
}