<?php

namespace App\Http\Controllers;

use App\Models\Hospital;
use Illuminate\Http\Request;

class HospitalController extends Controller
{
    // Listar hospitais de um município
    public function index($municipioId)
    {
        return Hospital::where('municipio_id', $municipioId)->get();
    }

    // Criar hospital
    public function store(Request $request)
    {
        $request->validate([
            'nome' => 'required|string|max:255',
            'tipo' => 'required|in:Geral,Municipal,Centro de Saúde,Posto Médico,Clínica,Outros',
            'municipio_id' => 'required|exists:municipios,id',
            'latitude' => 'required|numeric',
            'longitude' => 'required|numeric'
        ]);

        return Hospital::create($request->all());
    }

    // Detalhes de um hospital
    public function show(Hospital $hospital)
    {
        return $hospital;
    }

    // Atualizar hospital
    public function update(Request $request, Hospital $hospital)
    {
        $request->validate([
            'nome' => 'sometimes|string|max:255',
            'tipo' => 'sometimes|in:Geral,Municipal,Centro de Saúde,Posto Médico,Clínica,Outros',
            'latitude' => 'sometimes|numeric',
            'longitude' => 'sometimes|numeric'
        ]);

        $hospital->update($request->all());
        return $hospital;
    }

    // Excluir hospital
    public function destroy(Hospital $hospital)
    {
        $hospital->delete();
        return response()->json(null, 204);
    }
}
