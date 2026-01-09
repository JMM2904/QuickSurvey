<?php

namespace App\Http\Controllers;

use App\Models\Survey;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class SurveyController extends Controller
{
    
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

    
    public function adminSurveys()
    {
        $user = Auth::user();
        $isAdmin = $user && strtolower($user->role ?? '') === 'admin';

        if (!$isAdmin) {
            return response()->json(['error' => 'No autorizado'], 403);
        }

        $surveys = Survey::with(['user', 'options'])
            ->withCount('votes')
            ->where('user_id', '!=', $user->id)
            ->latest()
            ->get();

        return response()->json($surveys);
    }

    
    public function mySurveys()
    {
        $surveys = Survey::with(['user', 'options'])
            ->withCount('votes')
            ->where('user_id', Auth::id())
            ->latest()
            ->get();

        return response()->json($surveys);
    }

    
    public function show($id)
    {
        $survey = Survey::with(['user', 'options.votes'])
            ->withCount('votes')
            ->findOrFail($id);

        return response()->json($survey);
    }

    
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'options' => 'required|array|min:2',
            'options.*.text' => 'required|string|max:255',
            'options.*.color' => 'required|string|max:7',
        ]);

        
        $user = Auth::user();
        if (!$user) {
            return response()->json(['error' => 'No autenticado'], 401);
        }
        
        $survey = Survey::create([
            'user_id' => $user->id,
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

    
    public function destroy($id)
    {
        $survey = Survey::findOrFail($id);

        $user = Auth::user();
        $isAdmin = $user && strtolower($user->role ?? '') === 'admin';
        
       
        if ($survey->user_id !== $user->id && !$isAdmin) {
            return response()->json(['error' => 'No autorizado'], 403);
        }

        $survey->delete();

        return response()->json(['message' => 'Encuesta eliminada'], 200);
    }

    
    public function vote(Request $request, $id)
    {
        $validated = $request->validate([
            'survey_option_id' => 'required|exists:survey_options,id',
        ]);

        $survey = Survey::findOrFail($id);

        $user = Auth::user();
        $isAdmin = $user && strtolower($user->role ?? '') === 'admin';

       
        if (!$survey->is_active) {
            return response()->json(['error' => 'La encuesta ya ha finalizado'], 403);
        }

        if (!$isAdmin) {
           
            if ($survey->user_id === $user->id) {
                return response()->json(['error' => 'No puedes votar tu propia encuesta'], 403);
            }

           
            $yaVoto = $survey->votes()->where('user_id', $user->id)->exists();
            if ($yaVoto) {
                return response()->json(['error' => 'Ya has votado esta encuesta'], 409);
            }
        }

       
        $option = $survey->options()->findOrFail($validated['survey_option_id']);

       
        $vote = $survey->votes()->create([
            'user_id' => $user->id,
            'survey_option_id' => $validated['survey_option_id'],
        ]);

        return response()->json([
            'message' => 'Voto registrado',
            'vote' => $vote,
        ], 201);
    }

    public function adminStats()
    {
        return response()->json([
            'totalUsers' => \App\Models\User::count(),
            'totalSurveys' => Survey::count(),
            'totalVotes' => \App\Models\Vote::count(),
        ]);
    }
}

