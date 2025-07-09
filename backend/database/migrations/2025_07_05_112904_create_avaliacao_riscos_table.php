<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('avaliacao_riscos', function (Blueprint $table) {
            $table->id('id_avaliacao'); // ID da avaliação
            $table->json('sintomas'); // Sintomas informados pelo paciente
            $table->longText('resultado'); // resultado da avaliação
            $table->unsignedBigInteger('id_paciente'); // ID do paciente avaliado
            $table->unsignedBigInteger('id_usuario'); // ID do paciente avaliado
            $table->timestamps(); // Data e hora da avaliação
            $table->foreign('id_paciente')->references('id_paciente')->on('paciente')->onDelete('cascade'); // Chave estrangeira para a tabela paciente
            $table->foreign('id_usuario')->references('id_usuario')->on('usuario')->onDelete('cascade'); // Chave estrangeira para a tabela usuario
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('avaliacao_riscos');
    }
};