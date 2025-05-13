<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AmbulanciaController;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/test/{id}', [AmbulanciaController::class,'index']);

