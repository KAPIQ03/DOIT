<?php

namespace App\Http\Controllers;

use App\Models\Task;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Project;

class TaskController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Auth::user()->tasks();

        if ($request->has('project_id')) {
            $projectId = $request->input('project_id');
            $project = Auth::user()->projects()->find($projectId);
            if (!$project) {
                return response()->json(['message' => 'Invalid project_id'], 400);
            }
            $query->where('project_id', $projectId);
        }

        return response()->json($query->with('project')->get());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $fields = $request->validate([
            'title' => 'required|string|max:255',
            'is_completed' => 'boolean',
            'project_id' => 'required|integer|exists:projects,id',
        ]);

        $project = Auth::user()->projects()->find($fields['project_id']);
        if (!$project) {
            return response()->json(['message' => 'Invalid project_id'], 400);
        }

        $task = Auth::user()->tasks()->create([
            'title' => $fields['title'],
            'is_completed' => $fields['is_completed'] ?? false,
            'project_id' => $project->id,
        ]);

        return response()->json($task, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Task $task)
    {
        if($task->project->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        return response()->json($task->load('project'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Task $task)
    {
        if($task->project->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $fields = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'is_completed' => 'sometimes|boolean',
            'project_id' => 'sometimes|required|integer|exists:projects,id',
        ]);

        if(isset($fields['project_id'])) {
            $newProject = Auth::user()->projects()->find($fields['project_id']);
            if(!$newProject) {
                return response()->json(['message' => 'Invalid project_id'], 400);
            }
        }

        $task->update($fields);

        return response()->json($task);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Task $task)
    {
        if($task->project->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $task->delete();

        return response()->json(['message' => 'Task deleted successfully']);
    }
}
