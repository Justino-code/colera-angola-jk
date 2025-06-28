<?php
namespace App\Http\Controllers;

use App\Models\Relatorio;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;
use App\Services\RelatorioService;
use App\Services\GeradorRelatorioPDFService;

class RelatorioController extends Controller
{
    public function index(): JsonResponse
    {
        try {
            $this->authorize('viewAny', Relatorio::class);
            if (auth()->user()->hasRole('admin') && auth()->user()->hasRole('')) {
                $relatorios = Relatorio::all();
            }else{
                $relatorios = auth()->user()->relatorios;
            }

            return response()->json([
                'success' => true,
                'data' => $relatorios,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Erro ao listar relatórios: ' . $e->getMessage()
            ], 500);
        }
    }

    public function store(Request $request, RelatorioService $service): JsonResponse
    {
        try {
            $this->authorize('create', Relatorio::class);

            $validator = Validator::make($request->all(), [
                'tipo' => 'required|in:casos_por_regiao,evolucao_temporal,distribuicao_demografica,casos_por_sexo,casos_por_idade,casos_por_hospital,casos_por_municipio,casos_por_resultado_triagem,outro',
                'dados' => 'required|json'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'errors' => $validator->errors()
                ], 422);
            }

            $validated = $validator->validated();

            // Verificação extra: não permitir salvar relatório sem dados válidos
            $dadosArray = json_decode($validated['dados'], true);
            if (
                empty($dadosArray) ||
                !is_array($dadosArray) ||
                count($dadosArray) === 0
            ) {
                return response()->json([
                    'success' => false,
                    'error' => 'Não é possível salvar relatório sem dados.'
                ], 400);
            }

            $relatorio = $service->criarRelatorio(auth()->id(), $validated['tipo'], $validated['dados']);

            return response()->json([
                'success' => true,
                'data' => $relatorio,
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Erro ao criar relatório: ' . $e->getMessage()
            ], 500);
        }
    }

    public function show(Relatorio $relatorio): JsonResponse
    {
        $this->authorize('view', $relatorio);

        return response()->json([
            'success' => true,
            'data' => $relatorio
        ]);
    }

    public function gerarPdf($id, GeradorRelatorioPDFService $pdfService): JsonResponse
    {
        try {
            $relatorio = Relatorio::findOrFail($id);
            $this->authorize('view', $relatorio);

            $pdfOutput = $pdfService->gerarPDF($relatorio);

            return response()->json([
                'success' => true,
                'file' => base64_encode($pdfOutput)
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Erro ao gerar PDF: ' . $e->getMessage()
            ], 500);
        }
    }

    public function destroy(Relatorio $relatorio): JsonResponse
    {
        try {
            $this->authorize('delete', $relatorio);
            $relatorio->delete();

            return response()->json([
                'success' => true,
                'message' => 'Relatório removido com sucesso.'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Erro ao remover relatório: ' . $e->getMessage()
            ], 500);
        }
    }
}
