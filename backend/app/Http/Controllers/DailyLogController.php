<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

class DailyLogController extends Controller
{
    public function index(Request $request)
    {
        $logs = Auth::user()->dailyLogs()->where('log_date','>=',Carbon::today()->subDays(365))->orderBy('log_date','asc')->get();

        return response()->json($logs);
    }
}
