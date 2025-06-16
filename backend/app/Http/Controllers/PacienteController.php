<?php

namespace App\Http\Controllers;

use App\Models\Paciente;
use App\Services\TriageService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\JsonResponse;

class PacienteController extends Controller
{
    protected TriageService $triageService;

    public function __construct()
    {
        $this->triageService = new TriageService();
    }

    public function index(): JsonResponse
    {
        try {
            $pacientes = Paciente::with('hospital')->get();

            return response()->json([
                'success' => true,
                'data' => $pacientes
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Erro ao listar pacientes: ' . $e->getMessage()
            ], 500);
        }
    }

    public function store(Request $request): JsonResponse
    {
        //dd($request->all());
        try {
            $validator = Validator::make($request->all(), [
                'nome' => 'required|string|max:255',
                'numero_bi' => 'required|string|unique:paciente,numero_bi',
                'telefone' => 'required|string|max:20',
                'idade' => 'required|integer',
                'sexo' => 'required|in:M,F',
                'sintomas' => 'required',
                'localizacao' => 'nullable|array',
                /*'latitude' => 'nullable|numeric',
                'longitude' => 'nullable|numeric'*/
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'errors' => $validator->errors()
                ], 422);
            }

            $validated = $validator->validated();

            $sintomas = is_array($validated['sintomas']) ? $validated['sintomas']: explode(',',$validated['sintomas']);

            $riskLevel = $this->triageService->avaliarRisco($sintomas);
            $hospital = $this->triageService->encontrarHospitalMaisProximo(
                $validated['localizacao']['latitude'] ?? null,
                $validated['localizacao']['longitude'] ?? null
            );

            //dd($riskLevel);

            $paciente = Paciente::create([
                'nome' => $validated['nome'],
                'numero_bi' => $validated['numero_bi'],
                'telefone' => $validated['telefone'],
                'idade' => $validated['idade'],
                'sexo' => $validated['sexo'],
                'sintomas' => $validated['sintomas'],
                'resultado_triagem' => $riskLevel,
                'nome_hospital' => $hospital->nome ?? null,
                'id_hospital' => $hospital?->id_hospital ?? null,
                'qr_code' => null,
            ]);

            $qrCode = $this->triageService->gerarQrCodeDoPaciente($paciente->toArray());
            $qrCodePath = "paciente/qrcodes/paciente_{$paciente->id_paciente}.png";
            Storage::put($qrCodePath, $qrCode);

            $paciente->update(['qr_code' => $qrCodePath]);

            return response()->json([
                'success' => true,
                'message' => 'Paciente criado com sucesso.',
                'data' => $paciente->load('hospital')
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Falha ao processar paciente: ' . $e->getMessage()
            ], 500);
        }
    }

    public function show(int $id): JsonResponse
    {
        try {
            $paciente = Paciente::with('hospital')->findOrFail($id);

            return response()->json([
                'success' => true,
                'data' => $paciente
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'error' => 'Paciente não encontrado.'
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Erro ao buscar paciente: ' . $e->getMessage()
            ], 500);
        }
    }

    public function update(Request $request, int $id): JsonResponse
    {
        try {
            $paciente = Paciente::findOrFail($id);

            $validator = Validator::make($request->all(), [
                'nome' => 'sometimes|required|string|max:255',
                'numero_bi' => 'sometimes|required|string|unique:paciente,numero_bi,' . $paciente->id_paciente . ',id_paciente',
                'telefone' => 'sometimes|required|string|max:20',
                'id_hospital' => 'sometimes|required|exists:hospital,id_hospital'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'errors' => $validator->errors()
                ], 422);
            }

            $paciente->update($validator->validated());

            return response()->json([
                'success' => true,
                'message' => 'Paciente atualizado com sucesso.',
                'data' => $paciente->load('hospital')
            ]);

        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'error' => 'Paciente não encontrado.'
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Erro ao atualizar paciente: ' . $e->getMessage()
            ], 500);
        }
    }

    public function destroy(int $id): JsonResponse
    {
        try {
            $paciente = Paciente::findOrFail($id);
            $paciente->delete();

            return response()->json([
                'success' => true,
                'message' => 'Paciente excluído com sucesso.'
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'error' => 'Paciente não encontrado.'
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Erro ao excluir paciente: ' . $e->getMessage()
            ], 500);
        }
    }

    public function pacientesPorHospital(int $idHospital): JsonResponse
    {
        try {
            $pacientes = Paciente::where('id_hospital', $idHospital)
                ->with('hospital')
                ->get();

            return response()->json([
                'success' => true,
                'message' => $pacientes->isEmpty()
                    ? "Nenhum paciente encontrado para o hospital ID {$idHospital}."
                    : "Pacientes encontrados para o hospital ID {$idHospital}.",
                'data' => $pacientes
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Erro ao listar pacientes do hospital: ' . $e->getMessage()
            ], 500);
        }
    }
}

