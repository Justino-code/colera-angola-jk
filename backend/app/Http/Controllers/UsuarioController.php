<?php

namespace App\Http\Controllers;

use App\Models\Usuario;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Illuminate\Http\JsonResponse;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Support\Facades\Validator;

class UsuarioController extends Controller
{
    use AuthorizesRequests;

    // Listar todos os usuários
    public function index(): JsonResponse
    {
        $usuarios = Usuario::all();
        return response()->json($usuarios);
    }

    // Criar um novo usuário
    public function store(Request $request): JsonResponse
    {
        try {
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
            ]);

            if ($validator->fails()) {
                return response()->json(['success' => false, 'errors' => $validator->errors(), 'request' => $request->all()], 422);
            }

            $validated = $validator->validated();

            $usuario = Usuario::create([
                'nome' => $validated['nome'],
                'email' => $validated['email'],
                'password' => Hash::make($validated['password']),
                'role' => $validated['role'],
                'permissoes' => $validated['permissoes'],
                'id_hospital' => $validated['id_hospital'],
            ]);

            $token = $usuario->createToken('api-user-token', ['post:read', 'post:create']);

            return response()->json([
                'usuario' => $usuario,
                'token' => $token->plainTextToken
            ], 201);

        } catch (\Exception $e) {
            return response()->json(['error' => 'Erro inesperado: ' . $e->getMessage()], 500);
        }
    }

    // Atualizar permissões de um usuário
    public function updatePermissions(Request $request, int $id): JsonResponse
    {
        $usuario = Usuario::findOrFail($id);
        //$this->authorize('update', $usuario);

        $validator = Validator::make($request->all(), [
            'permissoes' => 'required|array',
            'permissoes.*' => 'string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $usuario->update([
            'permissoes' => $validator->validated()['permissoes'],
        ]);

        return response()->json($usuario);
    }

    // Atualizar dados do usuário
    public function update(Request $request, int $id): JsonResponse
    {
        $usuario = Usuario::findOrFail($id);
        //$this->authorize('update', $usuario);

        $validator = Validator::make($request->all(), [
            'nome' => 'sometimes|required|string|max:255',
            'email' => [
                'sometimes', 'required', 'email', 'max:255',
                Rule::unique('users', 'email')->ignore($usuario->id_usuario, 'id_usuario')
            ],
            'password' => 'sometimes|nullable|string|min:6',
            'role' => ['sometimes', 'required', Rule::in([
                'admin', 'gestor', 'medico', 'tecnico', 'enfermeiro', 'epidemiologista',
                'administrativo', 'agente_sanitario', 'farmaceutico', 'analista_dados',
                'coordenador_regional',
            ])],
            'id_hospital' => 'nullable|exists:hospital,id_hospital',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $data = $validator->validated();

        if (isset($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        }

        $usuario->update($data);

        return response()->json($usuario);
    }

    // Exibir um usuário específico
    public function show(int $id): JsonResponse
    {
        $usuario = Usuario::findOrFail($id);
        return response()->json($usuario);
    }

    // Excluir um usuário
    public function destroy(int $id): JsonResponse
    {
        $usuario = Usuario::findOrFail($id);
        //$this->authorize('delete', $usuario);

        $usuario->delete();
        return response()->json(null, 204);
    }
}

