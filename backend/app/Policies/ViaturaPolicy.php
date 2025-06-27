<?php

namespace App\Policies;

use App\Models\Viatura;
use App\Models\Usuario;
use Illuminate\Auth\Access\Response;

class ViaturaPolicy
{
    // Gestores e técnicos do mesmo hospital
    public function viewAny(Usuario $user) {
        return in_array($user->role, ['gestor', 'tecnico']);
    }

    public function view(Usuario $user, Viatura $Viatura) {
        return $user->role === 'gestor' ||
        ($user->role === 'tecnico' && $user->id_hospital === $Viatura->id_hospital);
    }

    public function create(Usuario $user) {
        return $user->role === 'gestor';
    }

    public function update(Usuario $user, Viatura $viatura) {
        return $user->role === 'gestor' ||
        ($user->role === 'tecnico' && $user->id_hospital === $viatura->id_hospital);
    }

    public function delete(Usuario $user, Viatura $viatura) {
        return $user->role === 'gestor';
    }

    // Atualização de localização
    public function updateLocation(Usuario $user, Viatura $viatura) {
        return $this->update($user, $viatura);
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(Usuario $usuario, Viatura $viatura): bool
    {
        return false;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(Usuario $usuario, Viatura $Viatura): bool
    {
        return false;
    }
}
