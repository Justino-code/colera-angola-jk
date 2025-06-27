<?php

namespace App\Policies;

use App\Models\Paciente;
use App\Models\Usuario;
use Illuminate\Auth\Access\Response;

class PacientePolicy
{
    // Autorizações
    public function viewAny(Usuario $user) {
        return in_array($user->role, ['gestor', 'medico']);
    }

    public function view(Usuario $user, Paciente $paciente) {
        return $user->role === 'gestor' ||
        ($user->role === 'medico' && $user->id_hospital === $paciente->id_hospital);
    }

    public function create(Usuario $user) {
        return in_array($user->role, ['gestor', 'medico']);
    }

    public function update(Usuario $user, Paciente $paciente) {
        return $this->view($user, $paciente);
    }

    public function delete(Usuario $user, Paciente $paciente) {
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

    /**
     */
    public function encaminhar(Usuario $usuario, Paciente $paciente): bool | Response
    {
        return ($usuario->isGestor() || $usuario->isAdmin()) ||
               ($usuario->isMedico() && $usuario->id_hospital === $paciente->id_hospital)
               ? Response::allow() :
               Response::deny('Você não tem permissão para encaminhar este paciente.');
    }
}
