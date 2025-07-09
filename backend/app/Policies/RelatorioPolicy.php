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

    public function view(Usuario $user): bool {
        return true;
    }

    public function create(Usuario $user): bool {
        return $user->isAdmin() || $user->isGestor() || $user->isCoordenadorRegional();
    }

    public function delete(Usuario $user): bool {
        return $user->isGestor() || $user->isAdmin();
    }

    // Geração de PDF
    public function generatePDF(Usuario $user) {
        return true;
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
