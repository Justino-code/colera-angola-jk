<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class PacienteApiTest extends TestCase
{
    //use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        // Garantir que a chave da API esteja definida (usada no TriageService)
        config(['services.openrouteservice.key' => 'fake-api-key']);
    }

    /**
     * Testa se index retorna status 200.
     */
    public function test_index_retorna_lista_de_pacientes()
    {
        $response = $this->getJson('/api/paciente_test');

        $response->assertStatus(200);
    }

    /**
     * Testa store() com sintomas válidos e alocação automática de hospital.
     */
    public function test_store_cria_paciente_com_hospital_e_qr_code()
    {
        // Passo 1: Criar provincia
        /*$provinciaId = DB::table('provincia')->insertGetId([
            'nome' => 'Luanda',
            'codigo_iso' => 'LA',
            'created_at' => now(),
            'updated_at' => now()
        ]);

        // Passo 2: Criar municipio vinculado à provincia
        $municipioId = DB::table('municipio')->insertGetId([
            'nome' => 'Luanda',
            'id_provincia' => $provinciaId,
            'created_at' => now(),
            'updated_at' => now()
        ]);


        // Passo 3: Criar hospital vinculado ao municipio
        $hospitalId = DB::table('hospital')->insertGetId([
            'nome' => 'Hospital Geral de Luanda',
            'tipo' => 'Geral',
            'endereco' => 'Rua 13',
            //'telefone' => '+244991234567',
            //'email' => 'hospital@example.com',
            'latitude' => -8.83821671,
            'longitude' => 13.23421234,
            'capacidade_leitos' => 100,
            //'disponibilidade_leitos' => 80,
            //'descricao' => 'Atende 24 horas',
            'id_municipio' => $municipioId,
            'created_at' => now(),
            'updated_at' => now()
        ]);*/

        // Passo 4: Dados do paciente
        $dados = [
            'nome' => 'Maria João',
            'numero_bi' => '123456789LA001',
            'telefone' => '+244991234567',
            'idade' => 25,
            'sexo' => 'M',
            'sintomas' => ['diarreia_agua_de_arroz', 'vomitos_frequentes']
        ];

        // Passo 5: Fazer a requisição POST
        $response = $this->postJson('/api/paciente_test', $dados);

        dd($response->json());

        // Passo 6: Verificações
        $response->assertStatus(201)
        ->assertJsonStructure([
            'message',
            'data' => [
                'id',
                'nome',
                'bi_number',
                'resultado_triagem',
                'qr_code'
            ]
        ])
        ->assertJsonPath('data.nome', 'Maria João')
        ->assertJsonPath('data.resultado_triagem', 'alto_risco');
    }

    /**
     * Testa show() com ID válido.
     */
    public function test_show_exibe_paciente_por_id()
    {
        // Passos: Provincia → Município → Hospital → Paciente
        /*$provinciaId = DB::table('provincia')->insertGetId([
            'nome' => 'Benguela',
            'codigo_iso' => 'BA',
            'created_at' => now(),
            'updated_at' => now()
        ]);

        $municipioId = DB::table('municipio')->insertGetId([
            'nome' => 'Benguela',
            'id_provincia' => $provinciaId,
            'created_at' => now(),
            'updated_at' => now()
        ]);

        $hospitalId = DB::table('hospital')->insertGetId([
            'nome' => 'Hospital Geral',
            'tipo' => 'Geral',
            'endereco' => 'Rua 13',
            //'telefone' => '+244991234567',
            'latitude' => -8.83821671,
            'longitude' => 13.23421234,
            'capacidade_leitos' => 100,
            //'descricao' => 'Hospital geral',
            'id_municipio' => $municipioId,
            'created_at' => now(),
            'updated_at' => now()
        ]);*/

        /*$dados = [
            'nome' => 'João da Silva',
            'numero_bi' => 'BI123456789LA001',
            'telefone' => '+244991234567',
            'idade' => 30,
            'sexo' => 'M',
            'sintomas' => ['diarreia_agua_de_arroz', 'vomitos_frequentes'],
            'resultado_triagem' => 'baixo_risco',
            'id_hospital' => 3,
            'qr_code' => 'patients/qrcodes/paciente_1.png',
            'latitude' => -8.83821671,
            'longitude' => 12.23421234,
            'created_at' => now(),
            'updated_at' => now()
        ];

        $response = $this->postJson('/api/paciente_test', $dados);*/

        $response = $this->getJson("/api/paciente_test/16");

        //dd($response->json());

        $response->assertStatus(200)
        ->assertJson([
            'id_paciente' => 16,
            'nome' => 'João da Silva'
        ]);
    }

    /**
     * Testa update() com dados válidos.
     */
    public function test_update_atualiza_nome_do_paciente()
    {
        // Criação dos relacionamentos
        /*$provinciaId = DB::table('provincia')->insertGetId([
            'nome' => 'Namibe',
            'codigo_iso' => 'NB',
            'created_at' => now(),
            'updated_at' => now()
        ]);

        $municipioId = DB::table('municipio')->insertGetId([
            'nome' => 'Luanda',
            'id_provincia' => $provinciaId,
            'created_at' => now(),
            'updated_at' => now()
        ]);

        $hospitalId = DB::table('hospital')->insertGetId([
            'nome' => 'Hospital Geral',
            'tipo' => 'Geral',
            'endereco' => 'Rua 13',
            'telefone' => '+244991234567',
            'latitude' => -8.83821671,
            'longitude' => 13.23421234,
            'capacidade_leitos' => 100,
            'descricao' => 'Hospital geral',
            'id_municipio' => $municipioId,
            'created_at' => now(),
            'updated_at' => now()
        ]);

        $pacienteId = DB::table('paciente')->insertGetId([
            'nome' => 'Antes da atualização',
            'bi_number' => 'BI123456789LA001',
            'telefone' => '+244991234567',
            'latitude' => -8.83821671,
            'longitude' => 13.23421234,
            'resultado_triagem' => 'baixo_risco',
            'id_hospital' => $hospitalId,
            'qr_code' => 'patients/qrcodes/paciente_1.png',
            'created_at' => now(),
            'updated_at' => now()
        ]);*/

        // Dados para atualização
        $dadosAtualizados = [
            'nome' => 'Novo Nome',
        ];

        $response = $this->putJson("/api/paciente_test/16", $dadosAtualizados);

        //dd($response->json());

        $response->assertStatus(200)
        ->assertJsonPath('data.nome', 'Novo Nome');
    }

    /**
     * Testa destroy() remove o paciente corretamente.
     */
    public function test_destroy_remove_paciente()
    {
        // Criar provincia
        /*$provinciaId = DB::table('provincia')->insertGetId([
            'nome' => 'Bengo',
            'codigo_iso' => 'BG',
            'created_at' => now(),
            'updated_at' => now()
        ]);

        // Criar municipio
        $municipioId = DB::table('municipio')->insertGetId([
            'nome' => 'Luanda',
            'id_provincia' => $provinciaId,
            'created_at' => now(),
            'updated_at' => now()
        ]);

        // Criar hospital
        $hospitalId = DB::table('hospital')->insertGetId([
            'nome' => 'Hospital Geral',
            'tipo' => 'Geral',
            'endereco' => 'Rua 13',
            'telefone' => '+244991234567',
            'latitude' => -8.83821671,
            'longitude' => 13.23421234,
            'capacidade_leitos' => 100,
            'descricao' => 'Hospital geral',
            'municipio_id' => $municipioId,
            'created_at' => now(),
            'updated_at' => now()
        ]);

        // Inserir paciente
        $pacienteId = DB::table('paciente')->insertGetId([
            'nome' => 'Para ser excluído',
            'bi_number' => 'BI123456789LA001',
            'telefone' => '+244991234567',
            'latitude' => -8.83821671,
            'longitude' => 13.23421234,
            'resultado_triagem' => 'baixo_risco',
            'hospital_id' => $hospitalId,
            'qr_code' => 'patients/qrcodes/paciente_1.png',
            'created_at' => now(),
            'updated_at' => now()
        ]);*/

        // Excluir paciente
        $response = $this->deleteJson("/api/paciente_test/16");

        $response->assertStatus(200)
        ->assertJson(['message' => 'Paciente excluído com sucesso.']);

        // Verificar se foi removido do banco
        $this->assertDatabaseMissing('paciente', ['id_paciente' => 16]);
    }

    /**
     * Testa pacientesPorHospital() com hospital válido.
     */
    public function test_pacientes_por_hospital_retorna_lista_correta()
    {
        // Criar provincia
        $provinciaId = DB::table('provincia')->insertGetId([
            'nome' => 'Huambo',
            'codigo_iso' => 'HB',
            'created_at' => now(),
            'updated_at' => now()
        ]);

        // Criar municipio
        $municipioId = DB::table('municipio')->insertGetId([
            'nome' => 'Luanda',
            'id_provincia' => $provinciaId,
            'created_at' => now(),
            'updated_at' => now()
        ]);

        // Criar hospital
        $hospitalId = DB::table('hospital')->insertGetId([
            'nome' => 'Hospital Geral',
            'tipo' => 'Geral',
            'endereco' => 'Rua 13',
            'telefone' => '+244991234567',
            'latitude' => -8.83821671,
            'longitude' => 13.23421234,
            'capacidade_leitos' => 100,
            'descricao' => 'Hospital geral',
            'municipio_id' => $municipioId,
            'created_at' => now(),
            'updated_at' => now()
        ]);

        // Inserir pacientes vinculados ao hospital
        DB::table('paciente')->insert([
            [
                'id' => 1,
                'nome' => 'Paciente A',
                'bi_number' => 'BI123456789LA001',
                'telefone' => '+244991234567',
                'latitude' => -8.83821671,
                'longitude' => 13.23421234,
                'resultado_triagem' => 'alto_risco',
                'hospital_id' => $hospitalId,
                'qr_code' => 'patients/qrcodes/paciente_1.png',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'id' => 2,
                'nome' => 'Paciente B',
                'bi_number' => 'BI123456789LA002',
                'telefone' => '+244991234568',
                'latitude' => -8.83821671,
                'longitude' => 13.23421234,
                'resultado_triagem' => 'baixo_risco',
                'hospital_id' => $hospitalId,
                'qr_code' => 'patients/qrcodes/paciente_2.png',
                'created_at' => now(),
                'updated_at' => now()
            ]
        ]);

        // Fazer a requisição GET
        $response = $this->getJson("/api/paciente_por_hospital/{$hospitalId}");

        $response->assertStatus(200)
        ->assertJsonCount(2, 'data')
        ->assertJsonPath('data.0.hospital_id', $hospitalId);
    }

    /**
     * Testa pacientesPorHospital() com hospital sem pacientes.
     */
    public function test_pacientes_por_hospital_retorna_mensagem_se_nao_houver()
    {
        // Criar provincia
        /*$provinciaId = DB::table('provincia')->insertGetId([
            'nome' => 'Huambo',
            'created_at' => now(),
            'updated_at' => now()
        ]);

        // Criar municipio
        $municipioId = DB::table('municipio')->insertGetId([
            'nome' => 'Huambo',
            'id_provincia' => $provinciaId,
            'created_at' => now(),
            'updated_at' => now()
        ]);

        // Criar hospital sem pacientes
        $hospitalId = DB::table('hospital')->insertGetId([
            'nome' => 'Hospital do Huambo',
            'tipo' => 'Municipal',
            'endereco' => 'Rua XPTO',
            'telefone' => '+244991234567',
            'latitude' => -8.83821671,
            'longitude' => 13.23421234,
            'capacidade_leitos' => 50,
            'descricao' => 'Hospital municipal',
            'municipio_id' => $municipioId,
            'created_at' => now(),
            'updated_at' => now()
        ]);*/
        $hospitalId = 1;
        $response = $this->getJson("/api/paciente_por_hospital/{$hospitalId}/");

        $response->assertStatus(200)
        ->assertJson([
            'message' => "Nenhum paciente encontrado para o hospital ID {$hospitalId}."
        ]);
    }
}
