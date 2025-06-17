<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('usuario', function (Blueprint $table) {
    $table->id('id_usuario');
    $table->string('nome');
    $table->string('email')->unique();
    $table->string('password');
    $table->enum('role', [
        'gestor', 'medico', 'tecnico', 'enfermeiro', 'epidemiologista',
        'administrativo', 'agente_sanitario', 'farmaceutico',
        'analista_dados', 'coordenador_regional'
    ]);
    $table->json('permissoes');
    $table->unsignedBigInteger('id_hospital')->nullable();
    $table->unsignedBigInteger('id_gabinete')->nullable(); // FK depois
    $table->timestamp('email_verified_at')->nullable();
    $table->rememberToken()->nullable();
    $table->timestamps();

    $table->foreign('id_hospital')->references('id_hospital')->on('hospital')->onDelete('cascade');
});

    }


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('usuario');
    }
};
