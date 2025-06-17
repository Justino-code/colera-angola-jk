<?php

namespace App\Http\Controllers;

use App\Models\Viatura;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class ViaturaController extends Controller
{
    public function index(): JsonResponse
    {
        try {
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

    public function store(Request $request): JsonResponse
    {
        try {
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

    public function show($id): JsonResponse
    {
        try {
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

    public function update(Request $request, $id): JsonResponse
    {
        try {
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

    public function destroy($id): JsonResponse
    {
        try {
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
