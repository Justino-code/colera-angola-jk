<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Usuario; // Seu modelo Usuario
use Illuminate\Auth\Access\HandlesAuthorization;

class UserPolicy
{
    use HandlesAuthorization;

    // Gestores gerenciam usuários; outros só veem seu próprio perfil
    public function viewAny(User $user) {
        return $user->role === 'gestor';
    }

    public function view(User $user, User $targetUser) {
        return $user->role === 'gestor' || $user->id === $targetUser->id;
    }

    public function create(User $user) {
        return $user->role === 'gestor';
    }

    public function update(User $user, User $targetUser) {
        return $user->role === 'gestor' || $user->id === $targetUser->id;
    }

    public function delete(User $user, User $targetUser) {
        return $user->role === 'gestor';
    }

    // Permissão específica para atualizar roles
    public function updateRole(User $user) {
        return $user->role === 'gestor';
    }
}
