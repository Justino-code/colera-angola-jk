<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Response;

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


/*Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');*/

/*Teste*/
Route::get('/ping', fn() => response()->json(['pong' => true]));
//Route::get('/dashboard_test', [DashboardController::class, 'overview']);
Route::get('/pacientes/{id}/encaminhamento_test', [PacienteController::class, 'encaminhamento']);
Route::apiResource('usuario_test',  UsuarioController::class);
/*Fim teste*/

// Rotas públicas
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

/*Rotas protegidas*/
Route::middleware('auth:sanctum')->group(function () {
    // Logout
    Route::post('/logout', [AuthController::class, 'logout']);

    // Recursos principais
    Route::apiResource('provincias', ProvinciaController::class);
    Route::apiResource('municipios', MunicipioController::class);
    Route::apiResource('hospitais', HospitalController::class);
    Route::apiResource('pacientes', PacienteController::class);
    Route::apiResource('ambulancia', AmbulanciaController::class);
    Route::apiResource('relatorio', RelatorioController::class);
    Route::apiResource('usuario',  UsuarioController::class);
    Route::apiResource('gabinetes', GabineteController::class);
    Route::apiResource('viaturas', ViaturaController::class);

    // Rotas customizadas
    Route::get('/dashboard', [DashboardController::class, 'overview']);

    //Route::get('/{id}/encaminhamento', [PacienteController::class, 'encaminhamento']);
    Route::get('/pacientes/{id}/encaminhamento', [PacienteController::class, 'encaminhamento']);


    Route::post('/ambulancia/{ambulancia}/location', [AmbulanciaController::class, 'updateLocation']);
    Route::post('/relatorio/{id}/gerar-pdf', [RelatorioController::class, 'gerarPDF']);
    Route::post('/relatorio/gerar', [RelatorioController::class, 'store']);
    Route::delete('/relatorio/{id}', [RelatorioController::class, 'destroy']);
    Route::get('/relatorio/{id}', [RelatorioController::class, 'show']);
    Route::put('/usuario/{user}/permissions', [UsuarioController::class, 'updatePermissions']);

    //Rotas de verificacao de email
    Route::get('/email/verify', [EmailVerificationController::class, 'sendVerificationLink']);
    Route::get('/email/verify/{id}/{hash}', [EmailVerificationController::class, 'verify'])->name('verification.verify');

    Route::get('/perfil', fn () => auth()->user())->middleware('verified');

    // Rota para acessar arquivos privados (retorna sempre um JSON)
    Route::get('/files/{filename}', function ($filename) {
        $path = storage_path('app/private/' . $filename);

        if (!file_exists($path)) {
            return response()->json(['success' => false, 'message' => 'Arquivo não encontrado.'], 404);
        }

        $mime = mime_content_type($path);
        $base64 = base64_encode(file_get_contents($path));

        return response()->json([
            'success' => true,
            'filename' => $filename,
            'mime' => $mime,
            'data' => $base64,
            'url' => null // opcional, caso queira gerar uma URL temporária
        ]);
    })->where('filename', '.*');

    // Dados do usuário autenticado
    Route::get('/me', function (Request $request) {
        return response()->json([
            'success' => true,
            'user' => $request->user()
        ]);
    });
});
