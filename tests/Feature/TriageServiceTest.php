<?php

namespace Tests\Unit;

use App\Models\Hospital;
use App\Services\TriageService;
use Illuminate\Support\Facades\DB;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use PHPUnit\Framework\Attributes\Test;

class TriageServiceTest extends TestCase
{
    protected $triage;

    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        // Inicializa sem mock
        $this->triage = new TriageService();
    }

    #[Test]
    public function avaliar_risco_com_dois_sintomas_criticos_retorna_alto_risco()
    {
        $sintomas = ['diarreia_agua_de_arroz', 'vomitos_frequentes'];
        $resultado = $this->triage->avaliarRisco($sintomas);

        $this->assertEquals('alto_risco', $resultado);
    }

    #[Test]
    public function avaliar_risco_com_menos_de_dois_sintomas_criticos_retorna_baixo_risco()
    {
        $sintomas = ['febre', 'dor_de_cabeca'];
        $resultado = $this->triage->avaliarRisco($sintomas);

        $this->assertEquals('baixo_risco', $resultado);
    }

    #[Test]
    public function hospital_mais_proximo_retorna_o_mais_perto()
    {
        // Criar Província (sem model, usando DB)
        $provinciaId = DB::table('provincia')->insertGetId([
            'nome' => 'Huila',
            'codigo_iso' => 'HA',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Criar Município vinculado à Província
        $municipioId = DB::table('municipio')->insertGetId([
            'nome' => 'Lubango',
            'id_provincia' => $provinciaId,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
        // Cria hospitais fictícios no banco
        DB::table('hospital')->insert([
                'nome' => 'Hospital A',
                'tipo' => 'Geral',
                'endereco' => 'Rua 13 de Maio, Luanda',
                'latitude' => -8.83821671,
                'longitude' => 13.23421234,
                'capacidade_leitos' => 50,
                'id_municipio' => $municipioId,
                'created_at' => now(),
                'updated_at' => now(),
        ]);

        DB::table('hospital')->insert([
                'nome' => 'Hospital B',
                'tipo' => 'Geral',
                'endereco' => 'Rua 13 de Maio, Luanda',
                'latitude' => -8.83900000,
                'longitude' => 13.23500000,
                'capacidade_leitos' => 100,
                'id_municipio' => $municipioId,
                'created_at' => now(),
                'updated_at' => now(),
        ]);

        // Coordenadas do paciente (próximo ao Hospital B)
        $latitudePaciente = -8.83900000;
        $longitudePaciente = 13.23500000;

        $hospital = $this->triage->encontrarHospitalMaisProximo($latitudePaciente, $longitudePaciente);

        //dd($hospital);

        $this->assertInstanceOf(Hospital::class, $hospital);
        $this->assertEquals('Hospital B', $hospital->nome);
    }

    #[Test]
    public function fallback_hospital_retorna_o_com_maior_capacidade()
    {
        // Criar Província (sem model, usando DB)
        $provinciaId = DB::table('provincia')->insertGetId([
            'nome' => 'Luanda',
            'codigo_iso' => 'LA',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Criar Município vinculado à Província
        $municipioId = DB::table('municipio')->insertGetId([
            'nome' => 'Luanda',
            'id_provincia' => $provinciaId,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
        // Cria hospitais fictícios com capacidades diferentes
        DB::table('hospital')->insert([
            [
                'nome' => 'Hospital Geral',
                'tipo' => 'Geral',
                'endereco' => 'Rua 13 de Maio, Luanda',
                'latitude' => -8.83821671,
                'longitude' => 13.23421234,
                'capacidade_leitos' => 100,
                'id_municipio' => $municipioId,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nome' => 'Hospital Municipal',
                'tipo' => 'Geral',
                'endereco' => 'Rua 13 de Maio, Luanda',
                'latitude' => -8.83900000,
                'longitude' => 13.23500000,
                'capacidade_leitos' => 50,
                'id_municipio' => $municipioId,
                'created_at' => now(),
                'updated_at' => now(),
            ]
        ]);

        // Forçar falha na API passando coordenadas inválidas
        $hospital = $this->triage->encontrarHospitalMaisProximo(0, 0);

        $this->assertInstanceOf(Hospital::class, $hospital);
        $this->assertEquals('Hospital Geral', $hospital->nome);
    }

    #[Test]
    public function gerar_qr_code_retorna_string()
    {
        $dadosPaciente = [
            'id' => 1,
            'bi_number' => '123456789',
            'resultado_triagem' => 'alto_risco'
        ];

        $qrCode = $this->triage->gerarQrCodeDoPaciente($dadosPaciente);

        $this->assertIsString($qrCode);
        $this->assertNotEmpty($qrCode);
    }
}
