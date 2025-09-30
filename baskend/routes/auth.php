<?php

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\EmailVerificationNotificationController;
use App\Http\Controllers\Auth\NewPasswordController;
use App\Http\Controllers\Auth\PasswordResetLinkController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\Auth\VerifyEmailController;
use Illuminate\Support\Facades\Route;

Route::middleware('web')->group(function () {
    Route::prefix('auth')->group(function () {
        // Register
        Route::post('/register', [RegisteredUserController::class, 'store'])
            ->middleware('guest')
            ->name('auth.register');

        // Login
        Route::post('/login', [AuthenticatedSessionController::class, 'store'])
            ->middleware('guest')
            ->name('auth.login');

        // Forgot password
        Route::post('/forgot-password', [PasswordResetLinkController::class, 'store'])
            ->middleware('guest')
            ->name('auth.password.email');

        // Reset password
        Route::post('/reset-password', [NewPasswordController::class, 'store'])
            ->middleware('guest')
            ->name('auth.password.store');

        // Verify email
        Route::get('/verify-email/{id}/{hash}', VerifyEmailController::class)
            ->middleware(['auth:sanctum', 'signed', 'throttle:6,1'])
            ->name('auth.verification.verify');

        // Resend verification email
        Route::post('/email/verification-notification', [EmailVerificationNotificationController::class, 'store'])
            ->middleware(['auth:sanctum', 'throttle:6,1'])
            ->name('auth.verification.send');

        // Logout
        Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])
            ->middleware('auth:sanctum')
            ->name('auth.logout');
    });
});