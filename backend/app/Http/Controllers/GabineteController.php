<?php

namespace App\Http\Controllers;

use App\Models\Gabinete;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;

class GabineteController extends Controller
{
    public function index(): JsonResponse
    {
        try {
            $gabinetes = Gabinete::with('municipio')->get();

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

    public function store(Request $request): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'nome' => 'required|string|max:255',
                'municipio_id' => 'required|exists:municipio,id_municipio',
                'responsavel' => 'nullable|string|max:255',
                'contacto' => 'nullable|string|max:20',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'errors' => $validator->errors()
                ], 422);
            }

            $gabinete = Gabinete::create($validator->validated());

            return response()->json([
                'success' => true,
                'message' => 'Gabinete criado com sucesso.',
                'data' => $gabinete->load('municipio')
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Erro ao criar gabinete: ' . $e->getMessage()
            ], 500);
        }
    }

    public function show($id): JsonResponse
    {
        try {
            $gabinete = Gabinete::with('municipio')->findOrFail($id);

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

    public function update(Request $request, $id): JsonResponse
    {
        try {
            $gabinete = Gabinete::findOrFail($id);

            $validator = Validator::make($request->all(), [
                'nome' => 'sometimes|required|string|max:255',
                'municipio_id' => 'sometimes|required|exists:municipio,id_municipio',
                'responsavel' => 'nullable|string|max:255',
                'contacto' => 'nullable|string|max:20',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'errors' => $validator->errors()
                ], 422);
            }

            $gabinete->update($validator->validated());

            return response()->json([
                'success' => true,
                'message' => 'Gabinete atualizado com sucesso.',
                'data' => $gabinete->load('municipio')
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

    public function destroy($id): JsonResponse
    {
        try {
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

