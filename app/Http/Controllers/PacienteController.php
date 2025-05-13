<?php

namespace App\Http\Controllers;

use App\Models\Paciente;
use Illuminate\Http\Request;
use App\Services\TriageService;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\JsonResponse;

class PacienteController extends Controller
{
    /**
     * @var TriageService
     */
    protected $triageService;

    /**
     * Construtor com injeção manual do serviço de triagem.
     *
     * @param TriageService $triageService Serviço de triagem injetado
     */
    public function __construct(/*TriageService $triageService*/)
    {
        $this->triageService = new TriageService();
    }

    /**
     * Listar todos os pacientes com seus respectivos hospitais.
     *
     * @return JsonResponse
     */
    public function index(): JsonResponse
    {
        $pacientes = Paciente::with('hospital')->get();

        return response()->json($pacientes, 200);
    }

    /**
     * Criar um novo paciente com base na avaliação de risco
     * e alocação ao hospital mais próximo.
     *
     * @param Request $request Dados fornecidos pelo usuário
     * @return JsonResponse
     */
    public function store(Request $request): JsonResponse
    {
        // Valida os dados do paciente
        $validated = $request->validate([
            'nome' => 'required|string|max:255',
            'numero_bi' => 'required|string|unique:paciente,numero_bi',
            'telefone' => 'required|string|max:20',
            'idade' => 'required|integer',
            'sexo' => 'required|in:M,F',
            'sintomas' => 'required|array'
        ]);

        try {
            // Avaliar risco com base nos sintomas informados
            $riskLevel = $this->triageService->avaliarRisco($request->input('sintomas'));

            // Encontrar o hospital mais próximo com base nas coordenadas do paciente
            $hospital = $this->triageService->encontrarHospitalMaisProximo(
                $request->input('latitude'),
                $request->input('longitude')
            );

            // Salvar o paciente no banco
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

            // Gerar QR Code com dados do paciente
            $qrCode = $this->triageService->gerarQrCodeDoPaciente($paciente->toArray());

            // Definir caminho para armazenamento do QR Code
            $qrCodePath = "paciente/qrcodes/paciente_{$paciente->id_paciente}.png";
            Storage::put($qrCodePath, $qrCode);

            // Atualizar caminho do QR Code no registro do paciente
            $paciente->update(['qr_code' => $qrCodePath]);

            // Retornar resposta com dados do paciente criado
            return response()->json([
                'message' => 'Paciente criado com sucesso.',
                'data' => $paciente->load('hospital')
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Falha ao processar paciente: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Exibir detalhes de um paciente específico pelo ID.
     *
     * @param int $id ID do paciente
     * @return JsonResponse
     */
    public function show(int $id): JsonResponse
    {
        $paciente = Paciente::with('hospital')->findOrFail($id);
        return response()->json($paciente, 200);
    }

    /**
     * Atualizar informações de um paciente existente.
     *
     * @param Request $request Dados da atualização
     * @param int $id ID do paciente
     * @return JsonResponse
     */
    public function update(Request $request, int $id): JsonResponse
    {
        $paciente = Paciente::findOrFail($id);

        // Validar campos que podem ser atualizados
        $validated = $request->validate([
            'nome' => 'sometimes|required|string|max:255',
            'numero_bi' => 'sometimes|required|string|unique:paciente,numero_bi,' . $paciente->id_paciente,
            'telefone' => 'sometimes|required|string|max:20',
            'id_hospital' => 'sometimes|required|exists:hospital,id'
        ]);

        // Atualizar os dados do paciente
        $paciente->update($validated);

        return response()->json([
            'message' => 'Paciente atualizado com sucesso.',
            'data' => $paciente->load('hospital')
        ], 200);
    }

    /**
     * Excluir um paciente pelo ID.
     *
     * @param int $id ID do paciente
     * @return JsonResponse
     */
    public function destroy(int $id): JsonResponse
    {
        $paciente = Paciente::findOrFail($id);
        $paciente->delete();

        return response()->json([
            'message' => 'Paciente excluído com sucesso.'
        ], 200);
    }

    /**
     * Listar todos os pacientes vinculados a um hospital específico.
     *
     * @param int $idHospital ID do hospital
     * @return JsonResponse
     */
    public function pacientesPorHospital(int $idHospital): JsonResponse
    {
        // Buscar todos os pacientes vinculados ao hospital pelo hospital_id
        $pacientes = Paciente::where('id_hospital', $idHospital)->with('hospital')->get();

        if ($pacientes->isEmpty()) {
            return response()->json([
                'message' => "Nenhum paciente encontrado para o hospital ID {$idHospital}."
            ], 200);
        }

        return response()->json([
            'message' => "Pacientes encontrados para o hospital ID {$idHospital}.",
            'data' => $pacientes
        ], 200);
    }
}
