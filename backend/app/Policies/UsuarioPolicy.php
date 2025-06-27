<?php

namespace App\Policies;

use App\Models\Usuario;
use Illuminate\Auth\Access\HandlesAuthorization;

class UsuarioPolicy
{
    use HandlesAuthorization;

    // Gestores gerenciam usuários; outros só veem seu próprio perfil
    public function viewAny(Usuario $user)
    {
        return $user->role === 'gestor' || $user->role === 'administrador' || $user->role === 'admin';
    }

    public function view(Usuario $user, Usuario $targetUser)
    {
        return ($user->role === 'gestor' || ($user->role === 'administrador' || $user->role === 'admin')) || $user->id_usuario === $targetUser->id_usuario;
    }

    public function create(Usuario $user)
    {
        return $user->role === 'gestor' || ($user->role === 'administrador' || $user->role === 'admin');
    }

    public function update(Usuario $user, Usuario $targetUser)
    {
        return ($user->role === 'gestor' || ($user->role === 'administrador' || $user->role === 'admin')) || $user->id_usuario === $targetUser->id_usuario;
    }

    public function delete(Usuario $user, Usuario $targetUser)
    {
        return $user->role === 'gestor' || ($user->role === 'administrador' || $user->role === 'admin');
    }

    // Permissão específica para atualizar roles
    public function updateRole(Usuario $user)
    {
        return $user->role === 'gestor' || ($user->role === 'administrador' || $user->role === 'admin');
    }
}
