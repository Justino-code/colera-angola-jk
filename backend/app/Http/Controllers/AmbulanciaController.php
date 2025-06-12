<?php

namespace App\Http\Controllers;

use App\Models\Viatura as Ambulancia;
use Illuminate\Http\Request;

class AmbulanciaController extends Controller
{
    // Listar ambulâncias de um hospital
    public function index()
    {
        return Ambulancia::where('tipo', 'ambulancia')->all();
    }

    // Criar ambulância
    public function store(Request $request)
    {
        $validate = $request->validate([
            'placa' => 'required|string|unique:ambulancia',
            'status' => 'required|in:disponivel,em_viagem,ocupada',
            'id_hospital' => 'required|exists:hospital,id_hospital',
            'latitude' => 'required|numeric',
            'longitude' => 'required|numeric'
        ]);

        $validated['tipo'] = 'ambulancia';

        return Ambulancia::create($validated);
    }

    // Atualizar localização em tempo real
    public function updateLocation(Request $request, Ambulancia $ambulancia)
    {
        $request->validate([
            'latitude' => 'required|numeric',
            'longitude' => 'required|numeric'
        ]);

        $ambulancia->update($request->only(['latitude', 'longitude']));
        return $ambulancia;
    }

    public function show($idHospital)
    {
        return Ambulancia::where('id_hospital', $idHospital)->get();
    }

    // Excluir ambulância
    public function destroy(Ambulancia $ambulancia)
    {
        $ambulancia->delete();
        return response()->json(null, 204);
    }
}
