<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class MunicipioApiTest extends TestCase
{
    // Ative para garantir que o banco seja limpo entre testes
    use RefreshDatabase;

    private int $idProvincia;

    /**
     * Método chamado automaticamente antes de cada teste.
     * Usado para preparar o ambiente (neste caso, criar uma província).
     */
    protected function setUp(): void
    {
        parent::setUp(); // Importante manter!

        // Cria uma província necessária para associar municípios
        $data_prov = [
            'nome' => 'Huíla',
            'codigo_iso' => 'HA'
        ];

        $response_prov = $this->postJson('/api/provincia_test/', $data_prov);
        $response_prov->assertStatus(201); // Verifica se foi criada corretamente

        // Salva o ID da província criada para uso nos testes
        $this->idProvincia = $response_prov->json()['id_provincia'];
    }

    #[Test]
    public function test_index(): void
    {
        // Verifica se o endpoint lista os municípios corretamente
        $response = $this->getJson('/api/municipio_test');

        $response->assertStatus(200);
        $response->assertJsonStructure([
            '*' => ['id_municipio', 'nome', 'id_provincia']
        ]);
    }

    #[Test]
    public function test_store(): void
    {
        // Testa a criação de um novo município
        $data = [
            'nome' => 'Humpata',
            'id_provincia' => $this->idProvincia
        ];

        $response = $this->postJson('/api/municipio_test/', $data);
        $response->assertStatus(201);

        $this->assertDatabaseHas('municipio', [
            'nome' => 'Humpata',
            'id_provincia' => $this->idProvincia
        ]);
    }

    #[Test]
    public function test_show(): void
    {
        // Cria um município temporário
        $created = $this->postJson('/api/municipio_test/', [
            'nome' => 'Lubango',
            'id_provincia' => $this->idProvincia
        ])->json();

        $id = $created['id_municipio'];

        // Testa a visualização desse município
        $response = $this->getJson("/api/municipio_test/{$id}");
        $response->assertStatus(200);
        $response->assertJsonFragment(['nome' => 'Lubango']);
    }

    #[Test]
    public function test_update(): void
    {
        // Cria um município
        $created = $this->postJson('/api/municipio_test/', [
            'nome' => 'Cacula',
            'id_provincia' => $this->idProvincia
        ])->json();

        $id = $created['id_municipio'];

        // Atualiza o nome do município
        $updateData = ['nome' => 'Cacula Atualizado'];

        $response = $this->putJson("/api/municipio_test/{$id}", $updateData);
        $response->assertStatus(200);

        $this->assertDatabaseHas('municipio', [
            'id_municipio' => $id,
            'nome' => 'Cacula Atualizado'
        ]);
    }

    #[Test]
    public function test_destroy(): void
    {
        // Cria um município
        $created = $this->postJson('/api/municipio_test/', [
            'nome' => 'Matala',
            'id_provincia' => $this->idProvincia
        ])->json();

        $id = $created['id_municipio'];

        // Remove o município
        $response = $this->deleteJson("/api/municipio_test/{$id}");
        $response->assertStatus(204);

        $this->assertDatabaseMissing('municipio', [
            'id_municipio' => $id,
            'nome' => 'Matala'
        ]);
    }
}
