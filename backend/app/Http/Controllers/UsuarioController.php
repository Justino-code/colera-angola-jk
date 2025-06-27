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
    // Listar todos os usuários
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

    // Exibir um usuário específico
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

    // Criar um novo usuário
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

    // Atualizar permissões
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

    // Atualizar dados do usuário
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

    // Excluir um usuário
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
