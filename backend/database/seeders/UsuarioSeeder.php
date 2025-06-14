<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Usuario;
use Illuminate\Support\Facades\Hash;

class UsuarioSeeder extends Seeder
{
    public function run(): void
    {
        Usuario::updateOrCreate(
        ['email' => 'admin@example.com'], // evita duplicidade
        [
            'nome' => 'Administrador',
            'email' => 'admin@me.com',
            'password' => Hash::make('admin123'),
            'role' => 'gestor',
            'permissoes' => ['gerenciar_usuarios', 
            'ver_dashboard'],
            'email_verified_at' => now()
            ]
        );
    }
}
