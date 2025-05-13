<?php

namespace Tests\Feature;

use App\Services\OpenRouteService;
use GuzzleHttp\Client;
use GuzzleHttp\Psr7\Response;
use Illuminate\Support\Facades\Config;
use Tests\TestCase;

class OpenRouteServiceTest extends TestCase
{
    protected $apiKey;

    protected function setUp(): void
    {
        parent::setUp();

        // Garantir que a chave da API esteja definida no .env
        $this->apiKey = env('OPENROUTESERVICE_KEY');
        Config::set('services.openrouteservice.key', $this->apiKey);
    }

    /**
     * Testa se a requisição retorna sucesso e os métodos extraem dados corretamente.
     *
     * @return void
     */
    public function test_sucesso_ao_obter_rota_e_dados_corretos()
    {
        // Coordenadas válidas (ex: Luanda, Angola)
        $coordenadas = [
            [13.23421234, -8.83821671],
            [13.23500000, -8.83900000]
        ];

        // Instanciar serviço com cliente normal
        $servico = new OpenRouteService($coordenadas);

        // Verificar se foi bem-sucedido
        $this->assertTrue($servico->sucesso());

        // Testar métodos de extração
        $distancia = $servico->obterDistanciaTotal();
        $duracao = $servico->obterDuracaoTotal();
        $distanciaTrecho = $servico->obterDistanciaPrimeiroTrecho();

        // Verificar tipos
        $this->assertIsFloat($distancia);
        $this->assertIsFloat($duracao);
        $this->assertIsFloat($distanciaTrecho);

        // Valores válidos
        $this->assertGreaterThan(0, $distancia);
        $this->assertGreaterThan(0, $duracao);
        $this->assertLessThanOrEqual($distancia, $distanciaTrecho - 1); // Aproximadamente igual
    }

    /**
     * Testa se os métodos não falham quando a requisição falha.
     *
     * @return void
     */
    public function test_falha_na_requisicao_retorna_valores_nulos()
    {
        // Coordenadas inválidas ou fora do formato esperado
        $coordenadasInvalidas = [[], []];

        $servico = new OpenRouteService($coordenadasInvalidas);

        // Deve retornar falso
        $this->assertFalse($servico->sucesso());

        // Todos os métodos devem retornar null
        $this->assertNull($servico->obterDistanciaTotal());
        $this->assertNull($servico->obterDuracaoTotal());
        $this->assertNull($servico->obterDistanciaPrimeiroTrecho());
        $this->assertNull($servico->obterInstrucoes());
        $this->assertNull($servico->getGeometry());
    }

    /**
     * Testa se o serviço aceita injeção de cliente mockado.
     *
     * @return void
     */
    public function test_injecao_de_cliente_mockado()
    {
        // Mock de resposta da API
        $mockResponse = new Response(200, [], json_encode([
            'routes' => [[
                'summary' => ['distance' => 1012.4, 'duration' => 186.1],
                'segments' => [[
                    'distance' => 1012.4,
                    'duration' => 186.1,
                    'steps' => []
                ]]
            ]]
        ]));

        // Cliente mockado
        $clientMock = \Mockery::mock(\GuzzleHttp\ClientInterface::class);
        $clientMock->shouldReceive('post')->andReturn($mockResponse);

        // Serviço com cliente injetado
        $servico = new OpenRouteService([[1, 1], [2, 2]], $clientMock);

        // Testar métodos
        $this->assertTrue($servico->sucesso());
        $this->assertEquals(1012.4, $servico->obterDistanciaTotal());
        $this->assertEquals(186.1, $servico->obterDuracaoTotal());
        $this->assertEquals([], $servico->obterInstrucoes());
    }

    /**
     * Testa se uma exceção na requisição é tratada corretamente.
     *
     * @return void
     */
    public function test_excecao_na_requisicao_retorna_falha()
    {
        // Cliente que lança exceção
        $clientMock = \Mockery::mock(\GuzzleHttp\ClientInterface::class);
        $clientMock->shouldReceive('post')->andThrow(new \Exception("Erro de rede"));

        $servico = new OpenRouteService([[1, 1], [2, 2]], $clientMock);

        // Deve falhar
        $this->assertFalse($servico->sucesso());

        // Todos os métodos devem retornar null
        $this->assertNull($servico->obterDistanciaTotal());
        $this->assertNull($servico->obterDuracaoTotal());
        $this->assertNull($servico->obterDistanciaPrimeiroTrecho());
        $this->assertNull($servico->obterInstrucoes());
    }

    #[test]
    public function test_obterDistanciaTotal(){
        // Coordenadas válidas (ex: Luanda, Angola)
        $coordenadas = [
            [-8.83900000, 13.23500000],
            [-8.83900000, 13.23500000]
        ];

        // Instanciar serviço com cliente normal
        $servico = new OpenRouteService($coordenadas);

        $distancia = $servico->obterDistanciaTotal();

        $this->assertIsFloat($distancia);
        $this->assertEquals(0.0,$distancia);
    }
}
