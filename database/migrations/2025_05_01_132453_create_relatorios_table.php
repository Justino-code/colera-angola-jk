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
       Schema::create('relatorios', function (Blueprint $table) {
            $table->id();
            $table->enum('tipo', [
                'casos_por_regiao', 
                'evolucao_temporal', 
                'distribuicao_demografica'
            ]);
            $table->json('dados');
            $table->foreignId('usuario_id')->constrained('users')->onDelete('cascade'); // Quem gerou
            $table->timestamp('data_geracao')->useCurrent();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('relatorios');
    }
};
