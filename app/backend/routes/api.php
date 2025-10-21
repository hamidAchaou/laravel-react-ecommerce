<?php

use App\Http\Controllers\RoleController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ClientController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\PermissionController;
use App\Http\Controllers\UserController;

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

// 👤 User Management (Admin only)
// Route::middleware(['auth:sanctum', 'role:admin'])->group(function () {
Route::apiResource('users', UserController::class);
// });

// 🛍️ Clients (Customers only)
// Route::middleware(['auth:sanctum', 'role:admin|seller'])->group(function () {
Route::apiResource('clients', ClientController::class);
// });

// role
// Route::middleware(['auth:sanctum', 'role:admin'])->group(function () {
    Route::apiResource('roles', RoleController::class);
// });

Route::apiResource('permissions', PermissionController::class);
    
// Additional routes
Route::get('permissions-select', [PermissionController::class, 'getForSelect'])
    ->name('permissions.select');