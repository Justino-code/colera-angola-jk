<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;

// Middleware personalizados
use App\Http\Middleware\ForceJsonResponse;
use App\Http\Middleware\ApiAuthenticate;

// Sanctum
use Laravel\Sanctum\SanctumServiceProvider;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        apiPrefix: 'api/v1',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        //
         $middleware->append(\Illuminate\Http\Middleware\HandleCors::class);
        $middleware->prepend(ForceJsonResponse::class);
        $middleware->alias(['auth' => ApiAuthenticate::class]);
        //dd($middleware);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
        $exceptions->renderable(function (\Illuminate\Auth\AuthenticationException $e, Request $request) {
            return response()->json([
                'message' => 'Não autenticado.'
            ], 401);
        });

        $exceptions->renderable(function (\Illuminate\Auth\Access\AuthorizationException $e, Request $request) {
            return response()->json(['message' => 'Você não tem permissão para esta ação.'], 403);
        });


        $exceptions->renderable(function (\Illuminate\Routing\Exceptions\RouteNotFoundException $e, Request $request) {
            // Quando tenta redirecionar para a rota 'login' e ela não existe
            return response()->json([
                'message' => 'Não autenticado. Rota de login não definida.'
            ], 401);
        });
    })
    // Registra o ServiceProvider do Sanctum (essencial no Laravel 12+)
    ->withProviders([
        SanctumServiceProvider::class,
    ])->create();
