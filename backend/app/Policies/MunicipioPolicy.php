<?php

namespace App\Policies;

use App\Models\Municipio;
use App\Models\Usuario;
use Illuminate\Auth\Access\Response;

class MunicipioPolicy
{
    // Apenas gestores podem criar/editar municípios
    public function viewAny(Usuario $user) {
        return true;
    }

    public function view(Usuario $user) {
        return true;
    }

    public function create(Usuario $user) {
        return $user->isGestor();
    }

    public function update(Usuario $user): bool {
        return $user->isGestor();
    }

    public function delete(Usuario $user): bool {
        return $user->isGestor();
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(Usuario $usuario): bool
    {
        return false;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(Usuario $usuario): bool
    {
        return false;
    }
}
