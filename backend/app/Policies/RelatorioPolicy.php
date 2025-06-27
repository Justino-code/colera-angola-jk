<?php

namespace App\Policies;

use App\Models\Relatorio;
use App\Models\Usuario;
use Illuminate\Auth\Access\Response;

class RelatorioPolicy
{
    /// Gestores veem tudo; outros só seus próprios relatórios
    public function viewAny(Usuario $user) {
        return true;
    }

    public function view(Relatorio $relatorio) {
        $user = auth()->user();
        return $user->isGestor() || $relatorio->usuario_id === $user->id_usuario;
    }

    public function create(Usuario $user) {
        return $user->isGestor() || $user->isMedico();
    }

    public function delete(Usuario $user, Relatorio $relatorio) {
        return $user->isGestor() || $relatorio->usuario_id === $user->id;
    }

    // Geração de PDF
    public function generatePDF(Usuario $user) {
        return $this->create($user);
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(Usuario $usuario, Relatorio $relatorio): bool
    {
        return false;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(Usuario $usuario, Relatorio $relatorio): bool
    {
        return false;
    }
}
