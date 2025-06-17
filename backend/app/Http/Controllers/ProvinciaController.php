<?php

namespace App\Http\Controllers;

use App\Models\Provincia;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;
use App\Utils\GerarCodigoIso;

class ProvinciaController extends Controller
{
    // Listar todas as províncias
    public function index(): JsonResponse
    {
        try {
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

    // Criar nova província
    public function store(Request $request): JsonResponse
    {
        try {
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

    // Detalhes de uma província
    public function show($idProvincia): JsonResponse
    {
        try {
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

    // Atualizar província
    public function update(Request $request, $idProvincia): JsonResponse
    {
        try {
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

    // Excluir província
    public function destroy($idProvincia): JsonResponse
    {
        try {
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

