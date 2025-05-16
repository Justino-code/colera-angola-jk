<?php

namespace App\Policies;

use App\Models\Relatorio;
use App\Models\Usuario;
use Illuminate\Auth\Access\Response;

class RelatorioPolicy
{
    /// Gestores veem tudo; outros só seus próprios relatórios
    public function viewAny(User $user) {
        return true;
    }

    public function view(User $user, Relatorio $relatorio) {
        return $user->role === 'gestor' || $relatorio->usuario_id === $user->id;
    }

    public function create(User $user) {
        return in_array($user->role, ['gestor', 'medico']);
    }

    public function delete(User $user, Relatorio $relatorio) {
        return $user->role === 'gestor' || $relatorio->usuario_id === $user->id;
    }

    // Geração de PDF
    public function generatePDF(User $user) {
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
