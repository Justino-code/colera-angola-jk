<?php

namespace App\Services;

use GuzzleHttp\Client;
use GuzzleHttp\ClientInterface;
use Illuminate\Support\Facades\Log;

class OpenRouteService
{
    protected $client;
    protected $apiKey;
    protected $dadosRota = null;

    /**
     * Faz a requisição ao OpenRouteService no construtor.
     *
     * @param array $coordinates [ [lon1, lat1], [lon2, lat2] ]
     * @param ClientInterface|null $client (opcional para injeção)
     */
    public function __construct(array $coordinates, ClientInterface $client = null)
    {
        // Inicializa cliente Guzzle
        $this->client = $client ?? new Client();
        $this->apiKey = config('services.openrouteservice.key') ?: env('OPENROUTESERVICE_KEY');

        // Faz a requisição na inicialização
        $this->dadosRota = $this->fazerRequisicao($coordinates);
    }

    /**
     * Faz a requisição à API do OpenRouteService.
     *
     * @param array $coordinates [ [lon1, lat1], [lon2, lat2] ]
     * @return array|false
     */
    private function fazerRequisicao(array $coordinates)
    {
        try {
            $response = $this->client->post('https://api.openrouteservice.org/v2/directions/driving-car', [
                'headers' => [
                    'Authorization' => $this->apiKey,
                    'Content-Type' => 'application/json'
                ],
                'json' => [
                    'coordinates' => $coordinates
                ]
            ]);

            return json_decode($response->getBody(), true);
        } catch (\Exception $e) {
            Log::error("Erro na API do OpenRouteService: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Retorna se a requisição foi bem-sucedida.
     *
     * @return bool
     */
    public function sucesso(): bool
    {
        return is_array($this->dadosRota);
    }

    /**
     * Retorna a distância total da rota em metros.
     *
     * @return float|null
     */
    public function obterDistanciaTotal()
    {
        return $this->dadosRota['routes'][0]['segments'][0]['distance'] ?? null;
    }

    /**
     * Retorna a duração total da rota em segundos.
     *
     * @return float|null
     */
    public function obterDuracaoTotal(): ?float
    {
        return $this->dadosRota['routes'][0]['segments'][0]['duration'] ?? null;
    }

    /**
     * Retorna a distância do primeiro segmento da rota em metros.
     *
     * @return float|null
     */
    public function obterDistanciaPrimeiroTrecho(): ?float
    {
        return $this->dadosRota['routes'][0]['segments'][0]['steps'][0]['distance'] ?? null;
    }

    /**
     * Retorna as instruções de navegação como um array.
     *
     * @return array|null
     */
    public function obterInstrucoes(): ?array
    {
        return $this->dadosRota['routes'][0]['segments'][0]['steps'] ?? null;
    }

    /**
     * Retorna todos os dados brutos da rota.
     *
     * @return array|false
     */
    public function obterDadosBrutos()
    {
        return $this->dadosRota;
    }

    public function getGeometry(): ?string{
        return $this->dadosRota['routes'][0]['geometry'] ?? null;
    }
}
