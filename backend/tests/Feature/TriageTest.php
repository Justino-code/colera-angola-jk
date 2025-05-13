<?php
// tests/Feature/TriageTest.php
namespace Tests\Feature;

use Tests\TestCase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

use App\Services\TriageService;

class TriageTest extends TestCase {
    /*public function test_full_triage_flow() {
        Storage::fake('public');

        $response = $this->postJson('/api/paciente', [
            'nome' => 'João Silva',
            'bi_number' => '123456789LA123',
            'telefone' => '+244900000000',
            'latitude' => -8.838333,
            'longitude' => 13.234444,
            'sintomas' => ['diarrhea_severe', 'dehydration']
        ]);

        $response->assertStatus(201)
        ->assertJsonStructure([
            'id',
            'qr_code_path',
            'resultado_triagem'
        ]);

        Storage::disk('public')->assertExists($response->json('qr_code_path'));
    }*/

    public function test_assessRisk(){
        $triagem = new TriageService();

        $this->assertTrue(is_string($triagem->assessRisk(['diarrhea_severe', 'dehydration',])));
    }

    public function test_generatePatientQrCode(){
        $triagem = new TriageService();

        $image = $triagem->generatePatientQrCode(['id'=>1,'bi_number'=>'123edft','resultado_triagem'=>'alto']);

        $this->assertTrue(getimagesize($image));

        print(mime_content_type($image));
    }
}
