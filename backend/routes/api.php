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


/*Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');*/

/*Teste*/
Route::get('/ping', fn() => response()->json(['pong' => true]));
/*Fim teste*/

// Rotas públicas
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

/*Rotas protegidas*/
Route::middleware('auth:sanctum')->group(function () {
    // Logout
    Route::post('/logout', [AuthController::class, 'logout']);

    // Recursos principais
    Route::apiResource('provincia', ProvinciaController::class);
    Route::apiResource('municipio', MunicipioController::class);
    Route::apiResource('hospital', HospitalController::class);
    Route::apiResource('paciente', PacienteController::class);
    Route::apiResource('ambulancia', AmbulanciaController::class);
    Route::apiResource('relatorio', RelatorioController::class);
    Route::apiResource('usuario',  UsuarioController::class);
    Route::apiResource('gabinetes', GabineteController::class);
    Route::apiResource('viaturas', ViaturaController::class);


    // Rotas customizadas
    Route::post('/ambulancia/{ambulancia}/location', [AmbulanciaController::class, 'updateLocation']);
    Route::post('/relatorio/generate-pdf', [RelatorioController::class, 'generatePDF']);
    Route::put('/usuario/{user}/permissions', [UsuarioController::class, 'updatePermissions']);

    //Rotas de verificacao de email
    Route::get('/email/verify', [EmailVerificationController::class, 'sendVerificationLink']);
    Route::get('/email/verify/{id}/{hash}', [EmailVerificationController::class, 'verify'])->name('verification.verify');

    Route::get('/perfil', fn () => auth()->user())->middleware('verified');
});
