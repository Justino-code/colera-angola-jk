<?php

namespace App\Http\Controllers;

use App\Models\Municipio;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;

class MunicipioController extends Controller
{
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