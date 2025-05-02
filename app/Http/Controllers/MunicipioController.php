<?php

namespace App\Http\Controllers;

use App\Models\Municipio;
use Illuminate\Http\Request;

class MunicipioController extends Controller
{
    // Listar municípios de uma província
    public function index($provinciaId)
    {
        return Municipio::where('provincia_id', $provinciaId)->get();
    }

    // Criar município
    public function store(Request $request)
    {
        $request->validate([
            'nome' => 'required|string|max:255',
            'provincia_id' => 'required|exists:provinces,id'
        ]);

        return Municipio::create($request->all());
    }

    // Detalhes de um município
    public function show(Municipio $municipio)
    {
        return $municipio;
    }

    // Atualizar município
    public function update(Request $request, Municipio $municipio)
    {
        $request->validate([
            'nome' => 'sometimes|string|max:255',
            'provincia_id' => 'sometimes|exists:provinces,id'
        ]);

        $municipio->update($request->all());
        return $municipio;
    }

    // Excluir município
    public function destroy(Municipio $municipio)
    {
        $municipio->delete();
        return response()->json(null, 204);
    }
}
