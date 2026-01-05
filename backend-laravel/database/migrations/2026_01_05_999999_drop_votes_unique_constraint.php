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
        Schema::table('votes', function (Blueprint $table) {
            // Agregar índices simples para que los FKs sigan teniendo índice al quitar el único
            $table->index('survey_id');
            $table->index('user_id');

            // Permitir múltiples votos por usuario (lo controlamos por código para no admins)
            $table->dropUnique('votes_survey_id_user_id_unique');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('votes', function (Blueprint $table) {
            $table->unique(['survey_id', 'user_id']);
            $table->dropIndex(['survey_id']);
            $table->dropIndex(['user_id']);
        });
    }
};
