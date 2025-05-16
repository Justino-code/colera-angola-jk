<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Illuminate\Http\JsonResponse;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class UsuarioController extends Controller
{
    use AuthorizesRequests;
    // Listar todos os usuários (restrito a gestores)
    public function index(): JsonResponse
    {
        $this->authorize('viewAny', User::class);
        $usuarios = User::all();

        return response()->json($usuarios);
    }

    // Criar um novo usuário
    public function store(Request $request): JsonResponse
    {
        $this->authorize('create', User::class);

        $validated = $request->validate([
            'nome' => 'required|string|max:255',
            'email' => ['required', 'email', 'max:255', Rule::unique('users', 'email')],
            'password' => 'required|string|min:6|confirmed',
            'role' => ['required', Rule::in([
                'gestor',
                'medico',
                'tecnico',
                'enfermeiro',
                'epidemiologista',
                'administrativo',
                'agente_sanitario',
                'farmaceutico',
                'analista_dados',
                'coordenador_regional',
                ])],
                'permissoes' => 'required|array',
                'permissoes.*' => 'string',
                'id_hospital' => 'required|exists:hospital,id_hospital',
        ]);

        $usuario = User::create([
            'nome' => $validated['nome'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => $validated['role'],
            'permissoes' => $validated['permissoes'],
            'id_hospital' => $validated['id_hospital'],
        ]);

        $token = $usuario->createToken('api-user-token',['post:read', 'post:create']);

        return response()->json($usuario, 201);
    }

    // Atualizar permissões de um usuário
    public function updatePermissions(Request $request, User $user): JsonResponse
    {
        $this->authorize('update', $user);

        $request->validate([
            'permissoes' => 'required|array',
            'permissoes.*' => 'string',
        ]);

        $user->update([
            'permissoes' => $request->permissoes,
        ]);

        return response()->json($user);
    }

    // Atualizar dados básicos do usuário
    public function update(Request $request, User $user): JsonResponse
    {
        $this->authorize('update', $user);

        $validated = $request->validate([
            'nome' => 'sometimes|required|string|max:255',
            'email' => ['sometimes', 'required', 'email', 'max:255', Rule::unique('users')->ignore($user->id, 'id_usuario')],
                                        'password' => 'sometimes|nullable|string|min:6',
                                        'role' => ['sometimes', 'required', Rule::in([
                                            'gestor',
                                            'medico',
                                            'tecnico',
                                            'enfermeiro',
                                            'epidemiologista',
                                            'administrativo',
                                            'agente_sanitario',
                                            'farmaceutico',
                                            'analista_dados',
                                            'coordenador_regional',
                                        ])],
                                        'id_hospital' => 'sometimes|required|exists:hospitais,id_hospital',
        ]);

        if (isset($validated['password'])) {
            $validated['password'] = Hash::make($validated['password']);
        }

        $user->update($validated);

        return response()->json($user);
    }

    // Exibir um usuário específico
    public function show(User $user): JsonResponse
    {
        $this->authorize('view', $user);
        return response()->json($user);
    }

    // Excluir um usuário
    public function destroy(User $user): JsonResponse
    {
        $this->authorize('delete', $user);
        $user->delete();

        return response()->json(null, 204);
    }
}
