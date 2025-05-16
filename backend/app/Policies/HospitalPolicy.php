<?php

namespace App\Policies;

use App\Models\Hospital;
use App\Models\Usuario;
use Illuminate\Auth\Access\Response;

class HospitalPolicy
{
    // Apenas gestores podem criar/editar/excluir hospitais
    public function viewAny(User $user) {
        return true; // Todos podem listar hospitais
    }

    public function view(User $user, Hospital $hospital) {
        return true;
    }

    public function create(User $user) {
        return $user->role === 'gestor';
    }

    public function update(User $user, Hospital $hospital) {
        return $user->role === 'gestor';
    }

    public function delete(User $user, Hospital $hospital) {
        return $user->role === 'gestor';
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(Usuario $usuario, Hospital $hospital): bool
    {
        return false;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(Usuario $usuario, Hospital $hospital): bool
    {
        return false;
    }
}
