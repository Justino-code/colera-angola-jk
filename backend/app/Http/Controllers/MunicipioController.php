<?php

namespace App\Http\Controllers;

use App\Models\Municipio;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;

class MunicipioController extends Controller
{
    /**
     * @OA\Get(
     *     path="/municipio",
     *     summary="Listar todos os municípios",
     *     tags={"Municípios"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Response(
     *         response=200,
     *         description="Lista de municípios",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean"),
     *             @OA\Property(property="data", type="array", @OA\Items(type="object"))
     *         )
     *     ),
     *     @OA\Response(
     *         response=500,
     *         description="Erro ao listar municípios"
     *     )
     * )
     */
    public function index(): JsonResponse
    {
        try {
            $this->authorize('viewAny', Municipio::class);
            
            //$municipios = Municipio::with('provincia')->get();
            $municipios = Municipio::with('provincia')->get()->map(function ($m) {
                return [
                    'id_municipio' => $m->id_municipio,
                    'nome' => $m->nome,
                    'nome_provincia' => $m->provincia->nome ?? null,
                    'id_provincia' => $m->id_provincia,
                ];
            });

            return response()->json([
                'success' => true,
                'data' => $municipios
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Erro ao listar municípios: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * @OA\Post(
     *     path="/municipio",
     *     summary="Criar novo município",
     *     tags={"Municípios"},
     *     security={{"bearerAuth":{}}},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"nome","id_provincia"},
     *             @OA\Property(property="nome", type="string"),
     *             @OA\Property(property="id_provincia", type="integer")
     *         )
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Município criado com sucesso",
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
     *         description="Erro ao criar município"
     *     )
     * )
     */
    public function store(Request $request): JsonResponse
    {
        try {
            $this->authorize('create', Municipio::class);
            
            $validator = Validator::make($request->all(), [
                'nome' => 'required|string|max:255',
                'id_provincia' => 'required|exists:provincia,id_provincia'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'errors' => $validator->errors()
                ], 422);
            }

            $municipio = Municipio::create($validator->validated());

            return response()->json([
                'success' => true,
                'message' => 'Município criado com sucesso.',
                'data' => $municipio->load('provincia')
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Erro ao criar município: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * @OA\Get(
     *     path="/municipio/{id}",
     *     summary="Exibir detalhes de um município",
     *     tags={"Municípios"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         description="ID do município",
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Dados do município",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean"),
     *             @OA\Property(property="data", type="object")
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Município não encontrado"
     *     ),
     *     @OA\Response(
     *         response=500,
     *         description="Erro ao buscar município"
     *     )
     * )
     */
    public function show(int $id): JsonResponse
    {
        try {
            $this->authorize('view', Municipio::class);
            
            $municipio = Municipio::with('provincia')->findOrFail($id);

            return response()->json([
                'success' => true,
                'data' => $municipio
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'error' => 'Município não encontrado.'
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Erro ao buscar município: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * @OA\Put(
     *     path="/municipio/{id}",
     *     summary="Atualizar município",
     *     tags={"Municípios"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         description="ID do município",
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             @OA\Property(property="nome", type="string"),
     *             @OA\Property(property="id_provincia", type="integer")
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Município atualizado com sucesso",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean"),
     *             @OA\Property(property="message", type="string"),
     *             @OA\Property(property="data", type="object")
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Município não encontrado"
     *     ),
     *     @OA\Response(
     *         response=422,
     *         description="Erro de validação"
     *     ),
     *     @OA\Response(
     *         response=500,
     *         description="Erro ao atualizar município"
     *     )
     * )
     */
    public function update(Request $request, int $id): JsonResponse
    {
        try {
            $this->authorize('update', Municipio::class);
            
            $municipio = Municipio::findOrFail($id);

            $validator = Validator::make($request->all(), [
                'nome' => 'sometimes|required|string|max:255',
                'id_provincia' => 'sometimes|required|exists:provincia,id_provincia'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'errors' => $validator->errors()
                ], 422);
            }

            $municipio->update($validator->validated());

            return response()->json([
                'success' => true,
                'message' => 'Município atualizado com sucesso.',
                'data' => $municipio->load('provincia')
            ]);

        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'error' => 'Município não encontrado.'
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Erro ao atualizar município: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * @OA\Delete(
     *     path="/municipio/{id}",
     *     summary="Excluir município",
     *     tags={"Municípios"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         description="ID do município",
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Município excluído com sucesso",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean"),
     *             @OA\Property(property="message", type="string")
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Município não encontrado"
     *     ),
     *     @OA\Response(
     *         response=500,
     *         description="Erro ao excluir município"
     *     )
     * )
     */
    public function destroy(int $id): JsonResponse
    {
        try {
            $this->authorize('delete', Municipio::class);
            
            $municipio = Municipio::findOrFail($id);
            $municipio->delete();

            return response()->json([
                'success' => true,
                'message' => 'Município excluído com sucesso.'
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'error' => 'Município não encontrado.'
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Erro ao excluir município: ' . $e->getMessage()
            ], 500);
        }
    }
}