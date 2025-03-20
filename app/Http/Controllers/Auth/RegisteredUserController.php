<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Providers\RouteServiceProvider;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;
use CloudinaryLabs\CloudinaryLaravel\Facades\Cloudinary; // Cloudinary を追加

class RegisteredUserController extends Controller
{
    /**
     * Display the registration view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Register');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:users',
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'bio' => ['nullable', 'string', 'max:500'],
            'tech_level' => ['nullable', 'in:beginner,intermediate,advanced'],
            'profile_image' => ['nullable', 'image', 'max:2048'], // 🔥 修正: 画像のバリデーションを追加
        ]);

        // 画像アップロード処理
        $imageUrl = null;
        if ($request->hasFile('profile_image')) {
            $imageUrl = Cloudinary::upload($request->file('profile_image')->getRealPath())->getSecurePath();
        }

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'bio' => $validated['bio'] ?? null,
            'tech_level' => $validated['tech_level'] ?? null,
            'profile_image_url' => $imageUrl, // 🔥 Cloudinary でアップロードした画像URLを保存
        ]);

        event(new Registered($user));

        Auth::login($user);

        return redirect()->route('mypage'); // 🔥 登録後にマイページへリダイレクト
    }
}
