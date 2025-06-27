<?php

namespace App\Policies;

use App\Models\Hospital;
use App\Models\Usuario;
use Illuminate\Auth\Access\Response;

class HospitalPolicy
{
    /**
     * Todos os usuários podem ver a lista de hospitais.
     */
    public function viewAny(Usuario $usuario): bool
    {
        return true;
    }

    /**
     * Todos os usuários podem ver detalhes de um hospital.
     */
    public function view(Usuario $usuario, Hospital $hospital): bool
    {
        return true;
    }

    /**
     * Apenas gestores podem criar hospitais.
     */
    public function create(Usuario $usuario): bool
    {
        return $usuario->isGestor() || $usuario->isAdmin();
    }

    /**
     * Apenas gestores podem atualizar hospitais.
     */
    public function update(Usuario $usuario, Hospital $hospital): bool
    {
        return $usuario->isGestor() || $usuario->isAdmin();
    }

    /**
     * Apenas gestores podem deletar hospitais.
     */
    public function delete(Usuario $usuario, Hospital $hospital): bool | Response
    {
        return $usuario->isGestor() || $usuario->isAdmin()  
            ? Response::allow()
            : Response::deny('Você não tem permissão para excluir este hospital.');
    }

    /**
     * Restaurar hospital — desativado por padrão.
     */
    public function restore(Usuario $usuario, Hospital $hospital): bool
    {
        return false;
    }

    /**
     * Excluir permanentemente — desativado por padrão.
     */
    public function forceDelete(Usuario $usuario, Hospital $hospital): bool
    {
        return false;
    }
}
