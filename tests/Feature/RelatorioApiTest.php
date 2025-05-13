<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Relatorio;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;
use Barryvdh\DomPDF\Facade\Pdf;

class RelatorioApiTest extends TestCase
{
    use RefreshDatabase;

    protected function criarUsuario()
    {
        return User::create([
            'name' => 'Teste',
            'email' => 'teste@example.com',
            'password' => Hash::make('senha123'),
        ]);
    }

    /** @test */
    public function deve_listar_os_relatórios_do_usuario_logado()
    {
        $user = $this->criarUsuario();

        Relatorio::create([
            'tipo' => 'casos_por_regiao',
            'dados' => json_encode(['a' => 1]),
                          'id_usuario' => $user->id,
        ]);

        $this->actingAs($user)
        ->getJson('/api/relatorios')
        ->assertOk()
        ->assertJsonCount(1);
    }

    /** @test */
    public function deve_gerar_relatorio_pdf()
    {
        $user = $this->criarUsuario();
        $this->actingAs($user);

        // Mock do PDF
        Pdf::shouldReceive('loadView')->once()->andReturnSelf();
        Pdf::shouldReceive('download')->once()->andReturn(response('PDF gerado'));

        $payload = [
            'tipo' => 'casos_por_regiao',
            'dados' => json_encode(['regiao' => 'Sul']),
        ];

        $response = $this->postJson('/api/relatorios/gerar-pdf', $payload);

        $response->assertOk(); // retorna PDF simulado
        $this->assertDatabaseHas('relatorios', [
            'tipo' => 'casos_por_regiao',
            'id_usuario' => $user->id,
        ]);
    }

    /** @test */
    public function nao_deve_gerar_relatorio_com_dados_invalidos()
    {
        $user = $this->criarUsuario();
        $this->actingAs($user);

        $response = $this->postJson('/api/relatorios/gerar-pdf', [
            'tipo' => 'invalido',
            'dados' => 'isso-nao-é-json',
        ]);

        $response->assertStatus(422);
    }

    /** @test */
    public function deve_deletar_relatorio_do_usuario()
    {
        $user = $this->criarUsuario();
        $this->actingAs($user);

        $relatorio = Relatorio::create([
            'tipo' => 'casos_por_regiao',
            'dados' => json_encode(['info' => 'teste']),
                                       'id_usuario' => $user->id,
        ]);

        $response = $this->deleteJson("/api/relatorios/{$relatorio->id}");
        $response->assertNoContent();

        $this->assertDatabaseMissing('relatorios', ['id' => $relatorio->id]);
    }

    /** @test */
    public function nao_deve_deletar_relatorio_de_outro_usuario()
    {
        $user1 = $this->criarUsuario();

        $user2 = User::create([
            'name' => 'Outro',
            'email' => 'outro@example.com',
            'password' => Hash::make('senha456'),
        ]);

        $relatorio = Relatorio::create([
            'tipo' => 'casos_por_regiao',
            'dados' => json_encode(['info' => 'privado']),
                                       'id_usuario' => $user2->id,
        ]);

        $this->actingAs($user1)
        ->deleteJson("/api/relatorios/{$relatorio->id}")
        ->assertForbidden();

        $this->assertDatabaseHas('relatorios', ['id' => $relatorio->id]);
    }
}
