<?php

namespace App\Policies;

use App\Models\Hospital;
use App\Models\Paciente;
use App\Models\Usuario;
use Illuminate\Auth\Access\Response;

class PacientePolicy
{
    // Autorizações
    public function viewAny(Usuario $user): bool {
        return $user->isGestor() || $user->isAdmin() || ($user->isMedico() || $user->isEnfermeiro());
    }

    public function view(Usuario $user) {
        return $user->isGestor() ||$user->isMedico() || $user->isAdmin() || $user->isEnfermeiro();
    }

    public function create(Usuario $user) {
        return $user->isGestor() || $user->isEnfermeiro() || $user->isAdmin();
    }

    public function update(Usuario $user): bool {
        return $user->isGestor() || $user->isAdmin() || ($user->isMedico() || $user->isEnfermeiro());
    }

    public function delete(Usuario $user) {
        return $user->isGestor() || $user->isAdmin() || $user->isMedico() || $user->isEnfermeiro();
    }

    /**
     * Determina se um usuário pode actualizar o histórico de avaliações de risco de um paciente.
     */
    public function avaliacaoRisco(Usuario $usuario): bool
    {
        return $usuario->isAdmin() || $usuario->isEnfermeiro();
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
               (($usuario->isMedico() || $usuario->isEnfermeiro()) && $usuario->id_hospital === $paciente->id_hospital)
               ? Response::allow() :
               Response::deny('Você não tem permissão para encaminhar este paciente.');
    }

    /**
     * Verifica se o usuário pode acessar o histórico de avaliações de risco do paciente
     */
    public function historicoAvaliacaoRisco(Usuario $usuario, Paciente $paciente): bool | Response
    {
        return ($usuario->isGestor() || $usuario->isAdmin() || $usuario->isMedico() || $usuario->isEnfermeiro())
            && $usuario->id_hospital === $paciente->id_hospital
            ? Response::allow()
            : Response::deny('Você não tem permissão para acessar o histórico de avaliações de risco deste paciente.');
    }
}
