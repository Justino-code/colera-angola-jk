<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Usuario; // Seu modelo Usuario
use Illuminate\Auth\Access\HandlesAuthorization;

class UserPolicy
{
    use HandlesAuthorization;

    /**
     * Determine if the given user can view any users.
     *
     * @param  \App\Models\User  $user
     * @return bool
     */
    public function viewAny(User $user)
    {
        return $user->role === 'gestor'; // Apenas gestores podem listar usuários
    }

    /**
     * Determine if the given user can view the user.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\User  $model
     * @return bool
     */
    public function view(User $user, User $model)
    {
        return $user->role === 'gestor'; // Apenas gestores podem visualizar usuários
    }
}
