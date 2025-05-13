<?php

namespace App\Http\Controllers;

use App\Models\Ambulancia;
use Illuminate\Http\Request;

class AmbulanciaController extends Controller
{
    // Listar ambulâncias de um hospital
    public function index()
    {
        return Ambulancia::all();
    }

    // Criar ambulância
    public function store(Request $request)
    {
        $request->validate([
            'placa' => 'required|string|unique:ambulancia',
            'status' => 'required|in:disponivel,em_viagem,ocupada',
            'id_hospital' => 'required',//'required|exists:hospitals,id',
            'latitude' => 'required|numeric',
            'longitude' => 'required|numeric'
        ]);

        return Ambulancia::create($request->all());
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
