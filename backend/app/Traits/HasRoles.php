<?php

namespace App\Traits;

trait HasRoles
{
    public function hasRole(string $role): bool
    {
        return $this->role === $role;
    }

    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }

    public function isGestor(): bool
    {
        return $this->role === 'gestor';
    }

    public function isMedico(): bool
    {
        return $this->role === 'medico';
    }

    public function isTecnico(): bool
    {
        return $this->role === 'tecnico';
    }

    public function isEnfermeiro(): bool
    {
        return $this->role === 'enfermeiro';
    }

    public function isEpidemiologista(): bool
    {
        return $this->role === 'epidemiologista';
    }

    public function isAdministrativo(): bool
    {
        return $this->role === 'administrativo';
    }

    public function isAgenteSanitario(): bool
    {
        return $this->role === 'agente_sanitario';
    }

    public function isFarmaceutico(): bool
    {
        return $this->role === 'farmaceutico';
    }

    public function isAnalistaDados(): bool
    {
        return $this->role === 'analista_dados';
    }

    public function isCoordenadorRegional(): bool
    {
        return $this->role === 'coordenador_regional';
    }
}
