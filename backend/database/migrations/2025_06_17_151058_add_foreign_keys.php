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
        Schema::table('gabinete', function (Blueprint $table) {
            $table->foreign('id_responsavel')->references('id_usuario')->on('usuario')->onDelete('set null');
        });

        Schema::table('usuario', function (Blueprint $table) {
            $table->foreign('id_gabinete')->references('id_gabinete')->on('gabinete')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};
