<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use App\Http\Controllers\PacienteController;

class PacienteControllerTest extends TestCase
{
    /**
     * A basic feature test example.
     */
    public function test_show(): void
    {
        $controller = new PacienteController();

        dd($controller->show(15));

        $response->assertStatus(200);
    }
}
