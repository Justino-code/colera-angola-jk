<?php

namespace Tests\Feature;

use App\Services\TriageService;
use Illuminate\Support\Facades\Config;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use Illuminate\Support\Facades\DB;

class TriageServiceIntegrationTest extends TestCase
{
    use RefreshDatabase; // Limpa o banco após cada teste

    /**
     * Instância do serviço de triagem.
     *
     * @var TriageService
     */
    protected $triageService;

    protected function setUp(): void
    {
        parent::setUp();

        // Garantir que a chave da API esteja definida
        Config::set('services.openrouteservice.key', env('OPENROUTESERVICE_KEY'));

        // Inicializar serviço sem mocks
        $this->triageService = new TriageService();

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

        // Criar Hospitais vinculados ao Município
        DB::table('hospital')->insert([
            'nome' => 'Hospital Geral de Luanda',
            'tipo' => 'Geral',
            'endereco' => 'Rua 13 de Maio, Luanda',
            //'telefone' => '+244990000001',
            //'email' => 'hospital.luanda@example.com',
            'latitude' => -8.83821671,
            'longitude' => 13.23421234,
            'capacidade_leitos' => 150,
            //'disponibilidade_leitos' => 50,
            //'descricao' => 'Hospital geral com atendimento 24 horas',
            'id_municipio' => $municipioId,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('hospital')->insert([
            'nome' => 'Hospital Municipal de Matala',
            'tipo' => 'Municipal',
            'endereco' => 'Avenida Ho Chi Minh, Luanda',
            //'telefone' => '+244990000002',
            //'email' => 'municipal.matala@example.com',
            'latitude' => -8.83900000,
            'longitude' => 13.23500000,
            'capacidade_leitos' => 100,
            //'disponibilidade_leitos' => 100,
            //'descricao' => 'Hospital municipal com grande capacidade',
            'id_municipio' => $municipioId,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }

    /**
     * Testa se encontrarHospitalMaisProximo retorna o hospital mais próximo com base na localização.
     *
     * Certifique-se de ter:
     * - Conexão ativa
     * - Chave válida no .env
     * - Estrutura de tabelas correta
     *
     * @return void
     */
    #[\PHPUnit\Framework\Attributes\Test]
    public function test_encontrar_hospital_mais_proximo_retorna_o_mais_perto()
    {
        // Localização do paciente (próximo ao primeiro hospital)
        $latitudePaciente = -8.83821671;
        $longitudePaciente = 13.23421234;

        $hospital = $this->triageService->encontrarHospitalMaisProximo($latitudePaciente, $longitudePaciente);

        // Deve retornar o hospital mais próximo
        $this->assertInstanceOf(\App\Models\Hospital::class, $hospital);
        $this->assertEquals('Hospital Geral de Luanda', $hospital->nome);
    }

    /**
     * Testa se, com coordenadas inválidas, ele usa o hospital com mais leitos como fallback.
     *
     * @return void
     */
    #[\PHPUnit\Framework\Attributes\Test]
    public function test_fallback_retorna_hospital_com_maior_capacidade()
    {
        // Coordenadas inválidas para forçar erro na API
        $latitudePaciente = 0;
        $longitudePaciente = 0;

        $hospital = $this->triageService->encontrarHospitalMaisProximo($latitudePaciente, $longitudePaciente);

        // Deve cair no fallback (Hospital com maior capacidade)
        $this->assertInstanceOf(\App\Models\Hospital::class, $hospital);
        $this->assertNotEquals('Hospital Municipal de Matala', $hospital->nome);
    }
}
