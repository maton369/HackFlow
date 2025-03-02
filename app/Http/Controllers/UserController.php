<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\User;

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
}
