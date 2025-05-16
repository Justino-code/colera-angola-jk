<?php

namespace App\Policies;

use App\Models\Provincia;
use App\Models\Usuario;
use Illuminate\Auth\Access\Response;

class ProvinciaPolicy
{
    // Apenas gestores podem gerenciar províncias
    public function viewAny(User $user) {
        return true; // Todos podem listar
    }

    public function view(User $user, Provincia $provincia) {
        return true;
    }

    public function create(User $user) {
        return $user->role === 'gestor';
    }

    public function update(User $user, Provincia $provincia) {
        return $user->role === 'gestor';
    }

    public function delete(User $user, Provincia $provincia) {
        return $user->role === 'gestor';
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(Usuario $usuario, Provincia $provincia): bool
    {
        return false;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(Usuario $usuario, Provincia $provincia): bool
    {
        return false;
    }
}
