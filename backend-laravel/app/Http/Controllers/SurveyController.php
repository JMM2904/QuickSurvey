<?php

namespace App\Http\Controllers;

use App\Models\Survey;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class SurveyController extends Controller
{
    /**
     * Obtener todas las encuestas activas con opciones y conteo de votos
     * Excluye las encuestas del usuario autenticado
     */
    public function index()
    {
        $surveys = Survey::with(['user', 'options'])
            ->withCount('votes')
            ->where('is_active', true)
            ->where('user_id', '!=', Auth::id())
            ->latest()
            ->get();

        return response()->json($surveys);
    }

    /**
     * Obtener las encuestas del usuario autenticado
     */
    public function mySurveys()
    {
        $surveys = Survey::with(['user', 'options'])
            ->withCount('votes')
            ->where('user_id', Auth::id())
            ->latest()
            ->get();

        return response()->json($surveys);
    }

    /**
     * Obtener una encuesta específica
     */
    public function show($id)
    {
        $survey = Survey::with(['user', 'options.votes'])
            ->withCount('votes')
            ->findOrFail($id);

        return response()->json($survey);
    }

    /**
     * Crear una nueva encuesta
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'options' => 'required|array|min:2',
            'options.*.text' => 'required|string|max:255',
            'options.*.color' => 'required|string|max:7',
        ]);

        /** @var \App\Models\User $user */
        $user = Auth::user();
        $survey = $user->surveys()->create([
            'title' => $validated['title'],
            'description' => $validated['description'] ?? null,
            'is_active' => true,
        ]);

        foreach ($validated['options'] as $option) {
            $survey->options()->create([
                'text' => $option['text'],
                'color' => $option['color'],
            ]);
        }

        return response()->json($survey->load('options'), 201);
    }

    /**
     * Actualizar una encuesta
     */
    public function update(Request $request, $id)
    {
        $survey = Survey::findOrFail($id);

        if ($survey->user_id !== Auth::id()) {
            return response()->json(['error' => 'No autorizado'], 403);
        }

        $validated = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'is_active' => 'sometimes|boolean',
        ]);

        $survey->update($validated);

        return response()->json($survey);
    }

    /**
     * Eliminar una encuesta
     */
    public function destroy($id)
    {
        $survey = Survey::findOrFail($id);

        if ($survey->user_id !== Auth::id()) {
            return response()->json(['error' => 'No autorizado'], 403);
        }

        $survey->delete();

        return response()->json(['message' => 'Encuesta eliminada'], 200);
    }

    /**
     * Votar en una encuesta
     */
    public function vote(Request $request, $id)
    {
        $validated = $request->validate([
            'survey_option_id' => 'required|exists:survey_options,id',
        ]);

        $survey = Survey::findOrFail($id);

        // Bloquear si la encuesta está finalizada
        if (!$survey->is_active) {
            return response()->json(['error' => 'La encuesta ya ha finalizado'], 403);
        }

        // Bloquear si el usuario es el dueño
        if ($survey->user_id === Auth::id()) {
            return response()->json(['error' => 'No puedes votar tu propia encuesta'], 403);
        }

        // Bloquear votos duplicados
        $yaVoto = $survey->votes()->where('user_id', Auth::id())->exists();
        if ($yaVoto) {
            return response()->json(['error' => 'Ya has votado esta encuesta'], 409);
        }

        // Verificar que la opción pertenece a esta encuesta
        $option = $survey->options()->findOrFail($validated['survey_option_id']);

        // Crear el voto
        $vote = $survey->votes()->create([
            'user_id' => Auth::id(),
            'survey_option_id' => $validated['survey_option_id'],
        ]);

        return response()->json([
            'message' => 'Voto registrado',
            'vote' => $vote,
        ], 201);
    }
}
