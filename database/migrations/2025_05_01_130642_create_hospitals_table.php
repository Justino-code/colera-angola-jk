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
        Schema::create('hospital', function (Blueprint $table) {
    $table->id();
    $table->string('nome');
    $table->enum('tipo', [
        'Geral', 
        'Municipal', 
        'Centro de Saúde', 
        'Posto Médico', 
        'Clínica', 
        'Outros'
    ]);
    $table->string('endereco');
    $table->decimal('latitude', 10, 8);
    $table->decimal('longitude', 11, 8);
    $table->integer('capacidade_leitos');
    $table->foreignId('municipio_id')->constrained('municipios');
    $table->timestamps();
});
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('hospitals');
    }
};
