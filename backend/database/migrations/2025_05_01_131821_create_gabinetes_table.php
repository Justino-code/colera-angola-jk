<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('gabinete', function (Blueprint $table) {
    $table->id('id_gabinete');
    $table->string('nome');
    $table->string('contacto')->nullable();
    $table->unsignedBigInteger('id_municipio');
    $table->unsignedBigInteger('id_responsavel')->nullable(); // FK depois
    $table->timestamps();

    $table->foreign('id_municipio')->references('id_municipio')->on('municipio')->onDelete('cascade');
});

    }

    public function down(): void
    {
        Schema::dropIfExists('gabinetes');
    }
};
