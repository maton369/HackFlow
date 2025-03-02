<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\TeamController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\StatisticsController;
use App\Http\Controllers\HomeController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Models\Project;
use App\Models\Team;

// ホーム画面
Route::get('/', function () {
    return Inertia::render('Home', [
        'projects' => Project::all(),
        'teams' => Team::all(),
    ]);
})->name('home');

Route::middleware(['auth'])->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('Dashboard');
    })->name('dashboard');
});

// マイページ
Route::middleware(['auth'])->group(function () {
    Route::get('/mypage', function () {
        return Inertia::render('MyPage');
    })->name('mypage');

    // プロジェクト関連
    Route::get('/projects/create', [ProjectController::class, 'create'])->name('projects.create');
    Route::get('/projects/{project}', [ProjectController::class, 'show'])->name('projects.show');
    Route::get('/projects/{project}/edit', [ProjectController::class, 'edit'])->name('projects.edit');
    Route::patch('/projects/{project}', [ProjectController::class, 'update'])->name('projects.update');

    // チーム関連
    Route::get('/teams/create', [TeamController::class, 'create'])->name('teams.create');
    Route::get('/teams/{team}', [TeamController::class, 'show'])->name('teams.show');

    // ユーザー詳細
    Route::get('/users/{user}', [UserController::class, 'show'])->name('users.show');

    // 統計画面
    Route::get('/statistics', [StatisticsController::class, 'index'])->name('statistics');
});

// 認証関連
Route::get('/register', function () {
    return Inertia::render('Auth/Register');
})->name('register');

Route::get('/login', function () {
    return Inertia::render('Auth/Login');
})->name('login');

// 認証が必要なルート（プロフィール編集など）
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__ . '/auth.php';
