<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProvinciaController;
use App\Http\Controllers\MunicipioController;
use App\Http\Controllers\HospitalController;
use App\Http\Controllers\PacienteController;
use App\Http\Controllers\AmbulanciaController;
use App\Http\Controllers\RelatorioController;
use App\Http\Controllers\UsuarioController;

/*
 * |--------------------------------------------------------------------------
 * | API Routes
 * |--------------------------------------------------------------------------
 * |
 * | Aqui você pode registrar as rotas da API. Essas rotas são carregadas pelo
 * | RouteServiceProvider e todas elas serão atribuídas ao grupo "api".
 * |
 */

//Rotas de teste
Route::middleware('api')->group(function () {
    Route::get('/ping', fn() => response()->json(['pong' => true]));
});

// Rotas públicas
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

// Rotas protegidas
Route::middleware('auth:sanctum')->group(function () {
    // Autenticação
    Route::post('/logout', [AuthController::class, 'logout']);

    // Recursos principais
    Route::apiResource('provinces', ProvinciaController::class);
    Route::apiResource('municipios', MunicipioController::class);
    Route::apiResource('hospitals', HospitalController::class);
    Route::apiResource('pacientes', PacienteController::class);
    Route::apiResource('ambulances', AmbulanciaController::class);
    Route::apiResource('relatorios', RelatorioController::class);

    // Rotas customizadas
    Route::post('/ambulances/{ambulancia}/location', [AmbulanciaController::class, 'updateLocation']);
    Route::post('/relatorios/generate-pdf', [RelatorioController::class, 'generatePDF']);
    Route::put('/usuarios/{user}/permissions', [UsuarioController::class, 'updatePermissions']);
});
