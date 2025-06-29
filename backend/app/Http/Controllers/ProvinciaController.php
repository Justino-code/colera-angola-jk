<?php

namespace App\Http\Controllers;

use App\Models\Provincia;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;
use App\Utils\GerarCodigoIso;

class ProvinciaController extends Controller
{
    /**
     * @OA\Get(
     *     path="/provincia",
     *     summary="Listar todas as províncias",
     *     tags={"Províncias"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Response(
     *         response=200,
     *         description="Lista de províncias",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean"),
     *             @OA\Property(property="data", type="array", @OA\Items(type="object"))
     *         )
     *     ),
     *     @OA\Response(
     *         response=500,
     *         description="Erro ao listar províncias"
     *     )
     * )
     */
    public function index(): JsonResponse
    {
        try {
            $this->authorize('viewAny', Provincia::class);
            
            $provincias = Provincia::all();
            return response()->json([
                'success' => true,
                'data' => $provincias
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Erro ao listar províncias: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * @OA\Post(
     *     path="/provincia",
     *     summary="Criar nova província",
     *     tags={"Províncias"},
     *     security={{"bearerAuth":{}}},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"nome"},
     *             @OA\Property(property="nome", type="string")
     *         )
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Província criada com sucesso",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean"),
     *             @OA\Property(property="data", type="object")
     *         )
     *     ),
     *     @OA\Response(
     *         response=422,
     *         description="Erro de validação"
     *     ),
     *     @OA\Response(
     *         response=500,
     *         description="Erro ao criar província"
     *     )
     * )
     */
    public function store(Request $request): JsonResponse
    {
        try {
            $this->authorize('create', Provincia::class);
            
            $validator = Validator::make($request->all(), [
                'nome' => 'required|string|max:255',
                //'codigo_iso' => 'required|string|max:5|unique:provincia,codigo_iso'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'errors' => $validator->errors()
                ], 422);
            }

            $validated = $validator->validated();

            $codigo = GerarCodigoIso::gerar($validated['nome']);

            $provincia = Provincia::create([
                'nome' => $validated['nome'],
                'codigo_iso' => $codigo,
            ]);

            return response()->json([
                'success' => true,
                'data' => $provincia
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Erro ao criar província: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * @OA\Get(
     *     path="/provincia/{id}",
     *     summary="Detalhes de uma província",
     *     tags={"Províncias"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         description="ID da província",
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Dados da província",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean"),
     *             @OA\Property(property="data", type="object")
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Província não encontrada"
     *     ),
     *     @OA\Response(
     *         response=500,
     *         description="Erro ao buscar província"
     *     )
     * )
     */
    public function show($idProvincia): JsonResponse
    {
        try {
            $this->authorize('view', Provincia::class);
            
            $provincia = Provincia::findOrFail($idProvincia);

            return response()->json([
                'success' => true,
                'data' => $provincia
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'error' => 'Província não encontrada.'
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Erro ao buscar província: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * @OA\Put(
     *     path="/provincia/{id}",
     *     summary="Atualizar província",
     *     tags={"Províncias"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         description="ID da província",
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             @OA\Property(property="nome", type="string"),
     *             @OA\Property(property="codigo_iso", type="string")
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Província atualizada com sucesso",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean"),
     *             @OA\Property(property="data", type="object")
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Província não encontrada"
     *     ),
     *     @OA\Response(
     *         response=422,
     *         description="Erro de validação"
     *     ),
     *     @OA\Response(
     *         response=500,
     *         description="Erro ao atualizar província"
     *     )
     * )
     */
    public function update(Request $request, $idProvincia): JsonResponse
    {
        try {
            $this->authorize('update', Provincia::class);
            
            $provincia = Provincia::findOrFail($idProvincia);

            $validator = Validator::make($request->all(), [
                'nome' => 'sometimes|string|max:255',
                'codigo_iso' => 'sometimes|string|max:5|unique:provincia,codigo_iso,' . $idProvincia . ',id_provincia'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'errors' => $validator->errors()
                ], 422);
            }

            $provincia->update($validator->validated());

            return response()->json([
                'success' => true,
                'data' => $provincia
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'error' => 'Província não encontrada.'
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Erro ao atualizar província: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * @OA\Delete(
     *     path="/provincia/{id}",
     *     summary="Excluir província",
     *     tags={"Províncias"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         description="ID da província",
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Província removida com sucesso",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean"),
     *             @OA\Property(property="message", type="string")
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Província não encontrada"
     *     ),
     *     @OA\Response(
     *         response=500,
     *         description="Erro ao remover província"
     *     )
     * )
     */
    public function destroy($idProvincia): JsonResponse
    {
        try {
            $this->authorize('delete', Provincia::class);
            
            $provincia = Provincia::findOrFail($idProvincia);
            $provincia->delete();

            return response()->json([
                'success' => true,
                'message' => 'Província removida com sucesso.'
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'error' => 'Província não encontrada.'
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Erro ao remover província: ' . $e->getMessage()
            ], 500);
        }
    }
}

