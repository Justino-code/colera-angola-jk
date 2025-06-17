<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('viatura', function (Blueprint $table) {
            $table->id('id_viatura');
            $table->string('identificacao')->unique();
            $table->enum('tipo', ['ambulancia', 'outros'])->default('ambulancia');
            $table->enum('status', ['disponivel', 'em_viagem', 'ocupada'])->default('disponivel');
            $table->decimal('latitude', 10, 7)->nullable();
            $table->decimal('longitude', 10, 7)->nullable();
            $table->unsignedBigInteger('id_hospital');
            $table->foreign('id_hospital')->references('id_hospital')->on('hospital')->onDelete('cascade');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('viaturas');
    }
};
