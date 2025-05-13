<?php

namespace App\Http\Controllers;

use App\Models\Municipio;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\ValidationException;

class MunicipioController extends Controller
{
    /**
     * Listar todos os municípios.
     */
    public function index(): JsonResponse
    {
        $municipios = Municipio::with('provincia')->get();
        return response()->json($municipios, 200);
    }

    /**
     * Criar um novo município.
     */
    public function store(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'nome' => 'required|string|max:255',
                'id_provincia' => 'required|exists:provincia,id_provincia'
            ]);

            $municipio = Municipio::create($validated);

            return response()->json($municipio, 201);
        } catch (ValidationException $e) {
            return response()->json(['errors' => $e->errors()], 422);
        }
    }

    /**
     * Exibir detalhes de um município específico pelo ID.
     */
    public function show(int $id): JsonResponse
    {
        $municipio = Municipio::with('provincia')->findOrFail($id);
        return response()->json($municipio, 200);
    }

    /**
     * Atualizar um município existente pelo ID.
     */
    public function update(Request $request, int $id): JsonResponse
    {
        $municipio = Municipio::findOrFail($id);

        $validated = $request->validate([
            'nome' => 'sometimes|required|string|max:255',
            'id_provincia' => 'sometimes|required|exists:provincia,id_provincia'
        ]);

        $municipio->update($validated);

        return response()->json($municipio, 200);
    }

    /**
     * Excluir um município pelo ID.
     */
    public function destroy(int $id): JsonResponse
    {
        $municipio = Municipio::findOrFail($id);
        $municipio->delete();

        return response()->json(null, 204);
    }
}
