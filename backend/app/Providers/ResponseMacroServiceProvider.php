<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Response;

class ResponseMacroServiceProvider extends ServiceProvider
{
    /**
     * Registre as macros da aplicação.
     *
     * @return void
     */
    public function boot()
    {
        // Macro para respostas de erro uniformizadas
        Response::macro('error', function ($status, $message = null, $errors = null) {
            $response = [
                'status' => 'error',
                'message' => $message ?: $this->getDefaultMessage($status),
            ];

            if ($errors) {
                $response['errors'] = $errors;
            }

            return response()->json($response, $status);
        });
    }

    /**
     * Retorna uma mensagem padrão para o código de status.
     *
     * @param int $status
     * @return string
     */
    protected function getDefaultMessage(int $status)
    {
        switch ($status) {
            case 401:
                return 'Não autenticado.';
            case 403:
                return 'Acesso proibido.';
            case 422:
                return 'Os dados fornecidos são inválidos.';
            default:
                return 'Ocorreu um erro.';
        }
    }
}
