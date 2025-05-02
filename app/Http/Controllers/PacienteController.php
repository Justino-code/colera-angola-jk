<?php

// app/Http/Controllers/PacienteController.php
namespace App\Http\Controllers;

use App\Models\Paciente;
use Illuminate\Http\Request;
use App\Services\TriageService; // Serviço de triagem

class PacienteController extends Controller
{
    // Listar todos os pacientes
    public function index()
    {
        return Paciente::with('hospital')->get();
    }

    // Criar novo paciente com triagem
    public function store(Request $request, TriageService $triageService)
    {
        $request->validate([
            'nome' => 'required',
            'bi_number' => 'required|unique:pacientes',
            'telefone' => 'required',
            'idade' => 'required|integer',
            'sexo' => 'required|in:M,F,Outro',
            'sintomas' => 'required|array',
            'hospital_id' => 'required|exists:hospitals,id'
        ]);

        // Realizar triagem
        $resultadoTriagem = $triageService->assessRisk($request->sintomas);

        // Criar paciente
        $paciente = Paciente::create([
            ...$request->all(),
                                     'resultado_triagem' => $resultadoTriagem,
                                     'qr_code' => \SimpleSoftwareIO\QrCode\Facades\QrCode::generate($request->bi_number)
        ]);

        return response()->json($paciente, 201);
    }

    / Detalhes de um paciente
    public function show(Paciente $paciente)
    {
        return $paciente->load('hospital');
    }

    // Atualizar paciente
    public function update(Request $request, Paciente $paciente)
    {
        $request->validate([
            'nome' => 'sometimes|string',
            'bi_number' => 'sometimes|unique:pacientes,bi_number,'.$paciente->id,
            'hospital_id' => 'sometimes|exists:hospitals,id'
        ]);

        $paciente->update($request->all());
        return $paciente;
    }

    // Excluir paciente
    public function destroy(Paciente $paciente)
    {
        $paciente->delete();
        return response()->json(null, 204);
    }
}
