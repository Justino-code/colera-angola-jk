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
use App\Http\Controllers\LoginController;

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
    Route::get('/apitest', fn() => response()->json(['API ok' => true]));
    //Route::get('/ambulancia_test/', [AmbulanciaController::class, 'index']);
    Route::get('/test_db', function(){
        return \Illuminate\Support\Facades\DB::table('ambulancia')->get();
    });

    Route::resource('provincia_test', ProvinciaController::class);
    Route::resource('municipio_test', MunicipioController::class);
    Route::resource('hospital_test', HospitalController::class);
    Route::resource('paciente_test', PacienteController::class);
    Route::resource('ambulancia_test', AmbulanciaController::class);
    Route::resource('relatorio_test', RelatorioController::class);

    Route::resource('paciente_t', PacienteController::class);

    Route::get('/paciente_por_hospital/{id}', [PacienteController::class, 'pacientesPorHospital']);
});

Route::group(['prefix' => 'test'], function(){
    // Recursos principais
    //Routas e teste
    /** Ja foi testado*/
    Route::apiResource('provincia_test', ProvinciaController::class);
    Route::apiResource('municipio_test', MunicipioController::class);
    Route::apiResource('hospital_test', HospitalController::class);
    /* Fim ja foi testado*/

    /** Em teste*/
    Route::apiResource('paciente_test', PacienteController::class);
    /*Fim em teste*/
    /** Nao foi testado*/
    Route::apiResource('ambulancia_test', AmbulanciaController::class);
    Route::apiResource('relatorio_test', RelatorioController::class);

    /* Fim nao foi testado*/
});

/*Fim testes*/

// Rotas públicas
//Route::post('/login', [AuthController::class, 'login']);
//Route::post('/register', [AuthController::class, 'register']);

// Rotas protegidas
Route::middleware('auth:sanctum')->group(function () {
    // Autenticação
    Route::post('/logout', [AuthController::class, 'logout']);

    // Recursos principais
    Route::apiResource('provincia', ProvinciaController::class);
    Route::apiResource('municipio', MunicipioController::class);
    Route::apiResource('hospital', HospitalController::class);
    Route::apiResource('paciente', PacienteController::class);
    Route::apiResource('ambulancia', AmbulanciaController::class);
    Route::apiResource('relatorio', RelatorioController::class);

    // Rotas customizadas
    Route::post('/ambulancia/{ambulancia}/location', [AmbulanciaController::class, 'updateLocation']);
    Route::post('/relatorio/generate-pdf', [RelatorioController::class, 'generatePDF']);
    Route::put('/usuario/{user}/permissions', [UsuarioController::class, 'updatePermissions']);
});

Route::post('/register', [RegisterController::class, 'register']);
Route::post('/login', [LoginController::class, 'login'])->name('login');
Route::get('/login', [LoginController::class, 'login'])->name('login');

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/email/verify', [EmailVerificationController::class, 'sendVerificationLink']);
    Route::get('/email/verify/{id}/{hash}', [EmailVerificationController::class, 'verify'])->name('verification.verify');

    Route::get('/perfil', fn () => auth()->user())->middleware('verified');
});
