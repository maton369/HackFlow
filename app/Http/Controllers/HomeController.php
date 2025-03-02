<?php

namespace App\Http\Controllers;

use App\Models\Project;
use Inertia\Inertia;

class HomeController extends Controller
{
    public function index()
    {
        $projects = Project::with('team')->latest()->get();

        return Inertia::render('Home', [
            'auth' => ['user' => auth()->user()],
            'projects' => $projects,
        ]);
    }
}
