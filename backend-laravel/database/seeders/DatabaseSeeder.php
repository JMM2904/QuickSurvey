<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Survey;
use App\Models\SurveyOption;
use App\Models\Vote;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Crear usuarios
        $user1 = User::factory()->create([
            'name' => 'María M',
            'email' => 'maria@example.com',
        ]);

        $user2 = User::factory()->create([
            'name' => 'Carlos R',
            'email' => 'carlos@example.com',
        ]);

        $user3 = User::factory()->create([
            'name' => 'Alejandro P',
            'email' => 'alejandro@example.com',
        ]);

        // Usuario de prueba adicional
        $testUser = User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
        ]);

        // Encuesta 1: ¿Cuál es tu red social favorita?
        $survey1 = Survey::create([
            'user_id' => $user1->id,
            'title' => '¿Cuál es tu red social favorita?',
            'description' => 'Queremos saber cuál es la red social que más utilizas',
            'is_active' => true,
        ]);

        $options1 = [
            SurveyOption::create(['survey_id' => $survey1->id, 'text' => 'Instagram', 'color' => '#E1306C']),
            SurveyOption::create(['survey_id' => $survey1->id, 'text' => 'Twitter/X', 'color' => '#1DA1F2']),
            SurveyOption::create(['survey_id' => $survey1->id, 'text' => 'TikTok', 'color' => '#000000']),
            SurveyOption::create(['survey_id' => $survey1->id, 'text' => 'Facebook', 'color' => '#1877F2']),
        ];

        // Solo permitir 1 voto por usuario (4 usuarios = 4 votos)
        Vote::create([
            'survey_id' => $survey1->id,
            'user_id' => $user1->id,
            'survey_option_id' => $options1[0]->id,
        ]);
        Vote::create([
            'survey_id' => $survey1->id,
            'user_id' => $user2->id,
            'survey_option_id' => $options1[1]->id,
        ]);
        Vote::create([
            'survey_id' => $survey1->id,
            'user_id' => $user3->id,
            'survey_option_id' => $options1[2]->id,
        ]);
        Vote::create([
            'survey_id' => $survey1->id,
            'user_id' => $testUser->id,
            'survey_option_id' => $options1[0]->id,
        ]);

        // Encuesta 2: ¿Cuál es tu color favorito?
        $survey2 = Survey::create([
            'user_id' => $user2->id,
            'title' => '¿Cuál es tu color favorito?',
            'description' => 'Una encuesta simple sobre preferencias de colores',
            'is_active' => true,
        ]);

        $options2 = [
            SurveyOption::create(['survey_id' => $survey2->id, 'text' => 'Azul', 'color' => '#0000ff']),
            SurveyOption::create(['survey_id' => $survey2->id, 'text' => 'Rojo', 'color' => '#ff0000']),
            SurveyOption::create(['survey_id' => $survey2->id, 'text' => 'Verde', 'color' => '#00ff00']),
            SurveyOption::create(['survey_id' => $survey2->id, 'text' => 'Amarillo', 'color' => '#ffff00']),
            SurveyOption::create(['survey_id' => $survey2->id, 'text' => 'Morado', 'color' => '#5112ff']),
        ];

        Vote::create([
            'survey_id' => $survey2->id,
            'user_id' => $user1->id,
            'survey_option_id' => $options2[4]->id,
        ]);
        Vote::create([
            'survey_id' => $survey2->id,
            'user_id' => $user2->id,
            'survey_option_id' => $options2[0]->id,
        ]);
        Vote::create([
            'survey_id' => $survey2->id,
            'user_id' => $user3->id,
            'survey_option_id' => $options2[2]->id,
        ]);
        Vote::create([
            'survey_id' => $survey2->id,
            'user_id' => $testUser->id,
            'survey_option_id' => $options2[4]->id,
        ]);

        // Encuesta 3: ¿Cuál es tu comida favorita?
        $survey3 = Survey::create([
            'user_id' => $user3->id,
            'title' => '¿Cuál es tu comida favorita?',
            'description' => 'Ayúdanos a conocer tus preferencias culinarias',
            'is_active' => true,
        ]);

        $options3 = [
            SurveyOption::create(['survey_id' => $survey3->id, 'text' => 'Pizza', 'color' => '#ff8800']),
            SurveyOption::create(['survey_id' => $survey3->id, 'text' => 'Hamburguesa', 'color' => '#8b4513']),
            SurveyOption::create(['survey_id' => $survey3->id, 'text' => 'Sushi', 'color' => '#ff1744']),
            SurveyOption::create(['survey_id' => $survey3->id, 'text' => 'Tacos', 'color' => '#ffeb3b']),
            SurveyOption::create(['survey_id' => $survey3->id, 'text' => 'Pasta', 'color' => '#ffd54f']),
        ];

        Vote::create([
            'survey_id' => $survey3->id,
            'user_id' => $user1->id,
            'survey_option_id' => $options3[0]->id,
        ]);
        Vote::create([
            'survey_id' => $survey3->id,
            'user_id' => $user2->id,
            'survey_option_id' => $options3[3]->id,
        ]);
        Vote::create([
            'survey_id' => $survey3->id,
            'user_id' => $user3->id,
            'survey_option_id' => $options3[2]->id,
        ]);
        Vote::create([
            'survey_id' => $survey3->id,
            'user_id' => $testUser->id,
            'survey_option_id' => $options3[0]->id,
        ]);
    }
}
