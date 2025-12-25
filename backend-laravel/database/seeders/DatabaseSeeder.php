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
        // Create test users
        $user1 = User::factory()->create([
            'name' => 'Juan Pérez',
            'email' => 'juan@example.com',
        ]);

        $user2 = User::factory()->create([
            'name' => 'María García',
            'email' => 'maria@example.com',
        ]);

        // Create test surveys
        $survey1 = Survey::create([
            'user_id' => $user1->id,
            'title' => '¿Cuál es tu lenguaje de programación favorito?',
            'color' => '#FF5733',
            'image' => null,
        ]);

        // Add options to survey 1
        $option1 = SurveyOption::create([
            'survey_id' => $survey1->id,
            'text' => 'PHP',
        ]);

        $option2 = SurveyOption::create([
            'survey_id' => $survey1->id,
            'text' => 'Python',
        ]);

        $option3 = SurveyOption::create([
            'survey_id' => $survey1->id,
            'text' => 'JavaScript',
        ]);

        // Add some test votes to survey 1
        Vote::create([
            'survey_id' => $survey1->id,
            'survey_option_id' => $option1->id,
            'user_id' => $user2->id,
        ]);

        Vote::create([
            'survey_id' => $survey1->id,
            'survey_option_id' => $option2->id,
            'user_id' => $user1->id,
        ]);

        // Create another survey
        $survey2 = Survey::create([
            'user_id' => $user2->id,
            'title' => '¿Qué framework web prefieres?',
            'color' => '#33FF57',
            'image' => null,
        ]);

        // Add options to survey 2
        $optionA = SurveyOption::create([
            'survey_id' => $survey2->id,
            'text' => 'Laravel',
        ]);

        $optionB = SurveyOption::create([
            'survey_id' => $survey2->id,
            'text' => 'Django',
        ]);

        $optionC = SurveyOption::create([
            'survey_id' => $survey2->id,
            'text' => 'Spring Boot',
        ]);

        // Add test votes to survey 2
        Vote::create([
            'survey_id' => $survey2->id,
            'survey_option_id' => $optionA->id,
            'user_id' => $user1->id,
        ]);
    }
}
