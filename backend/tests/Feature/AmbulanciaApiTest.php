<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

use App\Models\Ambulancia;

class AmbulanciaApiTest extends TestCase
{
    /* @test */
    public function test_index_ambulancia(): void
    {
        //$response = $this->get('/api/ambulancia_test/1');
        //$response = $this->get('/api/test_db');
        $response = $this->getJson('/api/ambulancia_test/');

        var_dump($response->getContent());

        $response->assertStatus(200);
    }

    /* @test */
    public function test_create_ambulancia(): void{
        $data = [
            'placa' => '763gt56',
            'status' => 'ocupada',
            'id_hospital' => '1',
            'latitude' => '-23.690759',
            'longitude' => '-46.348796'
        ];
        $response =  $this->post("/api/ambulancia_test/", $data);

        dd($response->json());

        $response->assertStatus(201);
    }
}
