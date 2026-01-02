<?php

namespace App\Http\Controllers;

use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Goal;

class ProjectController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return response()->json(Auth::user()->projects()->with('goal')->get());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $fields = $request->validate([
            'name' => 'required|string|max:255',
            'goal_id' => 'nullable|exists:goals,id',
        ]);

        if(isset($fields['goal_id'])) {
            $goal = Goal::find($fields['goal_id']);
            if(!$goal || $goal->user_id !== Auth::id()) {
                return response()->json(['message' => 'Invalid goal_id'], 400);
            }
        }
        $project = Auth::user()->projects()->create([
            'name' => $fields['name'],
            'goal_id' => $fields['goal_id'] ?? null,
        ]);

        return response()->json($project, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Project $project)
    {
        if($project->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        return response()->json($project->load('goal'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Project $project)
    {
        if($project->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $fields = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'goal_id' => 'nullable|exists:goals,id',
        ]);

        if(isset($fields['goal_id'])) {
            $goal = Goal::find($fields['goal_id']);
            if(!$goal || $goal->user_id !== Auth::id()) {
                return response()->json(['message' => 'Invalid goal_id'], 400);
            }
        }
        else if(array_key_exists('goal_id', $fields) && $fields['goal_id'] === null) {
            $fields['goal_id'] = null;
        }

        $project->update($fields);

        return response()->json($project->load('goal'));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Project $project)
    {
        if($project->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $project->delete();

        return response()->json(['message' => 'Project deleted successfully']);
    }
}
