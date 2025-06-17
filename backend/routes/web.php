<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\ProvinciaController;
use App\Http\Controllers\MunicipioController;
use App\Http\Controllers\HospitalController;
use App\Http\Controllers\PacienteController;
use App\Http\Controllers\AmbulanciaController;
use App\Http\Controllers\RelatorioController;
use App\Http\Controllers\UsuarioController;
use App\Http\Controllers\Auth\EmailVerificationController;
use App\Http\Controllers\GabineteController;
use App\Http\Controllers\ViaturaController;

use App\Http\Controllers\DashboardController;

/*Teste*/
Route::get('/ping', fn() => response()->json(['pong' => true]));
Route::get('/dashboard_test', [DashboardController::class, 'overview']);
//Route::apiResource('provincia_test', ProvinciaController::class);
   // PROVINCIA
Route::get('provincia_test', [ProvinciaController::class, 'index']);
Route::post('provincia_test', [ProvinciaController::class, 'store']);
Route::get('provincia_test/{id}', [ProvinciaController::class, 'show']);
Route::post('provincia_test/{id}', [ProvinciaController::class, 'update']); // via POST + _method=PUT
Route::post('provincia_test/{id}/delete', [ProvinciaController::class, 'destroy']); // via POST + _method=DELETE

// MUNICIPIO
Route::get('municipio_test', [MunicipioController::class, 'index']);
Route::post('municipio_test', [MunicipioController::class, 'store']);
Route::get('municipio_test/{id}', [MunicipioController::class, 'show']);
Route::post('municipio_test/{id}', [MunicipioController::class, 'update']);
Route::post('municipio_test/{id}/delete', [MunicipioController::class, 'destroy']);

// HOSPITAIS
Route::get('hospitais_test', [HospitalController::class, 'index']);
Route::post('hospitais_test', [HospitalController::class, 'store']);
Route::get('hospitais_test/{id}', [HospitalController::class, 'show']);
Route::post('hospitais_test/{id}', [HospitalController::class, 'update']);
Route::post('hospitais_test/{id}/delete', [HospitalController::class, 'destroy']);

// PACIENTES
Route::get('pacientes_test', [PacienteController::class, 'index']);
Route::post('pacientes_test', [PacienteController::class, 'store']);
Route::get('pacientes_test/{id}', [PacienteController::class, 'show']);
Route::post('pacientes_test/{id}', [PacienteController::class, 'update']);
Route::post('pacientes_test/{id}/delete', [PacienteController::class, 'destroy']);

// AMBULANCIA
Route::get('ambulancia_test', [AmbulanciaController::class, 'index']);
Route::post('ambulancia_test', [AmbulanciaController::class, 'store']);
Route::get('ambulancia_test/{id}', [AmbulanciaController::class, 'show']);
Route::post('ambulancia_test/{id}', [AmbulanciaController::class, 'update']);
Route::post('ambulancia_test/{id}/delete', [AmbulanciaController::class, 'destroy']);

// RELATORIO
Route::get('relatorio_test', [RelatorioController::class, 'index']);
Route::post('relatorio_test', [RelatorioController::class, 'store']);
Route::get('relatorio_test/{id}', [RelatorioController::class, 'show']);
Route::post('relatorio_test/{id}', [RelatorioController::class, 'update']);
Route::post('relatorio_test/{id}/delete', [RelatorioController::class, 'destroy']);

// USUARIO
Route::get('usuario_test', [UsuarioController::class, 'index']);
Route::post('usuario_test', [UsuarioController::class, 'store']);
Route::get('usuario_test/{id}', [UsuarioController::class, 'show']);
Route::post('usuario_test/{id}', [UsuarioController::class, 'update']);
Route::post('usuario_test/{id}/delete', [UsuarioController::class, 'destroy']);

// GABINETE
Route::get('gabinetes_test', [GabineteController::class, 'index']);
Route::post('gabinetes_test', [GabineteController::class, 'store']);
Route::get('gabinetes_test/{id}', [GabineteController::class, 'show']);
Route::post('gabinetes_test/{id}', [GabineteController::class, 'update']);
Route::post('gabinetes_test/{id}/delete', [GabineteController::class, 'destroy']);

// VIATURA
Route::get('viaturas_test', [ViaturaController::class, 'index']);
Route::post('viaturas_test', [ViaturaController::class, 'store']);
Route::get('viaturas_test/{id}', [ViaturaController::class, 'show']);
Route::post('viaturas_test/{id}', [ViaturaController::class, 'update']);
Route::post('viaturas_test/{id}/delete', [ViaturaController::class, 'destroy']);













// Formulário de criação
Route::get('/testes/usuarios/form-criar', function () {
    return view('testes.create');
});

Route::get('/pacientes_test', fn() => view('testes.teste_pacientes'));
Route::get('/provincias_test', fn() => view('testes.provincia'));

Route::get('/municipios_test', fn() => view('testes.minicipio'));

Route::get('/g_test', fn() => view('testes.gabinete'));



































/*Fim teste*/
