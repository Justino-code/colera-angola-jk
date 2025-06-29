<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Usuario;
use Illuminate\Support\Facades\Hash;

class UsuarioSeeder extends Seeder
{
    public function run(): void
    {
        $roles = [
            'admin','gestor', 'medico', 'tecnico', 'enfermeiro', 'epidemiologista',
            'administrativo', 'agente_sanitario', 'farmaceutico',
            'analista_dados', 'coordenador_regional'
        ];

        foreach ($roles as $role) {
            $email = $role . '@me.com';
            Usuario::where('email', $email)->delete();

            Usuario::create([
                'nome' => ucfirst($role),
                'email' => $email,
                'password' => Hash::make('admin123'),
                'role' => $role,
                'permissoes' => ['*'],
                'email_verified_at' => now()
            ]);
        }
    }
}
