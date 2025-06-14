<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Viatura;
use Illuminate\Http\Request;

class ViaturaController extends Controller
{
    public function index()
    {
        return Viatura::with('hospital')->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'identificacao' => 'required|string|max:50',
            'tipo' => 'required|string|max:50',
            'status' => 'required|in:disponivel,em_viagem,ocupada',
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',
            'id_hospital' => 'required|exists:hospitail,id_hospital',
        ]);

        $viatura = Viatura::create($validated);
        return response()->json($viatura, 201);
    }

    public function show($id)
    {
        return Viatura::with('hospital')->findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $viatura = Viatura::findOrFail($id);

        $validated = $request->validate([
            'identificacao' => 'sometimes|string|max:50',
            'tipo' => 'sometimes|string|max:50',
            'status' => 'sometimes|in:disponivel,em_viagem,ocupada',
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',
            'id_hospital' => 'sometimes|exists:hospitail,id_hospital',
        ]);

        $viatura->update($validated);
        return response()->json($viatura);
    }

    public function destroy($id)
    {
        Viatura::destroy($id);
        return response()->json(['message' => 'Removida com sucesso.']);
    }
}
