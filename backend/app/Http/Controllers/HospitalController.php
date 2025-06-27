<?php

namespace App\Http\Controllers;

use App\Models\Hospital;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;

class HospitalController extends Controller
{
    public function index(): JsonResponse
    {
        try {
            $this->authorize('viewAny', Hospital::class);
            
            $hospitais = Hospital::with('municipio')->get();

            return response()->json([
                'success' => true,
                'data' => $hospitais
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Erro ao listar hospitais: ' . $e->getMessage()
            ], 500);
        }
    }

    public function store(Request $request): JsonResponse
    {
        try {
            $this->authorize('create', Hospital::class);
            
            $validator = Validator::make($request->all(), [
                'nome' => 'required|string|max:255',
                'tipo' => 'required|in:Geral,Municipal,Centro de Saúde,Posto Médico,Clínica,Outros',
                'endereco' => 'required|string|max:255',
                'latitude' => 'required|numeric',
                'longitude' => 'required|numeric',
                'capacidade_leitos' => 'required|integer',
                'id_municipio' => 'required|exists:municipio,id_municipio'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'errors' => $validator->errors()
                ], 422);
            }

            $hospital = Hospital::create($validator->validated());

            return response()->json([
                'success' => true,
                'message' => 'Hospital criado com sucesso.',
                'data' => $hospital->load('municipio')
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Erro ao criar hospital: ' . $e->getMessage()
            ], 500);
        }
    }

    public function show(int $id): JsonResponse
    {
        try {
            $this->authorize('view', Hospital::class);
            
            $hospital = Hospital::with('municipio')->findOrFail($id);

            return response()->json([
                'success' => true,
                'data' => $hospital
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'error' => 'Hospital não encontrado.'
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Erro ao buscar hospital: ' . $e->getMessage()
            ], 500);
        }
    }

    public function update(Request $request, int $id): JsonResponse
    {
        try {
            $this->authorize('update', Hospital::class);
            
            $hospital = Hospital::findOrFail($id);

            $validator = Validator::make($request->all(), [
                'nome' => 'sometimes|required|string|max:255',
                'tipo' => 'sometimes|required|in:Geral,Municipal,Centro de Saúde,Posto Médico,Clínica,Outros',
                'endereco' => 'sometimes|string|max:255',
                'latitude' => 'sometimes|required|numeric',
                'longitude' => 'sometimes|required|numeric',
                'capacidade_leitos' => 'sometimes|integer',
                'id_municipio' => 'sometimes|required|exists:municipio,id_municipio'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'errors' => $validator->errors()
                ], 422);
            }

            $hospital->update($validator->validated());

            return response()->json([
                'success' => true,
                'message' => 'Hospital atualizado com sucesso.',
                'data' => $hospital->load('municipio')
            ]);

        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'error' => 'Hospital não encontrado.'
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Erro ao atualizar hospital: ' . $e->getMessage()
            ], 500);
        }
    }

    public function destroy(int $id): JsonResponse
    {
        try {
            $this->authorize('delete', Hospital::class);
            
            $hospital = Hospital::findOrFail($id);
            $hospital->delete();

            return response()->json([
                'success' => true,
                'message' => 'Hospital excluído com sucesso.'
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'error' => 'Hospital não encontrado.'
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Erro ao excluir hospital: ' . $e->getMessage()
            ], 500);
        }
    }
}

