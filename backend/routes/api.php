<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\GoalController;
use App\Http\Controllers\ProjectController;

//Public routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

//Protected routes (require authentication)
Route::group(['middleware' => ['auth:sanctum']], function() {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);

    //Goal API routes
    Route::apiResource('goals', GoalController::class);

    //Project API routes
    Route::apiResource('projects', ProjectController::class);
});


