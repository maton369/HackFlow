<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Team;

class TeamController extends Controller
{
    public function create()
    {
        return Inertia::render('Teams/Create');
    }

    public function show($id)
    {
        $team = Team::with('members.user', 'projects')->findOrFail($id);
        return Inertia::render('Teams/Show', ['team' => $team]);
    }
}
