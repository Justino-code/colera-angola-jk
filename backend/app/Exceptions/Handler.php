<?php

namespace App\Exceptions;

use Illuminate\Auth\AuthenticationException;
use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpFoundation\Response;
use Throwable;

class Handler extends ExceptionHandler
{
    /**
     * A list of exception types with custom levels.
     */
    protected $levels = [];

    /**
     * A list of the exception types that are not reported.
     */
    protected $dontReport = [];

    /**
     * A list of the inputs that are never flashed for validation exceptions.
     */
    protected $dontFlash = [
        'current_password',
        'password',
        'password_confirmation',
    ];

    /**
     * Register the exception handling callbacks.
     */
    public function register(): void
    {
        $this->reportable(function (Throwable $e) {
            // Log errors here, if necessário
        });
    }

    /**
     * Force all responses to JSON format.
     */
    public function render($request, Throwable $exception): Response
    {
        // Força o header Accept para application/json
        if (! $request->expectsJson()) {
            $request->headers->set('Accept', 'application/json');
        }

        // Validação: retorna erro 422 com mensagens
        if ($exception instanceof ValidationException) {
            return response()->json([
                'message' => 'Erro de validação.',
                'errors' => $exception->errors(),
            ], 422);
        }

        return parent::render($request, $exception);
    }

    /**
     * Customize unauthenticated response to always return JSON.
     */
    protected function unauthenticated($request, AuthenticationException $exception)
    {
        return response()->json([
            'message' => 'Não autenticado.'
        ], 401);
    }
}
