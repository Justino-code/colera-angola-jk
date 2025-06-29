<?php

namespace App\Http\Controllers;

use App\Models\Usuario;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;
use Illuminate\Auth\Access\AuthorizationException;

class UsuarioController extends Controller
{
    /**
     * @OA\Get(
     *     path="/usuario",
     *     summary="Listar todos os usuários",
     *     tags={"Usuários"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Response(
     *         response=200,
     *         description="Lista de usuários",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean"),
     *             @OA\Property(property="data", type="array", @OA\Items(type="object"))
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Nenhum usuário encontrado"
     *     ),
     *     @OA\Response(
     *         response=403,
     *         description="Acesso não autorizado"
     *     ),
     *     @OA\Response(
     *         response=500,
     *         description="Erro inesperado"
     *     )
     * )
     */
    public function index(): JsonResponse
    {
        try {
            $this->authorize('viewAny', Usuario::class);
            $usuarios = Usuario::all();

            if ($usuarios->isEmpty()) {
                return response()->json([
                    'success' => false,
                    'errors' => ['Nenhum usuário encontrado.']
                ], 404);
            }

            return response()->json([
                'success' => true,
                'data' => $usuarios
            ]);
        } catch (AuthorizationException $e) {
            return response()->json([
                'success' => false,
                'error' => ['Acesso não autorizado.']
            ], 403);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => ['Erro inesperado: ' . $e->getMessage()]
            ], 500);
        }
    }

    /**
     * @OA\Get(
     *     path="/usuario/{id}",
     *     summary="Exibir um usuário específico",
     *     tags={"Usuários"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         description="ID do usuário",
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Dados do usuário",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean"),
     *             @OA\Property(property="data", type="object")
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Usuário não encontrado"
     *     ),
     *     @OA\Response(
     *         response=403,
     *         description="Acesso não autorizado"
     *     ),
     *     @OA\Response(
     *         response=500,
     *         description="Erro inesperado"
     *     )
     * )
     */
    public function show(int $id): JsonResponse
    {
        try {
            $this->authorize('view', Usuario::class);
            $usuario = Usuario::find($id);

            if (!$usuario) {
                return response()->json([
                    'success' => false,
                    'error' => ['Usuário não encontrado.']
                ], 404);
            }

            return response()->json([
                'success' => true,
                'data' => $usuario
            ]);
        } catch (AuthorizationException $e) {
            return response()->json([
                'success' => false,
                'error' => ['Acesso não autorizado.']
            ], 403);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => ['Erro inesperado: ' . $e->getMessage()]
            ], 500);
        }
    }

    /**
     * @OA\Post(
     *     path="/usuario",
     *     summary="Criar um novo usuário",
     *     tags={"Usuários"},
     *     security={{"bearerAuth":{}}},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"nome","email","password","role","permissoes"},
     *             @OA\Property(property="nome", type="string"),
     *             @OA\Property(property="email", type="string"),
     *             @OA\Property(property="password", type="string"),
     *             @OA\Property(property="password_confirmation", type="string"),
     *             @OA\Property(property="role", type="string"),
     *             @OA\Property(property="permissoes", type="array", @OA\Items(type="string")),
     *             @OA\Property(property="id_hospital", type="integer"),
     *             @OA\Property(property="id_gabinete", type="integer")
     *         )
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Usuário criado com sucesso",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean"),
     *             @OA\Property(property="message", type="string"),
     *             @OA\Property(property="data", type="object")
     *         )
     *     ),
     *     @OA\Response(
     *         response=422,
     *         description="Erro de validação"
     *     ),
     *     @OA\Response(
     *         response=403,
     *         description="Acesso não autorizado"
     *     ),
     *     @OA\Response(
     *         response=500,
     *         description="Erro inesperado"
     *     )
     * )
     */
    public function store(Request $request): JsonResponse
    {
        try {
            $this->authorize('create', Usuario::class);

            // Validação dos dados de entrada
            $validator = Validator::make($request->all(), [
                'nome' => 'required|string|max:255',
                'email' => ['required', 'email', 'max:255', Rule::unique('usuario', 'email')],
                'password' => 'required|string|min:6|confirmed',
                'role' => ['required', Rule::in([
                    'admin', 'gestor', 'medico', 'tecnico', 'enfermeiro', 'epidemiologista',
                    'administrativo', 'agente_sanitario', 'farmaceutico', 'analista_dados',
                    'coordenador_regional',
                ])],
                'permissoes' => 'required|array',
                'permissoes.*' => 'string',
                'id_hospital' => 'nullable|exists:hospital,id_hospital',
                'id_gabinete' => 'nullable|exists:gabinete,id_gabinete',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'errors' => $validator->errors()
                ], 422);
            }

            $validated = $validator->validated();

            $usuario = Usuario::create([
                'nome' => $validated['nome'],
                'email' => $validated['email'],
                'password' => Hash::make($validated['password']),
                'role' => $validated['role'],
                'permissoes' => $validated['permissoes'],
                'id_hospital' => $validated['id_hospital'] ?? null,
                'id_gabinete' => $validated['id_gabinete'] ?? null,
            ]);

            $token = $usuario->createToken('api-user-token', ['post:read', 'post:create']);

            return response()->json([
                'success' => true,
                'message' => 'Usuário criado com sucesso.',
                'data' => [
                    'usuario' => $usuario,
                    'token' => $token->plainTextToken
                ]
            ], 201);

        } catch (AuthorizationException $e) {
            return response()->json([
                'success' => false,
                'errors' => ['Acesso não autorizado.']
            ], 403);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'errors' => ['Erro inesperado: ' . $e->getMessage()]
            ], 500);
        }
    }

    /**
     * @OA\Put(
     *     path="/usuario/{id}/permissoes",
     *     summary="Atualizar permissões do usuário",
     *     tags={"Usuários"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         description="ID do usuário",
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"permissoes"},
     *             @OA\Property(property="permissoes", type="array", @OA\Items(type="string"))
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Permissões atualizadas com sucesso",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean"),
     *             @OA\Property(property="message", type="string"),
     *             @OA\Property(property="data", type="object")
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Usuário não encontrado"
     *     ),
     *     @OA\Response(
     *         response=422,
     *         description="Erro de validação"
     *     ),
     *     @OA\Response(
     *         response=403,
     *         description="Acesso não autorizado"
     *     ),
     *     @OA\Response(
     *         response=500,
     *         description="Erro inesperado"
     *     )
     * )
     */
    public function updatePermissions(Request $request, int $id): JsonResponse
    {
        try {
            $this->authorize('update', Usuario::class);
            $usuario = Usuario::find($id);

            if (!$usuario) {
                return response()->json([
                    'success' => false,
                    'errors' => ['Usuário não encontrado.']
                ], 404);
            }

            $validator = Validator::make($request->all(), [
                'permissoes' => 'required|array',
                'permissoes.*' => 'string',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'errors' => $validator->errors()
                ], 422);
            }

            $usuario->update([
                'permissoes' => $validator->validated()['permissoes'],
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Permissões atualizadas com sucesso.',
                'data' => $usuario
            ]);
        } catch (AuthorizationException $e) {
            return response()->json([
                'success' => false,
                'errors' => ['Acesso não autorizado.']
            ], 403);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'errors' => ['Erro inesperado: ' . $e->getMessage()]
            ], 500);
        }
    }

    /**
     * @OA\Put(
     *     path="/usuario/{id}",
     *     summary="Atualizar dados do usuário",
     *     tags={"Usuários"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         description="ID do usuário",
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             @OA\Property(property="nome", type="string"),
     *             @OA\Property(property="email", type="string"),
     *             @OA\Property(property="password", type="string"),
     *             @OA\Property(property="role", type="string"),
     *             @OA\Property(property="id_hospital", type="integer"),
     *             @OA\Property(property="id_gabinete", type="integer")
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Usuário atualizado com sucesso",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean"),
     *             @OA\Property(property="message", type="string"),
     *             @OA\Property(property="data", type="object")
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Usuário não encontrado"
     *     ),
     *     @OA\Response(
     *         response=422,
     *         description="Erro de validação"
     *     ),
     *     @OA\Response(
     *         response=403,
     *         description="Acesso não autorizado"
     *     ),
     *     @OA\Response(
     *         response=500,
     *         description="Erro inesperado"
     *     )
     * )
     */
    public function update(Request $request, int $id): JsonResponse
    {
        try {
            $this->authorize('update', Usuario::class);
            $usuario = Usuario::find($id);

            if (!$usuario) {
                return response()->json([
                    'success' => false,
                    'errors' => ['Usuário não encontrado.']
                ], 404);
            }

            $validator = Validator::make($request->all(), [
                'nome' => 'nullable|string|max:255',
                'email' => [
                    'nullable', 'email', 'max:255',
                    Rule::unique('usuario', 'email')->ignore($usuario->id_usuario, 'id_usuario')
                ],
                'password' => 'nullable|string|min:6',
                'role' => [
                    'nullable',
                    Rule::in([
                        'admin', 'gestor', 'medico', 'tecnico', 'enfermeiro', 'epidemiologista',
                        'administrativo', 'agente_sanitario', 'farmaceutico', 'analista_dados',
                        'coordenador_regional',
                    ])
                ],
                'id_hospital' => 'nullable|exists:hospital,id_hospital',
                'id_gabinete' => 'nullable|exists:gabinete,id_gabinete',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'errors' => $validator->errors()
                ], 422);
            }

            $data = array_filter($validator->validated(), function ($value) {
                return !is_null($value);
            });

            if (isset($data['password'])) {
                $data['password'] = Hash::make($data['password']);
            }

            $usuario->update($data);

            return response()->json([
                'success' => true,
                'message' => 'Usuário atualizado com sucesso.',
                'data' => $usuario
            ]);
        } catch (AuthorizationException $e) {
            return response()->json([
                'success' => false,
                'errors' => ['Acesso não autorizado.']
            ], 403);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'errors' => ['Erro inesperado: ' . $e->getMessage()]
            ], 500);
        }
    }

    /**
     * @OA\Delete(
     *     path="/usuario/{id}",
     *     summary="Excluir um usuário",
     *     tags={"Usuários"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         description="ID do usuário",
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Usuário excluído com sucesso",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean"),
     *             @OA\Property(property="message", type="string")
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Usuário não encontrado"
     *     ),
     *     @OA\Response(
     *         response=403,
     *         description="Acesso não autorizado"
     *     ),
     *     @OA\Response(
     *         response=500,
     *         description="Erro inesperado"
     *     )
     * )
     */
    public function destroy(int $id): JsonResponse
    {
        try {
            $this->authorize('delete', Usuario::class);
            $usuario = Usuario::find($id);

            if (!$usuario) {
                return response()->json([
                    'success' => false,
                    'errors' => ['Usuário não encontrado.']
                ], 404);
            }

            $usuario->delete();

            return response()->json([
                'success' => true,
                'message' => 'Usuário excluído com sucesso.'
            ]);
        } catch (AuthorizationException $e) {
            return response()->json([
                'success' => false,
                'errors' => ['Acesso não autorizado.']
            ], 403);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'errors' => ['Erro inesperado: ' . $e->getMessage()]
            ], 500);
        }
    }
}
