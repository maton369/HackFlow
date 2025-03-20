<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use CloudinaryLabs\CloudinaryLaravel\Facades\Cloudinary;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\User;
use App\Models\TechStack;
use App\Models\UserUrl;
use App\Models\Team;
use App\Models\Project;
use App\Models\TeamMember;


class ProfileController extends Controller
{

    public function show(Request $request)
    {
        $user = User::with(['techStacks', 'urls'])->find($request->user()->id);

        return Inertia::render('MyPage', [
            'user' => $user,
        ]);
    }

    public function edit(Request $request): Response
    {
        $user = User::with(['techStacks', 'urls'])->find($request->user()->id);

        return Inertia::render('Profile/Edit', [
            'user' => $user,
        ]);
    }

    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $user = $request->user();
        $validated = $request->validated();

        // 🔥 デバッグ用ログ
        Log::info("📷 プロフィール画像の更新リクエスト", [
            'hasFile' => $request->hasFile('profile_image'),
            'file_info' => $request->file('profile_image') ? $request->file('profile_image')->getClientOriginalName() : null
        ]);

        // 🔥 画像がアップロードされた場合のみ Cloudinary にアップロード
        if ($request->hasFile('profile_image')) {
            try {
                // 既存の画像を削除（必要なら）
                if ($user->profile_image_url) {
                    Log::info("🔥 既存の画像を削除: " . $user->profile_image_url);
                    Cloudinary::destroy($user->profile_image_url);
                }

                // Cloudinary に画像をアップロード
                $uploadResponse = Cloudinary::upload($request->file('profile_image')->getRealPath());

                // デバッグ用: Cloudinary のレスポンスを確認
                Log::info("✅ Cloudinary アップロード成功", [
                    'secure_url' => $uploadResponse->getSecurePath(),
                    'public_id' => $uploadResponse->getPublicId()
                ]);

                // URL を取得してプロパティに設定
                $validated['profile_image_url'] = $uploadResponse->getSecurePath();
            } catch (\Exception $e) {
                Log::error("❌ Cloudinary アップロードエラー", ['error' => $e->getMessage()]);
                return Redirect::route('profile.edit')->with('error', '画像のアップロードに失敗しました。');
            }
        }

        // 🔥 ユーザー情報の更新
        $user->fill([
            'name' => $validated['name'] ?? $user->name,
            'email' => $validated['email'] ?? $user->email,
            'bio' => array_key_exists('bio', $validated) ? $validated['bio'] : $user->bio,
            'tech_level' => array_key_exists('tech_level', $validated) ? $validated['tech_level'] : $user->tech_level,
            'profile_image_url' => $validated['profile_image_url'] ?? $user->profile_image_url, // 🔥 画像URLを更新
        ]);

        $user->save();

        return Redirect::route('mypage')->with('success', '✅ プロフィールが更新されました！');
    }
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        DB::transaction(function () use ($user) {
            // 🔥 1. ユーザーがオーナーのチームを処理
            $teamsOwnedByUser = Team::whereHas('members', function ($query) use ($user) {
                $query->where('user_id', $user->id)->where('role', 'owner');
            })->get();

            foreach ($teamsOwnedByUser as $team) {
                $teamMembers = $team->members()->where('user_id', '!=', $user->id)->get();

                if ($teamMembers->count() > 0) {
                    // ✅ 他のメンバーがいれば、新しいオーナーを設定
                    $newOwner = $teamMembers->first();
                    $newOwner->update(['role' => 'owner']);
                } else {
                    // ❌ 他のメンバーがいなければ、チームと関連プロジェクトを削除
                    $team->projects()->delete();
                    $team->delete();
                }
            }

            // 🔥 2. ユーザーがメンバーとして所属するチームの削除
            TeamMember::where('user_id', $user->id)->delete();

            // 🔥 3. プロジェクトのリーダーの処理
            $projectsLedByUser = Project::whereHas('team.members', function ($query) use ($user) {
                $query->where('user_id', $user->id)->where('role', 'owner');
            })->get();

            foreach ($projectsLedByUser as $project) {
                $teamMembers = $project->team->members()->where('user_id', '!=', $user->id)->get();

                if ($teamMembers->count() > 0) {
                    // ✅ 他のメンバーがいれば、新しいオーナーを設定
                    $newOwner = $teamMembers->first();
                    TeamMember::where('team_id', $project->team_id)->where('user_id', $newOwner->user_id)
                        ->update(['role' => 'owner']);
                } else {
                    // ❌ チームが削除された場合、プロジェクトも削除
                    $project->delete();
                }
            }

            // 🔥 4. ユーザー削除
            $user->delete();
        });

        // セッションを無効化し、ログアウト
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/')->with('success', 'アカウントが削除されました。');
    }




    public function mypage(Request $request): Response
    {
        $user = $request->user()->load('techStacks', 'urls', 'teams');

        return Inertia::render('MyPage', [
            'auth' => [
                'user' => $user,
            ],
        ]);
    }
}
