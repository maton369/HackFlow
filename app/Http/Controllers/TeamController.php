<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class TeamController extends Controller
{
    public function create()
    {
        return Inertia::render('Teams/Create');
    }

    public function show($id)
    {
        // 仮のチームデータ
        $team = ['id' => $id, 'name' => "チーム $id"];
        return Inertia::render('Teams/Show', ['team' => $team]);
    }
}
