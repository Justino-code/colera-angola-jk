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
        Schema::create('patiente', function (Blueprint $table) {
    $table->id();
    $table->string('nome');
    $table->string('bi_number')->unique();
    $table->encrypted('telefone');
    $table->integer('idade');
    $table->enum('sexo', ['M', 'F', 'Outro']);
    $table->json('sintomas');
    $table->encrypted('resultado_triagem');
    $table->string('qr_code')->unique();
    $table->foreignId('hospital_id')->constrained('hospitals');
    $table->timestamps();
});
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pacientes');
    }
};
