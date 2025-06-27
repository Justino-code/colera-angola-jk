<?php

namespace App\Http\Controllers;

use App\Models\Viatura as Ambulancia;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\ValidationException;

class AmbulanciaController extends Controller
{
    /**
     * Listar todas as ambulâncias.
     */
    public function index(): JsonResponse
    {
        $this->authorize('viewAny', Ambulancia::class);
        $ambulancias = Ambulancia::where('tipo', 'ambulancia')->get();

        return response()->json([
            'success' => true,
            'message' => 'Lista de ambulâncias obtida com sucesso.',
            'data' => $ambulancias
        ], 200);
    }

    /**
     * Criar uma nova ambulância.
     */
    public function store(Request $request): JsonResponse
    {
        try {
            $this->authorize('create', Ambulancia::class);
            
            $validated = $request->validate([
                'placa' => 'required|string|unique:viatura,placa',
                'status' => 'required|in:disponivel,em_viagem,ocupada',
                'id_hospital' => 'required|exists:hospital,id_hospital',
                'latitude' => 'required|numeric',
                'longitude' => 'required|numeric'
            ]);

            $validated['tipo'] = 'ambulancia';

            $ambulancia = Ambulancia::create($validated);

            return response()->json([
                'success' => true,
                'message' => 'Ambulância criada com sucesso.',
                'data' => $ambulancia
            ], 201);

        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erro de validação.',
                'errors' => $e->errors()
            ], 422);
        }
    }

    /**
     * Exibir ambulâncias de um hospital específico.
     */
    public function show(int $idHospital): JsonResponse
    {
        $this->authorize('view', Ambulancia::class);
        $ambulancias = Ambulancia::where('tipo', 'ambulancia')
            ->where('id_hospital', $idHospital)
            ->get();

        return response()->json([
            'success' => true,
            'message' => 'Ambulâncias do hospital obtidas com sucesso.',
            'data' => $ambulancias
        ], 200);
    }

    /**
     * Atualizar a localização de uma ambulância.
     */
    public function updateLocation(Request $request, int $id): JsonResponse
    {
        // Verifica se a ambulância existe e é do tipo 'ambulancia'
        try {
            $this->authorize('update', Ambulancia::class);
            
            $ambulancia = Ambulancia::where('tipo', 'ambulancia')->findOrFail($id);

            $validated = $request->validate([
                'latitude' => 'required|numeric',
                'longitude' => 'required|numeric'
            ]);

            $ambulancia->update($validated);

            return response()->json([
                'success' => true,
                'message' => 'Localização atualizada com sucesso.',
                'data' => $ambulancia
            ], 200);

        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erro de validação.',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Ambulância não encontrada.',
                'data' => null
            ], 404);
        }
    }

    /**
     * Excluir uma ambulância.
     */
    public function destroy(int $id): JsonResponse
    {
        $this->authorize('delete', Ambulancia::class);
        $ambulancia = Ambulancia::where('tipo', 'ambulancia')->find($id);

        if (!$ambulancia) {
            return response()->json([
                'success' => false,
                'message' => 'Ambulância não encontrada.',
                'data' => null
            ], 404);
        }

        $ambulancia->delete();

        return response()->json([
            'success' => true,
            'message' => 'Ambulância removida com sucesso.',
            'data' => null
        ], 200);
    }
}

