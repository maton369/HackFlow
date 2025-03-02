<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class StatisticsController extends Controller
{
    public function index()
    {
        // 仮の統計データ
        $statistics = [
            'projects' => 10,
            'teams' => 5,
            'users' => 100,
        ];
        
        return Inertia::render('Statistics/Index', ['statistics' => $statistics]);
    }
}
