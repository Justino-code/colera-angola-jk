<?php

namespace App\Http\Controllers;

use App\Models\Viatura;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class ViaturaController extends Controller
{
    /**
 * @OA\Get(
 *     path="/viaturas",
 *     summary="Listar todas as viaturas",
 *     tags={"Viaturas"},
 *     security={{"bearerAuth":{}}},
 *     @OA\Response(
 *         response=200,
 *         description="Lista de viaturas",
 *         @OA\JsonContent(
 *             @OA\Property(property="success", type="boolean"),
 *             @OA\Property(property="data", type="array", @OA\Items(type="object"))
 *         )
 *     ),
 *     @OA\Response(
 *         response=500,
 *         description="Erro interno"
 *     )
 * )
 */
    public function index(): JsonResponse
    {
        try {
            $this->authorize('viewAny', Viatura::class);
            $usuario = auth()->user();

            if($usuario->hasRole('admin')) {
                $viaturas = Viatura::with('hospital')->get();
            } else if($usuario->id_hospital) {
                // Se o usuário não for admin, filtrar por hospital
                $viaturas = Viatura::with('hospital')
                    ->where('id_hospital', $usuario->id_hospital)
                    ->get();
            }else
                $viaturas = Viatura::with('hospital')->get();

            return response()->json([
                'success' => true,
                'data' => $viaturas
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Erro ao listar viaturas: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
 * @OA\Post(
 *     path="/viaturas",
 *     summary="Criar uma nova viatura",
 *     tags={"Viaturas"},
 *     security={{"bearerAuth":{}}},
 *     @OA\RequestBody(
 *         required=true,
 *         @OA\JsonContent(
 *             required={"identificacao","tipo","status","id_hospital"},
 *             @OA\Property(property="identificacao", type="string"),
 *             @OA\Property(property="tipo", type="string"),
 *             @OA\Property(property="status", type="string", enum={"disponivel","em_viagem","ocupada"}),
 *             @OA\Property(property="latitude", type="number"),
 *             @OA\Property(property="longitude", type="number"),
 *             @OA\Property(property="id_hospital", type="integer")
 *         )
 *     ),
 * @OA\Response(
 *         response=201,
 *         description="Viatura criada",
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
 *         description="Erro interno"
 *     )
 * )
 */
    public function store(Request $request): JsonResponse
    {
        try {
            $this->authorize('create', Viatura::class);

            // Validação dos dados de entrada
            $validator = Validator::make($request->all(), [
                'identificacao' => 'required|string|max:50',
                'tipo' => 'required|string|max:50',
                'status' => 'required|in:disponivel,em_viagem,ocupada',
                'latitude' => 'nullable|numeric',
                'longitude' => 'nullable|numeric',
                'id_hospital' => 'required|exists:hospital,id_hospital',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'errors' => $validator->errors()
                ], 422);
            }

            $viatura = Viatura::create($validator->validated());

            return response()->json([
                'success' => true,
                'data' => $viatura
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Erro ao criar viatura: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
 * @OA\Get(
 *     path="/viaturas/{id}",
 *     summary="Exibir uma viatura",
 *     tags={"Viaturas"},
 *     security={{"bearerAuth":{}}},
 *     @OA\Parameter(
 *         name="id",
 *         in="path",
 *         required=true,
 *         description="ID da viatura",
 *         @OA\Schema(type="integer")
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Dados da viatura",
 *         @OA\JsonContent(
 *             @OA\Property(property="success", type="boolean"),
 *             @OA\Property(property="data", type="object")
 *         )
 *     ),*     @OA\Response(
 *         response=404,
 *         description="Viatura não encontrada"
 *     ),
 *     @OA\Response(
 *         response=500,
 *         description="Erro interno"
 *     )
 * )
 */
    public function show($id): JsonResponse
    {
        try {
            $this->authorize('view', Viatura::class);

            $viatura = Viatura::with('hospital')->findOrFail($id);

            return response()->json([
                'success' => true,
                'data' => $viatura
            ]);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'error' => 'Viatura não encontrada'
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Erro ao carregar viatura: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
 * @OA\Put(
 *     path="/viaturas/{id}",
 *     summary="Atualizar uma viatura",
 *     tags={"Viaturas"},
 *     security={{"bearerAuth":{}}},
 *     @OA\Parameter(
 *         name="id",
 *         in="path",
 *         required=true,
 *         description="ID da viatura",
 *         @OA\Schema(type="integer")
 *     ),
 *     @OA\RequestBody(
 *         required=true,
 *         @OA\JsonContent(
 *             @OA\Property(property="identificacao", type="string"),
 *             @OA\Property(property="tipo", type="string"),
 *             @OA\Property(property="status", type="string", enum={"disponivel","em_viagem","ocupada"}),
 *             @OA\Property(property="latitude", type="number"),
 *             @OA\Property(property="longitude", type="number"),
 *             @OA\Property(property="id_hospital", type="integer")
 *         )
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Viatura atualizada",
 *         @OA\JsonContent(
 *             @OA\Property(property="success", type="boolean"),
 *             @OA\Property(property="data", type="object")
 *         )
 *     ),
 *     @OA\Response(
 *         response=404,
 *         description="Viatura não encontrada"
 *     ),
 *     @OA\Response(
 *         response=422,
 *         description="Erro de validação"
 *     ),
 *     @OA\Response(
 *         response=500,
 *         description="Erro interno"
 *     )
 * )
 */
    public function update(Request $request, $id): JsonResponse
    {
        try {
            $this->authorize('update', Viatura::class);

            $viatura = Viatura::findOrFail($id);

            $validator = Validator::make($request->all(), [
                'identificacao' => 'sometimes|string|max:50',
                'tipo' => 'sometimes|string|max:50',
                'status' => 'sometimes|in:disponivel,em_viagem,ocupada',
                'latitude' => 'nullable|numeric',
                'longitude' => 'nullable|numeric',
                'id_hospital' => 'sometimes|exists:hospital,id_hospital',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'errors' => $validator->errors()
                ], 422);
            }

            $viatura->update($validator->validated());

            return response()->json([
                'success' => true,
                'data' => $viatura
            ]);

        } catch (ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'error' => 'Viatura não encontrada'
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Erro ao atualizar viatura: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
 * @OA\Delete(
 *     path="/viaturas/{id}",
 *     summary="Remover uma viatura",
 *     tags={"Viaturas"},
 *     security={{"bearerAuth":{}}},
 *     @OA\Parameter(
 *         name="id",
 *         in="path",
 *         required=true,
 *         description="ID da viatura",
 *         @OA\Schema(type="integer")
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Viatura removida com sucesso.",
 *         @OA\JsonContent(
 *             @OA\Property(property="success", type="boolean"),
 *             @OA\Property(property="message", type="string")
 *         )
 *     ), *     @OA\Response(
 *         response=404,
 *         description="Viatura não encontrada"
 *     ),
 *     @OA\Response(
 *         response=500,
 *         description="Erro interno"
 *     )
 * )
 */
    public function destroy($id): JsonResponse
    {
        try {
            $this->authorize('delete', Viatura::class);
            $viatura = Viatura::findOrFail($id);
            $viatura->delete();

            return response()->json([
                'success' => true,
                'message' => 'Viatura removida com sucesso.'
            ]);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'error' => 'Viatura não encontrada'
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Erro ao remover viatura: ' . $e->getMessage()
            ], 500);
        }
    }
}
