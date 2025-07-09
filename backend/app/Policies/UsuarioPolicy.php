<?php

namespace App\Policies;

use App\Models\Usuario;

class UsuarioPolicy
{
    // Gestores gerenciam usuários; outros só veem seu próprio perfil
    public function viewAny(Usuario $user)
    {
        return ($user->isGestor() && ($user->id_hospital || $user->id_gabinete)) || $user->isAdmin();
    }

    public function view(Usuario $user): bool
    {
        // Gestores e administradores veem todos os usuários; outros veem apenas seu próprio perfil
        return ($user->isGestor() && ($user->id_hospital || $user->id_gabinete)) || $user->isAdmin();
    }

    public function create(Usuario $user)
    {
        return
            // Gestor hospitalar só pode criar usuários do seu hospital
           ($user->isGestor() && $user->id_hospital) 
            // Gestor de gabinete só pode criar usuários do seu gabinete
            || ($user->isGestor() && $user->id_gabinete)
            // Administradores podem criar qualquer usuário
            || $user->isAdmin()
            ;
    }

    public function update(Usuario $user)
    {
        // Autoriza se o usuário for gestor de hospital ou gabinete, ou administrador
        // Gestor hospitalar só pode editar usuários do mesmo hospital
        // Gestor de gabinete só pode editar usuários do mesmo gabinete
        return 
        // Gestor hospitalar só pode editar usuários do mesmo hospital
        ($user->isGestor() && $user->id_hospital) 
        // Gestor de gabinete só pode editar usuários do mesmo gabinete
        || ($user->isGestor() && $user->id_gabinete)
        // Gestores e administradores podem editar qualquer usuário
        || $user->isAdmin();
    }

    public function delete(Usuario $user)
    {
        return 
        ($user->isGestor() && $user->id_hospital)
        || ($user->isGestor() && $user->id_gabinete)
        || $user->isAdmin();
    }

    // Permissão específica para atualizar roles
    public function updateRole(Usuario $user)
    {
        return $user->isGestor() || $user->isAdmin();
    }
}
