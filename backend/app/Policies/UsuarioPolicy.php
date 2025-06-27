<?php

namespace App\Policies;

use App\Models\Usuario;

class UsuarioPolicy
{
    // Gestores gerenciam usuários; outros só veem seu próprio perfil
    public function viewAny(Usuario $user)
    {
        return $user->isGestor() || $user->isAdmin();
    }

    public function view(Usuario $user): bool
    {
        // Gestores e administradores veem todos os usuários; outros veem apenas seu próprio perfil
        $targetUser = auth()->user();
        return ($user->isGestor() || $user->isAdmin()) || $user->id_usuario === $targetUser->id_usuario;
    }

    public function create(Usuario $user)
    {
        return $user->isGestor() || $user->isAdmin();
    }

    public function update(Usuario $user)
    {
         $targetUser = auth()->user();
        return ($user->isGestor() || $user->isAdmin()) || $user->id_usuario === $targetUser->id_usuario;
    }

    public function delete(Usuario $user)
    {
        return $user->isGestor() || $user->isAdmin();
    }

    // Permissão específica para atualizar roles
    public function updateRole(Usuario $user)
    {
        return $user->isGestor() || $user->isAdmin();
    }
}
