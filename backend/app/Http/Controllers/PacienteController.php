<?php

namespace App\Http\Controllers;

use App\Models\Paciente;
use App\Services\TriageService;
use App\Services\OpenRouteService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use Illuminate\Auth\Access\AuthorizationException;
use App\Services\GerarCodigo;

class PacienteController extends Controller
{
    protected TriageService $triageService;

    public function __construct()
    {
        $this->triageService = new TriageService();
    }

    /**
     * @OA\Get(
     *     path="/pacientes",
     *     summary="Listar todos os pacientes",
     *     tags={"Pacientes"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Response(
     *         response=200,
     *         description="Lista de pacientes",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean"),
     *             @OA\Property(property="data", type="array", @OA\Items(type="object"))
     *         )
     *     ),
     *     @OA\Response(
     *         response=403,
     *         description="Acesso não autorizado"
     *     ),
     *     @OA\Response(
     *         response=500,
     *         description="Erro ao listar pacientes"
     *     )
     * )
     */
    public function index(): JsonResponse
    {
        try {
            $this->authorize('viewAny', Paciente::class);
            $pacientes = Paciente::with('hospital')->get();

            return response()->json([
                'success' => true,
                'data' => $pacientes
            ]);
        } catch (AuthorizationException $e) {
            return response()->json([
                'success' => false,
                'error' => 'Acesso não autorizado.'
            ], 403);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Erro ao listar pacientes: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * @OA\Post(
     *     path="/pacientes",
     *     summary="Criar novo paciente",
     *     tags={"Pacientes"},
     *     security={{"bearerAuth":{}}},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"nome","numero_bi","telefone","idade","sexo","sintomas","localizacao"},
     *             @OA\Property(property="nome", type="string"),
     *             @OA\Property(property="numero_bi", type="string"),
     *             @OA\Property(property="telefone", type="string"),
     *             @OA\Property(property="idade", type="integer"),
     *             @OA\Property(property="sexo", type="string", enum={"M","F"}),
     *             @OA\Property(property="sintomas", type="array", @OA\Items(type="string")),
     *             @OA\Property(property="localizacao", type="object",
     *                 @OA\Property(property="latitude", type="number"),
     *                 @OA\Property(property="longitude", type="number")
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Paciente criado com sucesso",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean"),
     *             @OA\Property(property="message", type="string"),
     *             @OA\Property(property="data", type="object")
     *         )
     *     ),
     *     @OA\Response(
     *         response=422,
     *         description="Dados inválidos"
     *     ),
     *     @OA\Response(
     *         response=403,
     *         description="Acesso não autorizado"
     *     ),
     *     @OA\Response(
     *         response=500,
     *         description="Erro ao criar paciente"
     *     )
     * )
     */
    public function store(Request $request): JsonResponse
    {
        // Inicia uma transação para garantir a atomicidade
        // Isso é importante para garantir que todas as operações sejam concluídas com sucesso ou revertidas
        // caso ocorra algum erro, evitando inconsistências no banco de dados.
        DB::beginTransaction();  // Inicia a transação
        try {
            $this->authorize('create', Paciente::class);
            $validator = Validator::make($request->all(), [
                'nome' => 'required|string|max:255',
                'numero_bi' => 'required|string|unique:paciente,numero_bi',
                'telefone' => 'required|string|max:20',
                'idade' => 'required|integer',
                'sexo' => 'required|in:M,F',
                'sintomas' => 'required|array',
                'localizacao' => 'required|array',
                'localizacao.latitude' => 'required|numeric',
                'localizacao.longitude' => 'required|numeric',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Dados inválidos.',
                    'errors' => $validator->errors(),
                    'error' => $validator->errors()->first()
                ], 422);
            }

            $codigo = GerarCodigo::gerarCodigo(Paciente::class, 'PAC');

            $validated = $validator->validated();
            $sintomas = $validated['sintomas'];

            $riskLevel = $this->triageService->avaliarRisco($sintomas);
            $nivelRisco = $riskLevel['nivel_risco'];
            $hospital = $this->triageService->encontrarHospitalMaisProximo(
                $validated['localizacao']['latitude'],
                $validated['localizacao']['longitude']
            );

            $paciente = Paciente::create([
                'nome' => $validated['nome'],
                'numero_bi' => $validated['numero_bi'],
                'telefone' => $validated['telefone'],
                'idade' => $validated['idade'],
                'sexo' => $validated['sexo'],
                //'sintomas' => $sintomas, sera removido do modelo Paciente
                //'resultado_triagem' => $nivelRisco,
                'latitude' => $validated['localizacao']['latitude'],
                'longitude' => $validated['localizacao']['longitude'],
                'nome_hospital' => $hospital->nome ?? null,
                'id_hospital' => $hospital?->id_hospital ?? null,
                'qr_code' => null,
                'codigo' => $codigo
            ]);

            $resultadoAvaliacao = $this->triageService->avaliarRisco($sintomas, $paciente->id_paciente);
            
            $qrCode = $this->triageService->gerarQrCodeDoPaciente($paciente->toArray(), $resultadoAvaliacao, 'pt');
            $qrCodePath = "paciente/qrcodes/paciente_{$paciente->id_paciente}.png";
            Storage::put($qrCodePath, $qrCode);
            $paciente->update(['qr_code' => $qrCodePath]);
            // Se tudo ocorrer bem, faz o commit
            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Paciente criado com sucesso.',
                'data' => $paciente->load('hospital')
            ], 201);
        } catch (AuthorizationException $e) {
            DB::rollBack(); // Reverte a transação em caso de erro
            return response()->json([
                'success' => false,
                'error' => 'Acesso não autorizado.'
            ], 403);
        } catch (\Exception $e) {
            DB::rollBack(); // Reverte a transação em caso de erro
            // Log::error('Erro ao processar paciente: ' . $e->getMessage());
            // Retorna uma resposta JSON com o erro
            return response()->json([
                'success' => false,
                'error' => 'Falha ao processar paciente: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * @OA\Get(
     *     path="/pacientes/{id}",
     *     summary="Exibir detalhes de um paciente",
     *     tags={"Pacientes"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         description="ID do paciente",
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Dados do paciente",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean"),
     *             @OA\Property(property="data", type="object")
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Paciente não encontrado"
     *     ),
     *     @OA\Response(
     *         response=403,
     *         description="Acesso não autorizado"
     *     ),
     *     @OA\Response(
     *         response=500,
     *         description="Erro ao buscar paciente"
     *     )
     * )
     */
    public function show(int $id): JsonResponse
    {
        try {
            $paciente = Paciente::with('hospital', 'avaliacaoRisco')->findOrFail($id);
            $this->authorize('view', $paciente);

            return response()->json([
                'success' => true,
                'data' => $paciente
            ]);
        } catch (AuthorizationException $e) {
            return response()->json([
                'success' => false,
                'error' => 'Acesso não autorizado.'
            ], 403);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException) {
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

    /**
     * @OA\Put(
     *     path="/pacientes/{id}",
     *     summary="Atualizar dados do paciente",
     *     tags={"Pacientes"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         description="ID do paciente",
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             @OA\Property(property="nome", type="string"),
     *             @OA\Property(property="numero_bi", type="string"),
     *             @OA\Property(property="telefone", type="string"),
     *             @OA\Property(property="id_hospital", type="integer")
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Paciente atualizado com sucesso",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean"),
     *             @OA\Property(property="message", type="string"),
     *             @OA\Property(property="data", type="object")
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Paciente não encontrado"
     *     ),
     *     @OA\Response(
     *         response=422,
     *         description="Validação falhou"
     *     ),
     *     @OA\Response(
     *         response=403,
     *         description="Acesso não autorizado"
     *     ),
     *     @OA\Response(
     *         response=500,
     *         description="Erro ao atualizar paciente"
     *     )
     * )
     */
    public function update(Request $request, int $id): JsonResponse
    {
        try {
            $paciente = Paciente::findOrFail($id);
            $this->authorize('update', $paciente);

            $validator = Validator::make($request->all(), [
                'nome' => 'sometimes|required|string|max:255',
                'numero_bi' => 'sometimes|required|string|unique:paciente,numero_bi,' . $paciente->id_paciente . ',id_paciente',
                'telefone' => 'sometimes|required|string|max:20',
                'id_hospital' => 'sometimes|required|exists:hospital,id_hospital'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validação falhou.',
                    'errors' => $validator->errors(),
                    'error' => $validator->errors()->first()
                ], 422);
            }

            $paciente->update($validator->validated());

            return response()->json([
                'success' => true,
                'message' => 'Paciente atualizado com sucesso.',
                'data' => $paciente->load('hospital')
            ]);
        } catch (AuthorizationException $e) {
            return response()->json([
                'success' => false,
                'error' => 'Acesso não autorizado.'
            ], 403);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException) {
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

    /**
     * @OA\Delete(
     *     path="/pacientes/{id}",
     *     summary="Excluir paciente",
     *     tags={"Pacientes"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         description="ID do paciente",
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Paciente excluído com sucesso",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean"),
     *             @OA\Property(property="message", type="string")
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Paciente não encontrado"
     *     ),
     *     @OA\Response(
     *         response=403,
     *         description="Acesso não autorizado"
     *     ),
     *     @OA\Response(
     *         response=500,
     *         description="Erro ao excluir paciente"
     *     )
     * )
     */
    public function destroy(int $id): JsonResponse
    {
        try {
            $paciente = Paciente::findOrFail($id);
            $this->authorize('delete', $paciente);
            $paciente->delete();

            return response()->json([
                'success' => true,
                'message' => 'Paciente excluído com sucesso.'
            ]);
        } catch (AuthorizationException $e) {
            return response()->json([
                'success' => false,
                'error' => 'Acesso não autorizado.'
            ], 403);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException) {
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

    /**
     * @OA\Get(
     *     path="/pacientes/{id}/encaminhamento",
     *     summary="Gerar encaminhamento para o paciente",
     *     tags={"Pacientes"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         description="ID do paciente",
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Encaminhamento gerado",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean"),
     *             @OA\Property(property="paciente", type="object"),
     *             @OA\Property(property="hospital", type="object"),
     *             @OA\Property(property="open_route", type="object"),
     *             @OA\Property(property="message", type="string"),
     *             @OA\Property(property="encaminhamento", type="boolean")
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Paciente não encontrado"
     *     ),
     *     @OA\Response(
     *         response=403,
     *         description="Acesso não autorizado"
     *     ),
     *     @OA\Response(
     *         response=500,
     *         description="Erro ao gerar encaminhamento"
     *     )
     * )
     */
    public function encaminhamento(int $id): JsonResponse
    {
        try {
            $paciente = Paciente::with('avaliacaoRisco')->findOrFail($id);
            $this->authorize('encaminhar', $paciente);

            $hospital = $this->triageService->encontrarHospitalMaisProximo(
                $paciente->latitude,
                $paciente->longitude,
            );

            $paciente->hospital = $hospital;
            $avaliacaoRisco = $paciente->avaliacaoRisco()->latest()->first();
            $avaliacaoRisco = json_decode($avaliacaoRisco['resultado'], true);
            $risco = $avaliacaoRisco['nivel_risco'] ?? null;

            if ($risco === 'baixo_risco') {
                return response()->json([
                    'success' => false,
                    'paciente' => $paciente,
                    'message' => 'Paciente com risco baixo não necessita de encaminhamento.',
                    'encaminhamento' => false
                ], 200);
            }

            if (!$paciente->hospital) {
                return response()->json([
                    'success' => false,
                    'error' => 'Paciente não possui hospital associado.'
                ], 400);
            }

            $openRoute = new OpenRouteService([
                [$paciente->longitude, $paciente->latitude],
                [$hospital->longitude, $hospital->latitude]
            ]);

            return response()->json([
                'success' => true,
                'paciente' => $paciente,
                'hospital' => $hospital,
                'open_route' => $openRoute->sucesso() ? [
                    'distancia_metros' => $openRoute->obterDistanciaTotal(),
                    'duracao_segundos' => $openRoute->obterDuracaoTotal(),
                    'geometry' => $openRoute->getGeometry(),
                    'instrucoes' => $openRoute->obterInstrucoes(),
                ] : null,
            ]);
        } catch (AuthorizationException $e) {
            return response()->json([
                'success' => false,
                'error' => 'Acesso não autorizado.'
            ], 403);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException) {
            return response()->json([
                'success' => false,
                'error' => 'Paciente não encontrado.'
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Erro ao gerar encaminhamento: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * @OA\Get(
     *     path="/pacientes/hospital/{idHospital}",
     *     summary="Listar pacientes por hospital",
     *     tags={"Pacientes"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="idHospital",
     *         in="path",
     *         required=true,
     *         description="ID do hospital",
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Pacientes do hospital",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean"),
     *             @OA\Property(property="message", type="string"),
     *             @OA\Property(property="data", type="array", @OA\Items(type="object"))
     *         )
     *     ),
     *     @OA\Response(
     *         response=403,
     *         description="Acesso não autorizado"
     *     ),
     *     @OA\Response(
     *         response=500,
     *         description="Erro ao listar pacientes do hospital"
     *     )
     * )
     */
    public function pacientesPorHospital(int $idHospital): JsonResponse
    {
        try {
            $this->authorize('viewAny', Paciente::class);
            $pacientes = Paciente::where('id_hospital', $idHospital)->with('hospital')->get();

            return response()->json([
                'success' => true,
                'message' => $pacientes->isEmpty()
                    ? "Nenhum paciente encontrado para o hospital ID {$idHospital}."
                    : "Pacientes encontrados para o hospital ID {$idHospital}.",
                'data' => $pacientes
            ]);
        } catch (AuthorizationException $e) {
            return response()->json([
                'success' => false,
                'error' => 'Acesso não autorizado.'
            ], 403);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Erro ao listar pacientes do hospital: ' . $e->getMessage()
            ], 500);
        }
    }


    /**
 * @OA\Post(
 *     path="/pacientes/{id}/avaliar-risco",
 *     summary="Avaliar risco de cólera para um paciente",
 *     tags={"Pacientes"},
 *     security={{"bearerAuth":{}}},
 *     @OA\Parameter(
 *         name="id",
 *         in="path",
 *         required=true,
 *         description="ID do paciente",
 *         @OA\Schema(type="integer")
 *     ),
 *     @OA\RequestBody(
 *         required=true,
 *         @OA\JsonContent(
 *             required={"sintomas"},
 *             @OA\Property(
 *                 property="sintomas",
 *                 type="array",
 *                 @OA\Items(type="string"),
 *                 example={"diarreia_aquosa", "vomito"}
 *             )
 *         )
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Avaliação de risco realizada",
 *         @OA\JsonContent(
 *             @OA\Property(property="success", type="boolean"),
 *             @OA\Property(property="data", type="object",
 *                 @OA\Property(property="avaliacao", type="object"),
 *                 @OA\Property(property="paciente", type="object")
 *             )
 *         )
 *     ),
 *     @OA\Response(
 *         response=404,
 *         description="Paciente não encontrado"
 *     ),
 *     @OA\Response(
 *         response=422,
 *         description="Dados inválidos"
 *     ),
 *     @OA\Response(
 *         response=403,
 *         description="Acesso não autorizado"
 *     ),
 *     @OA\Response(
 *         response=500,
 *         description="Erro ao avaliar risco"
 *     )
 * )
 */
public function avaliarRisco(Request $request, int $id): JsonResponse
{
    $this->authorize('avaliacaoRisco', Paciente::class);
    
    DB::beginTransaction();
    try {
        $paciente = Paciente::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'sintomas' => 'required|array',
            'sintomas.*' => 'string|in:' . implode(',', array_keys(config('triagem.sintomas')))
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Dados inválidos',
                'errors' => $validator->errors()
            ], 422);
        }

        $validated = $validator->validated();

        $resultado = $this->triageService->avaliarRisco($validated['sintomas'], $id);

        // Cria a avaliação de risco
        /*$avaliacao = $paciente->avaliacoesRisco()->create([
                'sintomas' => $validated['sintomas'],
                'resultado' => $resultado,
                'id_paciente' => $paciente->id_paciente,
                'id_usuario' => auth()->user()->id_usuario,
                ]);*/

        // Atualiza o paciente com o resultado mais recente (opcional)
        /*$paciente->update([
            'resultado_triagem' => $resultado['nivel_risco'],
            'sintomas' => $validated['sintomas']
        ]);*/

        DB::commit();

        return response()->json([
            'success' => true,
            'data' => [
                'avaliacao' => $resultado,
                'paciente' => $paciente->fresh()
            ]
        ]);

    } catch (AuthorizationException $e) {
        DB::rollBack();
        return response()->json([
            'success' => false,
            'error' => 'Acesso não autorizado.'
        ], 403);
    } catch (\Illuminate\Database\Eloquent\ModelNotFoundException) {
        DB::rollBack();
        return response()->json([
            'success' => false,
            'error' => 'Paciente não encontrado.'
        ], 404);
    } catch (\Exception $e) {
        DB::rollBack();
        return response()->json([
            'success' => false,
            'error' => 'Erro ao avaliar risco: ' . $e->getMessage()
        ], 500);
    }
}

public function historicoAvaliacao(int $id){
    try {
        $paciente = Paciente::findOrFail($id);
        $this->authorize('view', $paciente);

        $avaliacoes = $paciente->avaliacaoRisco()->with('usuario')->get();

        return response()->json([
            'success' => true,
            'data' => $avaliacoes
        ]);
    } catch (AuthorizationException $e) {
        return response()->json([
            'success' => false,
            'error' => 'Acesso não autorizado.'
        ], 403);
    } catch (\Illuminate\Database\Eloquent\ModelNotFoundException) {
        return response()->json([
            'success' => false,
            'error' => 'Paciente não encontrado.'
        ], 404);
    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'error' => 'Erro ao buscar histórico de avaliações: ' . $e->getMessage()
        ], 500);
    }
}
}