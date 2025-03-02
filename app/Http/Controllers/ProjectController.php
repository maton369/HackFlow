<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class ProjectController extends Controller
{
    public function create()
    {
        return Inertia::render('Projects/Create');
    }

    public function show($id)
    {
        // 仮のプロジェクトデータ
        $project = ['id' => $id, 'name' => "プロジェクト $id"];
        return Inertia::render('Projects/Show', ['project' => $project]);
    }
}
