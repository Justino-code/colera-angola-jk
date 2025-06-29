<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use App\Models\Paciente;
use App\Models\Hospital;
use App\Models\Viatura;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    /**
     * @OA\Get(
     *     path="/dashboard/",
     *     summary="Resumo geral do dashboard",
     *     tags={"Dashboard"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Response(
     *         response=200,
     *         description="Dados do dashboard",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean"),
     *             @OA\Property(
     *                 property="data",
     *                 type="object",
     *                 @OA\Property(property="casos_ativos", type="integer"),
     *                 @OA\Property(property="novos_casos_24h", type="integer"),
     *                 @OA\Property(property="leitos_ocupados", type="integer"),
     *                 @OA\Property(
     *                     property="ambulancias_ativas",
     *                     type="object",
     *                     @OA\Property(property="ativas", type="integer"),
     *                     @OA\Property(property="total", type="integer")
     *                 ),
     *                 @OA\Property(
     *                     property="tendencias",
     *                     type="object",
     *                     @OA\Property(property="casos_ativos", type="string"),
     *                     @OA\Property(property="leitos_ocupados", type="string"),
     *                     @OA\Property(property="ambulancias_ativas", type="string"),
     *                     @OA\Property(property="novos_casos_24h", type="string")
     *                 )
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=500,
     *         description="Erro ao gerar dados do dashboard"
     *     )
     * )
     */
    public function overview(): JsonResponse
    {
        try {
            // --- Pacientes ativos ---
            $casosAtivosHoje = Paciente::where('resultado_triagem', 'alto_risco')->count();
            $casosAtivosOntem = Paciente::where('resultado_triagem', 'baixo_risco')
                ->whereDate('updated_at', now()->subDay())->count();

            // --- Novos casos ---
            $novosCasosHoje = Paciente::whereDate('created_at', now())->count();
            $novosCasosOntem = Paciente::whereDate('created_at', now()->subDay())->count();

            // --- Leitos ---
            $totalLeitos = Hospital::sum('capacidade_leitos');
            $leitosOcupados = max(0, $totalLeitos - $casosAtivosHoje);
            $percentualLeitos = $totalLeitos > 0 ? round(($leitosOcupados / $totalLeitos) * 100) : 0;

            // --- Ambulâncias ---
            $totalAmbulancias = Viatura::where('tipo', 'ambulancia')->count();
            $ambulanciasAtivas = Viatura::where('tipo', 'ambulancia')->where('status', 'disponivel')->count();

            // --- Tendência ---
            $trend = function ($hoje, $ontem) {
                if ($ontem == 0) return $hoje > 0 ? '+100%' : '0%';
                $percent = round((($hoje - $ontem) / $ontem) * 100, 1);
                return ($percent >= 0 ? '+' : '') . $percent . '%';
            };

            return response()->json([
                'success' => true,
                'data' => [
                    'casos_ativos' => $casosAtivosHoje,
                    'novos_casos_24h' => $novosCasosHoje,
                    'leitos_ocupados' => $percentualLeitos,
                    'ambulancias_ativas' => [
                        'ativas' => $ambulanciasAtivas,
                        'total' => $totalAmbulancias,
                    ],
                    'tendencias' => [
                        'casos_ativos' => $trend($casosAtivosHoje, $casosAtivosOntem),
                        'leitos_ocupados' => $trend($leitosOcupados, $totalLeitos - $casosAtivosOntem),
                        'ambulancias_ativas' => $trend($ambulanciasAtivas, $totalAmbulancias), // ajustar se houver histórico
                        'novos_casos_24h' => $trend($novosCasosHoje, $novosCasosOntem),
                    ]
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Erro ao gerar dados do dashboard: ' . $e->getMessage()
            ], 500);
        }
    }
}

