<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    public function show(User $user)
    {
        $user->load([
            'urls' => function ($query) {
                $query->select('id', 'user_id', 'url', 'url_type');
            },
            'teams' => function ($query) {
                $query->select('teams.id', 'teams.team_name as name'); // ✅ `team_name` を `name` にエイリアス化
            },

            'techStacks' => function ($query) {
                $query->select('tech_stacks.id', 'tech_stacks.name');
            },
        ]);

        return Inertia::render('Users/Show', ['user' => $user]);
    }

    public function search(Request $request)
    {
        $query = $request->query('query');
        $users = User::where('name', 'like', "%{$query}%")
            ->where('id', '!=', Auth::id())
            ->get();

        return response()->json(['users' => $users]);
    }

    public function mypage()
    {
        $user = Auth::user()->load([
            'techStacks',
            'urls',
            'teams',
            'projects:id,project_name,team_id' // ✅ 明示的に `project_name` を取得
        ]);

        return Inertia::render('MyPage', [
            'auth' => ['user' => $user]
        ]);
    }
}
