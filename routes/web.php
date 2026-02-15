<?php

use App\Http\Controllers\Admin\AdminAuthController;
use App\Http\Controllers\Admin\AdminPermissionController;
use App\Http\Controllers\Admin\AdminRoleController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');


Route::middleware(['auth', 'verified'])->group(function () {
    // admin
    Route::get('/dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');


    Route::prefix('admin')->name('admin.')->group(function () {

        Route::get('/users', [AdminAuthController::class, 'index'])->middleware('permission:admin.users')->name('users');
        Route::post('/user', [AdminAuthController::class, 'store'])
        ->middleware('permission:admin.user.store')
        ->name('user.store');
        Route::put('/user/{user}', [AdminAuthController::class, 'update'])->middleware('permission:admin.user.update')->name('user.update');
        Route::delete('/user/{user}', [AdminAuthController::class, 'destroy'])->middleware('permission:admin.user.destroy')->name('user.destroy');

        // Role route
        Route::get('/roles', [AdminRoleController::class, 'index'])->middleware('permission:admin.roles')->name('roles');
        Route::post('/role', [AdminRoleController::class, 'store'])->middleware('permission:admin.role.store')->name('role.store');
        Route::put('/role/{role}', [AdminRoleController::class, 'update'])->middleware('permission:admin.role.update')->name('role.update');
        Route::delete('/role/{role}', [AdminRoleController::class, 'destroy'])->middleware('permission:admin.role.destroy')->name('role.destroy');

        // Permission route
        Route::get('/permissions', [AdminPermissionController::class, 'index'])->middleware('permission:admin.permissions')->name('permissions');
        Route::post('/permission', [AdminPermissionController::class, 'store'])->middleware('permission:admin.permission.store')->name('permission.store');
        Route::put('/permission/{permission}', [AdminPermissionController::class, 'update'])->middleware('permission:admin.permission.update')->name('permission.update');
        Route::delete('/permission/{permission}', [AdminPermissionController::class, 'destroy'])->middleware('permission:admin.permission.destroy')->name('permission.destroy');
    });
});




require __DIR__ . '/settings.php';
