<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\SurveyController;

// Rutas públicas
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Rutas protegidas (requieren autenticación)
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);
    
    // Rutas de encuestas
    Route::get('/surveys', [SurveyController::class, 'index']);
    Route::get('/my-surveys', [SurveyController::class, 'mySurveys']);
    Route::get('/surveys/{id}', [SurveyController::class, 'show']);
    Route::post('/surveys', [SurveyController::class, 'store']);
    Route::put('/surveys/{id}', [SurveyController::class, 'update']);
    Route::delete('/surveys/{id}', [SurveyController::class, 'destroy']);
    Route::post('/surveys/{id}/vote', [SurveyController::class, 'vote']);
});
