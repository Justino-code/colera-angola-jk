<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProvinciaApiTest extends TestCase
{
    // Ative para limpar o banco entre os testes
    use RefreshDatabase;

    #[Test]
    public function test_index(): void
    {
        $response = $this->getJson('/api/provincia_test');

        $response->assertStatus(200);
        $response->assertJsonStructure([
            '*' => ['id_provincia', 'nome', 'codigo_iso']
        ]);
    }

    #[Test]
    public function test_store(): void
    {
        $data = [
            'nome' => 'Huíla',
            'codigo_iso' => 'HA'
        ];

        $response = $this->postJson('/api/provincia_test/', $data);
        $response->assertStatus(201);

        $this->assertDatabaseHas('provincia', [
            'nome' => 'Huíla',
            'codigo_iso' => 'HA'
        ]);
    }

    #[Test]
    public function test_show(): void
    {
        $created = $this->postJson('/api/provincia_test/', [
            'nome' => 'Namibe',
            'codigo_iso' => 'NM'
        ])->json();

        $id = $created['id_provincia'];

        $response = $this->getJson("/api/provincia_test/{$id}");
        $response->assertStatus(200);
        $response->assertJsonFragment(['nome' => 'Namibe']);
    }

    #[Test]
    public function test_update(): void
    {
        $created = $this->postJson('/api/provincia_test/', [
            'nome' => 'Cuando Cubango',
            'codigo_iso' => 'CC'
        ])->json();

        $id = $created['id_provincia'];

        $updateData = ['codigo_iso' => 'CB'];

        $response = $this->putJson("/api/provincia_test/{$id}", $updateData);
        $response->assertStatus(200);

        $this->assertDatabaseHas('provincia', [
            'id_provincia' => $id,
            'codigo_iso' => 'CB'
        ]);
    }

    #[Test]
    public function test_destroy(): void
    {
        $created = $this->postJson('/api/provincia_test/', [
            'nome' => 'Benguela',
            'codigo_iso' => 'BG'
        ])->json();

        $id = $created['id_provincia'];

        $response_delete = $this->deleteJson("/api/provincia_test/{$id}");
        $response_delete->assertStatus(204);

        $this->assertDatabaseMissing('provincia', [
            'id_provincia' => $id,
            'nome' => 'Benguela',
            'codigo_iso' => 'BG'
        ]);
    }
}
