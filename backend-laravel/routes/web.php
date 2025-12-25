<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

// Ruta de prueba: devuelve la primera encuesta con opciones y votos
Route::get('/test/survey', function () {
    $survey = App\Models\Survey::with(['options', 'votes'])->first();
    if (! $survey) {
        return response()->json(['error' => 'No surveys found'], 404);
    }
    return response()->json($survey->toArray());
});
