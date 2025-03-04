<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\DB;
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

        // 🔥 ユーザー情報の更新
        $user->fill([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'bio' => $validated['bio'] ?? '',
            'tech_level' => $validated['tech_level'] ?? '',
            'profile_image_url' => $validated['profile_image_url'] ?? '',
        ]);

        // 🔥 パスワードの更新（空白の場合は無視）
        if (!empty($validated['password'])) {
            $user->password = bcrypt($validated['password']);
        }

        // 🔥 メールアドレス変更時は認証解除
        if ($user->isDirty('email')) {
            $user->email_verified_at = null;
        }

        $user->save();

        // 🔥 技術スタックの更新
        if (isset($validated['tech_stacks'])) {
            $techStackIds = [];
            foreach ($validated['tech_stacks'] as $techName) {
                if (!empty($techName)) {
                    $techStack = TechStack::firstOrCreate(['name' => $techName]);
                    $techStackIds[] = $techStack->id;
                }
            }
            $user->techStacks()->sync($techStackIds);
        }

        // 🔥 関連URLの更新
        if (isset($validated['urls'])) {
            // 既存の関連URLを削除
            $user->urls()->delete();

            // 新しい関連URLを追加
            foreach ($validated['urls'] as $urlData) {
                if (!empty($urlData['url']) && !empty($urlData['url_type'])) {
                    UserUrl::create([
                        'user_id' => $user->id,
                        'url' => $urlData['url'],
                        'url_type' => $urlData['url_type'],
                    ]);
                }
            }
        }

        // 🔥 編集完了後にマイページへリダイレクト
        return Redirect::route('mypage')->with('success', 'プロフィールが更新されました！');
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
