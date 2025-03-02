<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class UserController extends Controller
{
    public function show($id)
    {
        // 仮のユーザーデータ
        $user = ['id' => $id, 'name' => "ユーザー $id"];
        return Inertia::render('Users/Show', ['user' => $user]);
    }
}
