<?php
namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class UsuarioController extends Controller
{
    // Listar usuários (apenas gestores)
    public function index()
    {
        $this->authorize('viewAny', User::class);
        return User::all();
    }

    // Atualizar permissões
    public function updatePermissions(Request $request, User $user)
    {
        $this->authorize('update', $user);

        $request->validate([
            'permissoes' => 'required|array',
            'permissoes.*' => 'string'
        ]);

        $user->update(['permissoes' => $request->permissoes]);
        return $user;
    }

    // Excluir usuário
    public function destroy(User $user)
    {
        $this->authorize('delete', $user);
        $user->delete();
        return response()->json(null, 204);
    }
}
