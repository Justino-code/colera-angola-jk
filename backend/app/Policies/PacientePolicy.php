<?php

namespace App\Policies;

use App\Models\Paciente;
use App\Models\Usuario;
use Illuminate\Auth\Access\Response;

class PacientePolicy
{
    // Autorizações
    public function viewAny(User $user) {
        return in_array($user->role, ['gestor', 'medico']);
    }

    public function view(User $user, Paciente $paciente) {
        return $user->role === 'gestor' ||
        ($user->role === 'medico' && $user->id_hospital === $paciente->id_hospital);
    }

    public function create(User $user) {
        return in_array($user->role, ['gestor', 'medico']);
    }

    public function update(User $user, Paciente $paciente) {
        return $this->view($user, $paciente);
    }

    public function delete(User $user, Paciente $paciente) {
        return $user->role === 'gestor';
    }
    /**
     * Determine whether the user can restore the model.
     */
    public function restore(Usuario $usuario, Paciente $paciente): bool
    {
        return false;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(Usuario $usuario, Paciente $paciente): bool
    {
        return false;
    }
}
