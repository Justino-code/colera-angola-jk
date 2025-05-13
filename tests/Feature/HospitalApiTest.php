<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class HospitalApiTest extends TestCase
{
    // Ative para limpar o banco após cada teste
    use RefreshDatabase;

    private int $idMunicipio;

    /**
     * Cria um município antes de cada teste
     * para garantir que os hospitais possam ser associados corretamente.
     */
    protected function setUp(): void
    {
        parent::setUp();

        // Primeiro, cria uma província necessária para o município
        $provincia = $this->postJson('/api/provincia_test/', [
            'nome' => 'Huíla',
            'codigo_iso' => 'HA'
        ])->json();

        $municipio = $this->postJson('/api/municipio_test/', [
            'nome' => 'Lubango',
            'id_provincia' => $provincia['id_provincia']
        ])->json();

        $this->idMunicipio = $municipio['id_municipio'];
    }

    #[Test]
    public function test_index(): void
    {
        $response = $this->getJson('/api/hospital_test/');
        $response->assertStatus(200);
        $response->assertJsonStructure([
            '*' => ['id_hospital', 'nome', 'tipo', 'endereco', 'id_municipio', 'latitude', 'longitude', 'capacidade_leitos']
        ]);
    }

    #[Test]
    public function test_store(): void
    {
        $data = [
            'nome' => "Central do Lubango",
            'tipo' => 'Geral',
            'endereco' => 'Lubango',
            'id_municipio' => $this->idMunicipio,
            'latitude' => '-26.78625',
            'longitude' => '10.78035',
            'capacidade_leitos' => 500
        ];

        $response = $this->postJson('/api/hospital_test/', $data);
        $response->assertStatus(201);

        $this->assertDatabaseHas('hospital', [
            'nome' => 'Central do Lubango',
            'id_municipio' => $this->idMunicipio
        ]);
    }

    #[Test]
    public function test_show(): void
    {
        $created = $this->postJson('/api/hospital_test/', [
            'nome' => "Test Hospital",
            'tipo' => 'Geral',
            'endereco' => 'Rua A',
            'id_municipio' => $this->idMunicipio,
            'latitude' => '1.234',
            'longitude' => '5.678',
            'capacidade_leitos' => 100
        ])->json();

        $id = $created['id_hospital'];

        $response = $this->getJson("/api/hospital_test/{$id}");
        $response->assertStatus(200);
        $response->assertJsonFragment(['nome' => 'Test Hospital']);
    }

    #[Test]
    public function test_update(): void
    {
        $created = $this->postJson('/api/hospital_test/', [
            'nome' => "Hospital Antigo",
            'tipo' => 'Geral',
            'endereco' => 'Endereço antigo',
            'id_municipio' => $this->idMunicipio,
            'latitude' => '0.000',
            'longitude' => '0.000',
            'capacidade_leitos' => 50
        ])->json();

        $id = $created['id_hospital'];

        $updateData = ['nome' => 'Hospital Atualizado'];

        $response = $this->putJson("/api/hospital_test/{$id}", $updateData);
        $response->assertStatus(200);

        $this->assertDatabaseHas('hospital', [
            'id_hospital' => $id,
            'nome' => 'Hospital Atualizado'
        ]);
    }

    #[Test]
    public function test_destroy(): void
    {
        $created = $this->postJson('/api/hospital_test/', [
            'nome' => "Hospital a Deletar",
            'tipo' => 'Clínica',
            'endereco' => 'Luanda',
            'id_municipio' => $this->idMunicipio,
            'latitude' => '-26.78625',
            'longitude' => '10.78035',
            'capacidade_leitos' => 500
        ])->json();

        $id = $created['id_hospital'];

        $response = $this->deleteJson("/api/hospital_test/{$id}");
        $response->assertStatus(204);

        $this->assertDatabaseMissing('hospital', [
            'id_hospital' => $id
        ]);
    }
}
