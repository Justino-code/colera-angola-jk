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
       Schema::create('ambulancia', function (Blueprint $table) {
    $table->id();
    $table->string('placa')->unique();
    $table->enum('status', [
        'disponivel', 
        'em_viagem', 
        'ocupada'
    ]);
    $table->decimal('latitude', 10, 8);
    $table->decimal('longitude', 11, 8);
    $table->foreignId('hospital_id')->constrained('hospitals');
    $table->timestamps();
});
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ambulancias');
    }
};
