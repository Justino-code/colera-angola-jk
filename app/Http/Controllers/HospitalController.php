<?php

namespace App\Http\Controllers;

use App\Models\Hospital;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\ValidationException;

class HospitalController extends Controller
{
    /**
     * Listar todos os hospitais.
     */
    public function index(): JsonResponse
    {
        $hospitais = Hospital::with('municipio')->get(); // Carrega relacionamento opcional
        return response()->json($hospitais, 200);
    }

    /**
     * Criar um novo hospital.
     */
    public function store(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'nome' => 'required|string|max:255',
                'tipo' => 'required|in:Geral,Municipal,Centro de Saúde,Posto Médico,Clínica,Outros',
                'endereco' => 'required|string|max:255',
                'latitude' => 'required|numeric',
                'longitude' => 'required|numeric',
                'capacidade_leitos' => 'required|integer',
                'id_municipio' => 'required|exists:municipio,id_municipio'
            ]);

            $hospital = Hospital::create($validated);

            return response()->json($hospital, 201);
        } catch (ValidationException $e) {
            return response()->json(['errors' => $e->errors()], 422);
        }
    }

    /**
     * Exibir detalhes de um hospital específico pelo ID.
     */
    public function show(int $id): JsonResponse
    {
        $hospital = Hospital::with('municipio')->findOrFail($id);
        return response()->json($hospital, 200);
    }

    /**
     * Atualizar um hospital existente pelo ID.
     */
    public function update(Request $request, int $id): JsonResponse
    {
        $hospital = Hospital::findOrFail($id);

        $validated = $request->validate([
            'nome' => 'sometimes|required|string|max:255',
            'tipo' => 'sometimes|required|in:Geral,Municipal,Centro de Saúde,Posto Médico,Clínica,Outros',
            'endereco' => 'sometimes|string|max:255',
            'latitude' => 'sometimes|required|numeric',
            'longitude' => 'sometimes|required|numeric',
            'capacidade_leitos' => 'sometimes|integer'
        ]);

        $hospital->update($validated);

        return response()->json($hospital, 200);
    }

    /**
     * Excluir um hospital pelo ID.
     */
    public function destroy(int $id): JsonResponse
    {
        $hospital = Hospital::findOrFail($id);
        $hospital->delete();

        return response()->json(null, 204);
    }
}
