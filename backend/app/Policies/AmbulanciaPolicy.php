<?php

namespace App\Policies;

use App\Models\Ambulancia;
use App\Models\Usuario;
use Illuminate\Auth\Access\Response;

class AmbulanciaPolicy
{
    // Gestores e técnicos do mesmo hospital
    public function viewAny(User $user) {
        return in_array($user->role, ['gestor', 'tecnico']);
    }

    public function view(User $user, Ambulancia $ambulancia) {
        return $user->role === 'gestor' ||
        ($user->role === 'tecnico' && $user->hospital_id === $ambulancia->hospital_id);
    }

    public function create(User $user) {
        return $user->role === 'gestor';
    }

    public function update(User $user, Ambulancia $ambulancia) {
        return $user->role === 'gestor' ||
        ($user->role === 'tecnico' && $user->hospital_id === $ambulancia->hospital_id);
    }

    public function delete(User $user, Ambulancia $ambulancia) {
        return $user->role === 'gestor';
    }

    // Atualização de localização
    public function updateLocation(User $user, Ambulancia $ambulancia) {
        return $this->update($user, $ambulancia);
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(Usuario $usuario, Ambulancia $ambulancia): bool
    {
        return false;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(Usuario $usuario, Ambulancia $ambulancia): bool
    {
        return false;
    }
}
