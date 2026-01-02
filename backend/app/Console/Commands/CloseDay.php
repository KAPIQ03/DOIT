<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Task;
use Carbon\Carbon;

class CloseDay extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:close-day';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Archiwizuje wykonane zadania i przygotowuje system na nowy dzień';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $today = Carbon::today()->toDateString();
        $yesterday = Carbon::yesterday()->toDateString();

        $deletedCount = Task::where('is_completed',true)->where('updated_at','<',Carbon::now()->subDays(30))->delete();

        $this->info("Zarchiwizowano (usunięto) {$deletedCount} wykonanych zadań starszych niż 30 dni.");
    }
}
