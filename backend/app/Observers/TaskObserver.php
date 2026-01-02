<?php

namespace App\Observers;

use App\Models\Task;
use App\Models\DailyLog;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log; // Import Log

class TaskObserver
{
    /**
     * Handle the Task "created" event.
     */
    public function created(Task $task): void
    {
        if ($task->is_completed) {
            $this->updateDailyLog($task, 1);
        }
    }

    /**
     * Handle the Task "updated" event.
     */
    public function updated(Task $task): void
    {
        
        if ($task->isDirty('is_completed')) { 
            if ($task->is_completed) {
                $this->updateDailyLog($task, 1);
            } else {
                $this->updateDailyLog($task, -1);
            }
        }
    }

    /**
     * Handle the Task "deleted" event.
     */
    public function deleted(Task $task): void
    {
        if ($task->is_completed) {
             $this->updateDailyLog($task, -1);
        }
    }


    /**
     * Helper method to update daily log
     */
    private function updateDailyLog(Task $task, int $change): void
    {
        if (!$task->relationLoaded('project')) {
            $task->load('project.user');
        }

        $user = $task->project->user ?? null;

        if (!$user) {
            Log::warning("TaskObserver: Task {$task->id} has no associated user via project.");
            return;
        }

        $today = Carbon::today()->toDateString();

        Log::info("TaskObserver: Updating DailyLog for User {$user->id}, Date: {$today}, Change: {$change}");

        $dailyLog = DailyLog::firstOrCreate(
            [
                'user_id' => $user->id,
                'log_date' => $today
            ],
            [
                'completed_count' => 0
            ]
        );

        if ($change > 0) {
            $dailyLog->increment('completed_count');
        } else {
            if ($dailyLog->completed_count > 0) {
                $dailyLog->decrement('completed_count');
            }
        }
    }
}
