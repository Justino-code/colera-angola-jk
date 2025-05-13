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
       Schema::create('relatorio', function (Blueprint $table) {
            $table->id('id_relatorio');
            $table->enum('tipo', [
                'casos_por_regiao',
                'evolucao_temporal',
                'distribuicao_demografica',
                'outro'
            ]);
            $table->json('dados');
            $table->unsignedBigInteger('id_usuario');
            $table->foreign('id_usuario')->references('id_usuario')->on('usuario')->onDelete('cascade'); // Quem gerou
            $table->timestamp('data_geracao')->useCurrent();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('relatorio');
    }
};
