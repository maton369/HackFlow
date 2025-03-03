<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\TeamController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\StatisticsController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Models\Project;
use App\Models\Team;
use App\Http\Controllers\Auth\RegisteredUserController;
use Illuminate\Support\Facades\Auth;

// ✅ ホーム画面（ログイン不要）
Route::get('/', function () {
    return Inertia::render('Home', [
        'projects' => Project::all(),
        'teams' => Team::all(),
    ]);
})->name('home');

// ✅ プロジェクトとチームの詳細はログインなしでも見れる
Route::get('/projects/{project}', [ProjectController::class, 'show'])->name('projects.show');
Route::get('/teams/{team}', [TeamController::class, 'show'])->name('teams.show');

// ✅ ユーザー関連
Route::get('/users', [UserController::class, 'index'])->name('users.index');
Route::get('/users/{user}', [UserController::class, 'show'])->name('users.show');

// ✅ 統計画面
Route::get('/statistics', [StatisticsController::class, 'index'])->name('statistics');

// ✅ 認証が必要なルート
Route::middleware(['auth'])->group(function () {
    // ダッシュボード
    Route::get('/dashboard', function () {
        return Inertia::render('Dashboard');
    })->name('dashboard');

    // マイページ
    Route::get('/mypage', function () {
        return Inertia::render('MyPage', [
            'user' => Auth::user()->load('techStacks', 'urls'),
        ]);
    })->name('mypage');


    // ✅ プロジェクト関連
    Route::get('/projects', [ProjectController::class, 'index'])->name('projects.index');
    Route::get('/projects/create', [ProjectController::class, 'create'])->name('projects.create');
    Route::get('/projects/{project}/edit', [ProjectController::class, 'edit'])->name('projects.edit');
    Route::patch('/projects/{project}', [ProjectController::class, 'update'])->name('projects.update');

    // ✅ チーム関連
    Route::get('/teams/create', [TeamController::class, 'create'])->name('teams.create');

    // ✅ プロフィール関連
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// ✅ 認証関連
Route::get('/register', function () {
    return Inertia::render('Auth/Register');
})->name('register');

Route::post('/register', [RegisteredUserController::class, 'store'])->name('register');

Route::get('/login', function () {
    return Inertia::render('Auth/Login');
})->name('login');

require __DIR__ . '/auth.php';
