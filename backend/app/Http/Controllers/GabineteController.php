<?php

namespace App\Http\Controllers;

use App\Models\Gabinete;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;

class GabineteController extends Controller
{
    /**
     * @OA\Get(
     *     path="/gabinetes",
     *     summary="Listar todos os gabinetes",
     *     tags={"Gabinetes"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Response(
     *         response=200,
     *         description="Lista de gabinetes",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean"),
     *             @OA\Property(property="data", type="array", @OA\Items(type="object"))
     *         )
     *     ),
     *     @OA\Response(
     *         response=500,
     *         description="Erro ao listar gabinetes"
     *     )
     * )
     */
    public function index(): JsonResponse
    {
        try {
            $this->authorize('viewAny', Gabinete::class);
            
            $gabinetes = Gabinete::with(['municipio', 'responsavel'])->get();

            return response()->json([
                'success' => true,
                'data' => $gabinetes
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Erro ao listar gabinetes: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * @OA\Post(
     *     path="/gabinetes",
     *     summary="Criar novo gabinete",
     *     tags={"Gabinetes"},
     *     security={{"bearerAuth":{}}},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"nome","id_municipio"},
     *             @OA\Property(property="nome", type="string"),
     *             @OA\Property(property="id_municipio", type="integer"),
     *             @OA\Property(property="contacto", type="string"),
     *             @OA\Property(property="id_responsavel", type="integer")
     *         )
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Gabinete criado com sucesso",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean"),
     *             @OA\Property(property="message", type="string"),
     *             @OA\Property(property="data", type="object")
     *         )
     *     ),
     *     @OA\Response(
     *         response=422,
     *         description="Erro de validação"
     *     ),
     *     @OA\Response(
     *         response=500,
     *         description="Erro ao criar gabinete"
     *     )
     * )
     */
    public function store(Request $request): JsonResponse
    {
        try {
            $this->authorize('create', Gabinete::class);
            
            $validator = Validator::make($request->all(), [
                'nome' => 'required|string|max:255',
                'id_municipio' => 'required|exists:municipio,id_municipio',
                'contacto' => 'nullable|string|max:20',
                'id_responsavel' => 'nullable|exists:usuario,id_usuario'
            ]);

            //dd($request->all());

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'errors' => $validator->errors()
                ], 422);
            }

            //dd($validator->validated());

            $gabinete = Gabinete::create($validator->validated());

            return response()->json([
                'success' => true,
                'message' => 'Gabinete criado com sucesso.',
                'data' => $gabinete->load(['municipio', 'responsavel'])
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Erro ao criar gabinete: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * @OA\Get(
     *     path="/gabinetes/{id}",
     *     summary="Exibir detalhes de um gabinete",
     *     tags={"Gabinetes"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         description="ID do gabinete",
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Dados do gabinete",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean"),
     *             @OA\Property(property="data", type="object")
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Gabinete não encontrado"
     *     ),
     *     @OA\Response(
     *         response=500,
     *         description="Erro ao buscar gabinete"
     *     )
     * )
     */
    public function show($id): JsonResponse
    {
        try {
            $this->authorize('view', Gabinete::class);
            
            $gabinete = Gabinete::with(['municipio', 'responsavel'])->findOrFail($id);

            return response()->json([
                'success' => true,
                'data' => $gabinete
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'error' => 'Gabinete não encontrado.'
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Erro ao buscar gabinete: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * @OA\Put(
     *     path="/gabinetes/{id}",
     *     summary="Atualizar gabinete",
     *     tags={"Gabinetes"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         description="ID do gabinete",
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             @OA\Property(property="nome", type="string"),
     *             @OA\Property(property="id_municipio", type="integer"),
     *             @OA\Property(property="contacto", type="string"),
     *             @OA\Property(property="id_responsavel", type="integer")
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Gabinete atualizado com sucesso",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean"),
     *             @OA\Property(property="message", type="string"),
     *             @OA\Property(property="data", type="object")
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Gabinete não encontrado"
     *     ),
     *     @OA\Response(
     *         response=422,
     *         description="Erro de validação"
     *     ),
     *     @OA\Response(
     *         response=500,
     *         description="Erro ao atualizar gabinete"
     *     )
     * )
     */
    public function update(Request $request, $id): JsonResponse
    {
        try {
            $this->authorize('update', Gabinete::class);
            
            $gabinete = Gabinete::findOrFail($id);

            $validator = Validator::make($request->all(), [
                'nome' => 'sometimes|required|string|max:255',
                'id_municipio' => 'sometimes|required|exists:municipio,id_municipio',
                'contacto' => 'nullable|string|max:20',
                'id_responsavel' => 'nullable|exists:usuario,id_usuario'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'errors' => $validator->errors()
                ], 422);
            }

            $validated = $validator->validated();

            $gabinete->update($validated);

            return response()->json([
                'success' => true,
                'message' => 'Gabinete atualizado com sucesso.',
                'data' => $gabinete->load(['municipio', 'responsavel'])
            ]);

        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'error' => 'Gabinete não encontrado.'
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Erro ao atualizar gabinete: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * @OA\Delete(
     *     path="/gabinetes/{id}",
     *     summary="Excluir gabinete",
     *     tags={"Gabinetes"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         description="ID do gabinete",
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Gabinete removido com sucesso",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean"),
     *             @OA\Property(property="message", type="string")
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Gabinete não encontrado"
     *     ),
     *     @OA\Response(
     *         response=500,
     *         description="Erro ao remover gabinete"
     *     )
     * )
     */
    public function destroy($id): JsonResponse
    {
        try {
            $this->authorize('delete', Gabinete::class);
            
            $gabinete = Gabinete::findOrFail($id);
            $gabinete->delete();

            return response()->json([
                'success' => true,
                'message' => 'Gabinete removido com sucesso.'
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'error' => 'Gabinete não encontrado.'
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Erro ao remover gabinete: ' . $e->getMessage()
            ], 500);
        }
    }
}
