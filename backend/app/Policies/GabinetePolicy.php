<?php

namespace App\Policies;

use App\Models\Gabinete;
use App\Models\Usuario;
use Illuminate\Auth\Access\Response;

class GabinetePolicy
{
    public function viewAny(Usuario $usuario): bool
    {
        // Qualquer usuário autenticado pode ver a lista
        return true;
    }

    public function view(Usuario $usuario): bool
    {
        // Admins, gerentes ou responsáveis pelo gabinete podem ver
        return $usuario->isAdmin() || $usuario->isGerente();
    }

    public function create(Usuario $usuario): bool
    {
        // Apenas admins e gerentes podem criar gabinetes
        return $usuario->isAdmin();
    }

    public function update(Usuario $usuario): bool
    {
        // Apenas admins ou responsáveis podem editar
        return $usuario->isAdmin();
    }

    public function delete(Usuario $usuario, Gabinete $gabinete): bool
    {
        // Apenas admin pode deletar
        return $usuario->isAdmin();
    }

    public function restore(Usuario $usuario, Gabinete $gabinete): bool
    {
        // Apenas admin pode restaurar
        return $usuario->isAdmin();
    }

    public function forceDelete(Usuario $usuario, Gabinete $gabinete): bool
    {
        // Apenas admin pode excluir permanentemente
        return $usuario->isAdmin();
    }
}
