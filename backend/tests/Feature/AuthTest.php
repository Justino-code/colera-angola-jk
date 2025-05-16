<?php

namespace Tests\Feature;

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\Usuario;
use Illuminate\Support\Facades\Hash;

class AuthTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function usuario_pode_fazer_login_e_receber_token()
    {
        $usuario = Usuario::create([
            'nome' => 'João',
            'email' => 'joao@email.com',
            'password' => Hash::make('senha123'),
                                   'role' => 'medico',
                                   'permissoes' => json_encode([]),
                                   'id_hospital' => 1
        ]);

        $response = $this->postJson('/api/login', [
            'email' => 'joao@email.com',
            'password' => 'senha123'
        ]);

        $response->assertStatus(200);
        $response->assertJsonStructure(['token', 'usuario']);
    }

    /** @test */
    public function usuario_autenticado_acessa_rota_protegida()
    {
        $usuario = Usuario::factory()->create();

        $token = $usuario->createToken('test-token')->plainTextToken;

        $response = $this->withHeader('Authorization', 'Bearer ' . $token)
        ->getJson('/api/paciente');

        $response->assertStatus(200); // ou 403 se for acesso restrito
    }
}
