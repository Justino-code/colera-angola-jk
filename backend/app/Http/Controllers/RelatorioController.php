<?php

namespace App\Http\Controllers;

use App\Models\Relatorio;
use Illuminate\Http\Request;
use PDF;

class RelatorioController extends Controller
{
    // Listar relatórios do usuário logado
    public function index()
    {
        return auth()->user()->relatorios;
    }

    // Gerar relatório em PDF
    public function generatePDF(Request $request)
    {
        $request->validate([
            'tipo' => 'required|in:casos_por_regiao,evolucao_temporal,distribuicao_demografica,outro',
            'dados' => 'required|json'
        ]);

        $relatorio = Relatorio::create([
            'tipo' => $request->tipo,
            'dados' => $request->dados,
            'id_usuario' => auth()->id()
        ]);

        $pdf = PDF::loadView('relatorio', ['data' => $relatorio->dados]);
        return $pdf->download('relatorio.pdf');
    }

    // Excluir relatório
    public function destroy(Relatorio $relatorio)
    {
        $this->authorize('delete', $relatorio); // Policy para verificar permissão
        $relatorio->delete();
        return response()->json(null, 204);
    }
}
