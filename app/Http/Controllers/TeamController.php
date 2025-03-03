<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
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
            'owner_id' => Auth::id(),
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
        $team = Team::with('members.user', 'projects')->findOrFail($id);
        return Inertia::render('Teams/Show', ['team' => $team]);
    }

    /**
     * チーム編集フォームを表示
     */
    public function edit($id)
    {
        $team = Team::with('members.user')->findOrFail($id);

        // オーナーのみ編集可能
        if ($team->owner_id !== Auth::id()) {
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

        // 🔥 オーナーのみ更新可能
        if ($team->owner_id !== Auth::id()) {
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
            TeamMember::create(['team_id' => $team->id, 'user_id' => $userId, 'role' => 'member']);
        }

        return Redirect::route('teams.show', $team->id)->with('success', 'チームが更新されました！');
    }
}
