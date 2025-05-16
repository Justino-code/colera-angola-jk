<?php

namespace App\Policies;

use App\Models\Municipio;
use App\Models\Usuario;
use Illuminate\Auth\Access\Response;

class MunicipioPolicy
{
    // Apenas gestores podem criar/editar municípios
    public function viewAny(User $user) {
        return true;
    }

    public function view(User $user, Municipio $municipio) {
        return true;
    }

    public function create(User $user) {
        return $user->role === 'gestor';
    }

    public function update(User $user, Municipio $municipio) {
        return $user->role === 'gestor';
    }

    public function delete(User $user, Municipio $municipio) {
        return $user->role === 'gestor';
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(Usuario $usuario, Municipio $municipio): bool
    {
        return false;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(Usuario $usuario, Municipio $municipio): bool
    {
        return false;
    }
}
