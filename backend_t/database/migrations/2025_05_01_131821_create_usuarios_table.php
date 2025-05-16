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
            // ID
            $table->id('id_usuario');

            // Campos do usuário
            $table->string('nome');
            $table->string('email')->unique();
            $table->string('password');

            // Role (ex: gestor, médico, etc)
            $table->enum('role', [
                'gestor',
                'medico',
                'tecnico',
                'enfermeiro',
                'epidemiologista',
                'administrativo',
                'agente_sanitario',
                'farmaceutico',
                'analista_dados',
                'coordenador_regional',
            ]);

            // Permissões (json)
            $table->json('permissoes');

            // Relacionamento com hospital
            $table->unsignedBigInteger('id_hospital');
            $table->foreign('id_hospital')->references('id_hospital')->on('hospital')->nullable();

            // Campos para autenticação e verificação de email
            $table->timestamp('email_verified_at')->nullable();
            $table->rememberToken()->nullable(); // Isso adiciona o campo 'remember_token'

            // Timestamps padrão do Laravel (created_at, updated_at)
            $table->timestamps();
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
