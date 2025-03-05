<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use App\Models\Team;
use App\Models\TeamMember;
use App\Models\User;
use Inertia\Response;

class TeamController extends Controller
{
    /**
     * チーム作成フォームを表示
     */
    public function create(): Response
    {
        return Inertia::render('Teams/Create');
    }

    /**
     * チームを保存
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'team_name' => 'required|string|max:255|unique:teams,team_name',
            'team_image_url' => 'nullable|url|max:500',
            'members' => 'array',  // メンバーリスト
            'members.*' => 'exists:users,id'  // 有効なユーザーID
        ]);

        $team = Team::create([
            'team_name' => $validated['team_name'],
            'team_image_url' => $validated['team_image_url'] ?? '',
        ]);

        // 🔥 オーナー登録
        TeamMember::create([
            'team_id' => $team->id,
            'user_id' => Auth::id(),
            'role' => 'owner',
        ]);

        // 🔥 選択したメンバーを追加
        foreach ($validated['members'] as $userId) {
            TeamMember::create([
                'team_id' => $team->id,
                'user_id' => $userId,
                'role' => 'member',
            ]);
        }

        return Redirect::route('teams.show', $team->id)->with('success', 'チームが作成されました！');
    }

    /**
     * チーム詳細を表示
     */
    public function show($id)
    {
        $team = Team::with([
            'members.user',
            'projects' => function ($query) {
                $query->withCount('likes'); // ✅ いいね数を取得
            }
        ])->findOrFail($id);

        return Inertia::render('Teams/Show', ['team' => $team]);
    }


    /**
     * チーム編集フォームを表示
     */
    public function edit($id)
    {
        $team = Team::with('members.user')->findOrFail($id);

        // 🔥 チームのオーナーを取得
        $owner = $team->members()->where('role', 'owner')->first();

        // オーナーのみ編集可能
        if ($owner->user_id !== Auth::id()) {
            return Redirect::route('teams.show', $team->id)->with('error', '編集権限がありません。');
        }

        return Inertia::render('Teams/Edit', ['team' => $team]);
    }

    /**
     * チーム情報を更新
     */
    public function update(Request $request, $id)
    {
        $team = Team::findOrFail($id);

        // 🔥 チームのオーナーを取得
        $owner = $team->members()->where('role', 'owner')->first();

        // オーナーのみ更新可能
        if ($owner->user_id !== Auth::id()) {
            return Redirect::route('teams.show', $team->id)->with('error', '更新権限がありません。');
        }

        $validated = $request->validate([
            'team_name' => 'required|string|max:255|unique:teams,team_name,' . $team->id,
            'team_image_url' => 'nullable|url|max:500',
            'members' => 'array',
            'members.*' => 'exists:users,id',
        ]);

        $team->update([
            'team_name' => $validated['team_name'],
            'team_image_url' => $validated['team_image_url'] ?? '',
        ]);

        // メンバー更新
        TeamMember::where('team_id', $team->id)->delete();

        foreach ($validated['members'] as $userId) {
            $role = ($userId == Auth::id()) ? 'owner' : 'member';
            TeamMember::create([
                'team_id' => $team->id,
                'user_id' => $userId,
                'role' => $role
            ]);
        }

        return Redirect::route('teams.show', $team->id)->with('success', 'チームが更新されました！');
    }

    public function destroy($id)
    {
        $team = Team::with('members')->findOrFail($id);

        if (!$team) {
            return redirect()->route('home')->with('success', 'チームが削除されました。');
        };

        // 🔥 現在のユーザーがリーダーかチェック
        $isLeader = $team->members->where('user_id', auth()->id())->where('role', 'owner')->count() > 0;

        if (!$isLeader) {
            return redirect()->route('teams.show', $team->id)->with('error', 'チームを削除できるのはリーダーのみです。');
        }

        DB::transaction(function () use ($team) {
            // 🔥 関連するプロジェクトを削除
            $team->projects()->delete();

            // 🔥 チームメンバーを削除
            TeamMember::where('team_id', $team->id)->delete();

            // 🔥 チームを削除
            $team->delete();
        });

        return redirect()->route('home')->with('success', 'チームが削除されました。');
    }
}
