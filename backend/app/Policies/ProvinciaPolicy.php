<?php

namespace App\Policies;

use App\Models\Provincia;
use App\Models\Usuario;
use Illuminate\Auth\Access\Response;

class ProvinciaPolicy
{
    // Apenas gestores podem gerenciar províncias
    public function viewAny(Usuario $user) {
        return true; // Todos podem listar
    }

    public function view(Usuario $user, Provincia $provincia) {
        return true;
    }

    public function create(Usuario $user) {
        return $user->isGestor();
    }

    public function update(Usuario $user, Provincia $provincia) {
        return $user->isGestor();
    }

    public function delete(Usuario $user, Provincia $provincia) {
        return $user->isGestor();
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(Usuario $user, Provincia $provincia): bool
    {
        return false;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(Usuario $user, Provincia $provincia): bool
    {
        return false;
    }
}
