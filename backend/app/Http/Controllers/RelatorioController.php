<?php

namespace App\Http\Controllers;

use App\Models\Relatorio;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;
use PDF;

class RelatorioController extends Controller
{
    // Listar relatórios do usuário logado
    public function index(): JsonResponse
    {
        try {
            $relatorios = auth()->user()->relatorios;

            return response()->json([
                'success' => true,
                'data' => $relatorios
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Erro ao listar relatórios: ' . $e->getMessage()
            ], 500);
        }
    }

    // Gerar relatório em PDF
    public function generatePDF(Request $request): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'tipo' => 'required|in:casos_por_regiao,evolucao_temporal,distribuicao_demografica,outro',
                'dados' => 'required|json'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'errors' => $validator->errors()
                ], 422);
            }

            $validated = $validator->validated();

            $relatorio = Relatorio::create([
                'tipo' => $validated['tipo'],
                'dados' => $validated['dados'],
                'id_usuario' => auth()->id()
            ]);

            $pdf = PDF::loadView('relatorio', ['data' => json_decode($relatorio->dados, true)]);

            // Salvar o PDF opcionalmente ou apenas retornar o download
            return response()->json([
                'success' => true,
                'file' => base64_encode($pdf->output()) // Ou gerar um link se estiver salvando no servidor
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Erro ao gerar PDF: ' . $e->getMessage()
            ], 500);
        }
    }

    // Excluir relatório
    public function destroy(Relatorio $relatorio): JsonResponse
    {
        try {
            $this->authorize('delete', $relatorio);

            $relatorio->delete();

            return response()->json([
                'success' => true,
                'message' => 'Relatório removido com sucesso.'
            ]);
        } catch (\Illuminate\Auth\Access\AuthorizationException $e) {
            return response()->json([
                'success' => false,
                'error' => 'Acesso negado: ' . $e->getMessage()
            ], 403);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Erro ao remover relatório: ' . $e->getMessage()
            ], 500);
        }
    }
}

