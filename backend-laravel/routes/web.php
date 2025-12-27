<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\DB;

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

// Healthcheck de conexión a base de datos
Route::get('/health/db', function () {
    try {
        DB::connection()->getPdo();
        $name = DB::getDatabaseName();
        return response()->json(['status' => 'ok', 'database' => $name]);
    } catch (\Throwable $e) {
        return response()->json([
            'status' => 'error',
            'message' => $e->getMessage(),
        ], 500);
    }
});
