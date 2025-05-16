<?php

namespace App\Http\Middleware;

use Illuminate\Auth\Middleware\Authenticate as Middleware;
use Illuminate\Http\Request;
use Illuminate\Auth\AuthenticationException;

class ApiAuthenticate extends Middleware
{
    protected function unauthenticated($request, array $guards)
    {
        // Ao invés de redirecionar, lança exceção de autenticação que retorna JSON
        throw new AuthenticationException(
            'Não autenticado.',
            $guards,
            $this->redirectTo($request)
        );
    }

    protected function redirectTo(Request $request): ?string
    {
        // Retorna null para evitar qualquer redirecionamento
        return null;
    }
}
