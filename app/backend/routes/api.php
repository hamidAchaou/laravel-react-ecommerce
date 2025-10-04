<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\OrderController;

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    $user = $request->user();
    $roles = $user->getRoleNames();
    
    return response()->json([
        'id' => $user->id,
        'name' => $user->name,
        'email' => $user->email,
        'role' => $roles->first() ?? 'user',
        'roles' => $roles,
    ]);
});

// Products routes
Route::apiResource('products', ProductController::class);

// Categories routes
Route::apiResource('categories', CategoryController::class);

// Orders routes
Route::apiResource('orders', OrderController::class);