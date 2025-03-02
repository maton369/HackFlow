<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Project;

class ProjectController extends Controller
{
    public function index()
    {
        $projects = Project::all();
        return Inertia::render('Home', ['projects' => $projects]);
    }

    public function create()
    {
        return Inertia::render('Projects/Create');
    }

    public function show($id)
    {
        $project = Project::with('team', 'techStacks', 'tags', 'projectSteps')->findOrFail($id);

        return Inertia::render('Projects/Show', [
            'project' => $project
        ]);
    }
}
