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
        Schema::create('paciente', function (Blueprint $table) {
    $table->id('id_paciente');
    $table->string('nome');
    $table->string('numero_bi')->unique();
    $table->string('telefone');
    $table->integer('idade');
    $table->enum('sexo', ['M', 'F']);
    $table->json('sintomas');
    $table->string('resultado_triagem');
    $table->string('qr_code')->unique()->nullable();
    $table->decimal('latitude', 10, 8);
    $table->decimal('longitude', 11, 8);
    $table->string('nome_hospital')->nullable();
    $table->unsignedBigInteger('id_hospital')->nullable();
    $table->foreign('id_hospital')->references('id_hospital')->on('hospital')->onDelete('set null');
    $table->timestamps();
});
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('paciente');
    }
};
