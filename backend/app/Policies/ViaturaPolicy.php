<?php

namespace App\Policies;

use App\Models\Viatura;
use App\Models\Usuario;
use Illuminate\Auth\Access\Response;

class ViaturaPolicy
{
    // Gestores e técnicos do mesmo hospital
    public function viewAny(Usuario $user) {
        return true;
    }

    public function view(Usuario $user) {
        return $user->isGestor() || $user->isAdmin();
    }

    public function create(Usuario $user) {
        return $user->isAdmin() || $user->isGestor();
    }

    public function update(Usuario $user) {
        return $user->isGestor() || $user->isGestor() || $user->isTecnico();
    }

    public function delete(Usuario $user) {
        return $user->isAdmin() || $user->isGestor();
    }

    // Atualização de localização
    public function updateLocation(Usuario $user) {
        return $user->isAdmin() || $user->isGestor() || $user->isTecnico();
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
