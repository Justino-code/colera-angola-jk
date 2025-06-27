<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Usuario;
use Illuminate\Support\Facades\Hash;

class UsuarioSeeder extends Seeder
{
    public function run(): void
    {
        // Remove o usuário se já existir
        Usuario::where('email', 'admin@me.com')->delete();

        // Cria novamente o usuário admin
        Usuario::create([
            'nome' => 'Administrador',
            'email' => 'admin@me.com',
            'password' => Hash::make('admin123'),
            'role' => 'admin',
            'permissoes' => ['*'],
            'email_verified_at' => now()
        ]);
    }
}
