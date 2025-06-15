<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use App\Models\Paciente;
use App\Models\Hospital;
use App\Models\Viatura;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function overview(): JsonResponse
    {
        // --- Pacientes ativos ---
        $casosAtivosHoje = Paciente::where('resultado_triagem', 'alto_risco')->count();
        $casosAtivosOntem = Paciente::where('resultado_triagem', 'baixo_risco')
            ->whereDate('updated_at', now()->subDay())->count();

        // --- Novos casos ---
        $novosCasosHoje = Paciente::whereDate('created_at', now())->count();
        $novosCasosOntem = Paciente::whereDate('created_at', now()->subDay())->count();

        // --- Leitos ---
        $totalLeitos = Hospital::sum('capacidade_leitos');
        $leitosOcupados = $totalLeitos - $casosAtivosHoje;
        $percentualLeitos = $totalLeitos > 0 ? round(($leitosOcupados / $totalLeitos) * 100) : 0;

        // --- Ambulâncias ---
        $totalAmbulancias = Viatura::where('tipo', 'ambulancia')->count();
        $ambulanciasAtivas = Viatura::where('tipo', 'ambulancia')->where('status', 'disponivel')->count();

        // --- Tendência: função auxiliar ---
        $trend = function ($hoje, $ontem) {
            if ($ontem == 0) return $hoje > 0 ? '+100%' : '0%';
            $percent = round((($hoje - $ontem) / $ontem) * 100, 1);
            return ($percent >= 0 ? '+' : '') . $percent . '%';
        };

        return response()->json([
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
                'ambulancias_ativas' => $trend($ambulanciasAtivas, $totalAmbulancias), // ou histórico real se tiver
                'novos_casos_24h' => $trend($novosCasosHoje, $novosCasosOntem),
            ],
        ]);
    }
}
