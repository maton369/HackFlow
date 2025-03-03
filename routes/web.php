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
        'projects' => Project::with('team')->get(),
        'teams' => Team::all(),
    ]);
})->name('home');

// ✅ プロジェクトとチームの詳細はログインなしでも見れる
Route::get('/projects/{project}', [ProjectController::class, 'show'])
    ->name('projects.show')->where(['project' => '[0-9]+']);

Route::get('/teams/{team}', [TeamController::class, 'show'])
    ->name('teams.show')->where(['team' => '[0-9]+']);

// ✅ ユーザー関連
Route::get('/users', [UserController::class, 'index'])->name('users.index');
Route::get('/users/{user}', [UserController::class, 'show'])->name('users.show')->where(['user' => '[0-9]+']);
Route::get('/users/search', [UserController::class, 'search'])->name('users.search');

// ✅ 統計画面
Route::get('/statistics', [StatisticsController::class, 'index'])->name('statistics');

// ✅ チーム関連ルート（認証必須）
Route::middleware(['auth'])->prefix('teams')->group(function () {
    Route::get('/create', [TeamController::class, 'create'])->name('teams.create');
    Route::post('/', [TeamController::class, 'store'])->name('teams.store');

    Route::get('/{team}', [TeamController::class, 'show'])->name('teams.show')->where(['team' => '[0-9]+']);
    Route::get('/{team}/edit', [TeamController::class, 'edit'])->name('teams.edit')->where(['team' => '[0-9]+']);
    Route::patch('/{team}', [TeamController::class, 'update'])->name('teams.update')->where(['team' => '[0-9]+']);
});

// ✅ プロジェクト関連ルート（認証必須）
Route::middleware(['auth'])->prefix('projects')->group(function () {
    Route::get('/create', [ProjectController::class, 'create'])->name('projects.create');
    Route::post('/', [ProjectController::class, 'store'])->name('projects.store');

    Route::get('/{project}/edit', [ProjectController::class, 'edit'])
        ->name('projects.edit')->where(['project' => '[0-9]+']);

    Route::patch('/{project}', [ProjectController::class, 'update'])
        ->name('projects.update')->where(['project' => '[0-9]+']);

    Route::delete('/{project}', [ProjectController::class, 'destroy'])
        ->name('projects.destroy')->where(['project' => '[0-9]+']);
});

// ✅ 認証が必要なルート
Route::middleware(['auth'])->group(function () {
    // ダッシュボード
    Route::get('/dashboard', function () {
        return Inertia::render('Dashboard');
    })->name('dashboard');

    // マイページ（チーム名を正しく取得する）
    Route::get('/mypage', function () {
        return Inertia::render('MyPage', [
            'user' => Auth::user()->load('techStacks', 'urls', 'teams:id,team_name'),
        ]);
    })->name('mypage');

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
