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
    /**
     * @OA\Get(
     *     path="/relatorio",
     *     summary="Listar relatórios",
     *     tags={"Relatórios"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Response(
     *         response=200,
     *         description="Lista de relatórios",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean"),
     *             @OA\Property(property="data", type="array", @OA\Items(type="object"))
     *         )
     *     ),
     *     @OA\Response(
     *         response=500,
     *         description="Erro ao listar relatórios"
     *     )
     * )
     */
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

    /**
     * @OA\Post(
     *     path="/relatorio",
     *     summary="Criar relatório",
     *     tags={"Relatórios"},
     *     security={{"bearerAuth":{}}},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"tipo","dados"},
     *             @OA\Property(property="tipo", type="string", enum={
     *                 "casos_por_regiao","evolucao_temporal","distribuicao_demografica",
     *                 "casos_por_sexo","casos_por_idade","casos_por_hospital",
     *                 "casos_por_municipio","casos_por_resultado_triagem","outro"
     *             }),
     *             @OA\Property(property="dados", type="string", description="JSON dos dados do relatório")
     *         )
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Relatório criado",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean"),
     *             @OA\Property(property="data", type="object")
     *         )
     *     ),
     *     @OA\Response(
     *         response=400,
     *         description="Não é possível salvar relatório sem dados."
     *     ),
     *     @OA\Response(
     *         response=422,
     *         description="Erro de validação"
     *     ),
     *     @OA\Response(
     *         response=500,
     *         description="Erro ao criar relatório"
     *     )
     * )
     */
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

    /**
     * @OA\Get(
     *     path="/relatorio/{id}",
     *     summary="Exibir relatório",
     *     tags={"Relatórios"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         description="ID do relatório",
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Dados do relatório",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean"),
     *             @OA\Property(property="data", type="object")
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Relatório não encontrado"
     *     ),
     *     @OA\Response(
     *         response=500,
     *         description="Erro ao exibir relatório"
     *     )
     * )
     */
    public function show(Relatorio $relatorio): JsonResponse
    {
        $this->authorize('view', $relatorio);

        return response()->json([
            'success' => true,
            'data' => $relatorio
        ]);
    }

    /**
     * @OA\Get(
     *     path="/relatorio/{id}/pdf",
     *     summary="Gerar PDF do relatório",
     *     tags={"Relatórios"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         description="ID do relatório",
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="PDF gerado (base64)",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean"),
     *             @OA\Property(property="file", type="string", description="PDF em base64")
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Relatório não encontrado"
     *     ),
     *     @OA\Response(
     *         response=500,
     *         description="Erro ao gerar PDF"
     *     )
     * )
     */
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

    /**
     * @OA\Delete(
     *     path="/relatorio/{id}",
     *     summary="Excluir relatório",
     *     tags={"Relatórios"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         description="ID do relatório",
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Relatório removido com sucesso",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean"),
     *             @OA\Property(property="message", type="string")
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Relatório não encontrado"
     *     ),
     *     @OA\Response(
     *         response=500,
     *         description="Erro ao remover relatório"
     *     )
     * )
     */
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
