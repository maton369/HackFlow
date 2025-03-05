<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use App\Models\Project;
use App\Models\User;
use App\Models\Team;
use App\Models\TeamMember;
use App\Models\TechStack;
use App\Models\Tag;
use App\Models\ProjectStep;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use App\Models\TechStackStatistic;

class ProjectController extends Controller
{
    public function index()
    {
        $projects = Project::with(['team', 'techStacks', 'tags'])
            ->get()
            ->map(function ($project) {
                return [
                    'id' => $project->id,
                    'project_name' => $project->project_name,
                    'like_count' => $project->likes()->count(), // いいね数を取得
                    'team' => $project->team,
                    'techStacks' => $project->techStacks,
                    'tags' => $project->tags,
                ];
            });

        $teams = Team::select('id', 'team_name')->get();
        $users = User::select('id', 'name')->get();

        return Inertia::render('Home', [
            'projects' => $projects,
            'teams' => $teams,
            'users' => $users,
        ]);
    }


    public function create()
    {
        // 🔥 ユーザーが所属しているチームのみを取得
        $userTeams = Auth::user()->teams;
        $techStacks = TechStack::all();
        $tags = Tag::all();

        // 🔥 技術スタック統計データを更新（念のため最新にする）
        TechStackStatistic::updateStatistics();

        return Inertia::render('Projects/Create', [
            'teams' => $userTeams,
            'techStacks' => $techStacks,
            'tags' => $tags
        ]);
    }


    public function store(Request $request)
    {
        $validated = $request->validate([
            'project_name' => 'required|string|max:255',
            'app_name' => 'nullable|string|max:255',
            'project_image_url' => 'nullable|url|max:500',
            'github_url' => 'nullable|url|max:500',
            'live_url' => 'nullable|url|max:500',
            'team_id' => 'required|exists:teams,id',
            'tech_stack_ids' => 'array',
            'tag_ids' => 'array',
        ]);

        $project = Project::create([
            'project_name' => $validated['project_name'],
            'app_name' => $validated['app_name'] ?? '',
            'project_image_url' => $validated['project_image_url'] ?? '',
            'github_url' => $validated['github_url'] ?? '',
            'live_url' => $validated['live_url'] ?? '',
            'team_id' => $validated['team_id'],
            'like_count' => 0
        ]);

        // 🔥 `tech_stacks` & `tags` のリレーションを設定
        if (!empty($validated['tech_stack_ids'])) {
            $project->techStacks()->sync($validated['tech_stack_ids']);
        }

        if (!empty($validated['tag_ids'])) {
            $project->tags()->sync($validated['tag_ids']);
        }

        // 🔥 統計データを更新
        TechStackStatistic::updateStatistics();

        return Redirect::route('projects.show', $project->id)
            ->with('success', 'プロジェクトが作成されました！');
    }

    public function show(Project $project)
    {
        $project->load([
            'team:id,team_name',
            'team.users:id,name,email',
            'techStacks:id,name',
            'tags:id,name',
            'projectSteps:id,project_id,title,description',
        ]);

        return Inertia::render('Projects/Show', [
            'project' => $project->toArray() + ['like_count' => $project->likes()->count()]
        ]);
    }

    public function edit(Project $project)
    {
        $user = auth()->user();

        // 🔥 チームメンバーのみ編集可能
        $isMember = TeamMember::where('team_id', $project->team_id)
            ->where('user_id', $user->id)
            ->exists();

        if (!$isMember) {
            abort(403, 'このプロジェクトを編集する権限がありません。');
        }

        $project->load('team', 'techStacks', 'tags', 'projectSteps');

        return Inertia::render('Projects/Edit', [
            'project' => $project,
            'techStacks' => TechStack::all(),
            'tags' => Tag::all()
        ]);
    }

    public function update(Request $request, Project $project)
    {
        $user = auth()->user();

        // 🔥 チームメンバーのみ編集可能
        $isMember = TeamMember::where('team_id', $project->team_id)
            ->where('user_id', $user->id)
            ->exists();

        if (!$isMember) {
            abort(403, 'このプロジェクトを編集する権限がありません。');
        }

        $validated = $request->validate([
            'project_name' => 'required|string|max:255',
            'app_name' => 'nullable|string|max:255',
            'github_url' => 'nullable|url|max:500',
            'live_url' => 'nullable|url|max:500',
            'tech_stacks' => 'array',
            'tech_stacks.*.id' => 'nullable|integer|exists:tech_stacks,id',
            'tech_stacks.*.name' => 'nullable|string|max:255',
            'tags' => 'array',
            'tags.*.id' => 'nullable|integer|exists:tags,id',
            'tags.*.name' => 'nullable|string|max:255',
        ]);

        // 🔥 プロジェクト情報更新
        $project->update([
            'project_name' => $validated['project_name'],
            'app_name' => $validated['app_name'] ?? null,
            'github_url' => $validated['github_url'] ?? null,
            'live_url' => $validated['live_url'] ?? null,
        ]);

        // ✅ 技術スタックの処理（重複回避）
        $techStackIds = [];
        foreach ($validated['tech_stacks'] as $techStack) {
            if (!empty($techStack['id'])) {
                $techStackIds[] = $techStack['id'];
            } else {
                // 🔥 すでに存在する技術スタックを再利用
                $existingTechStack = \App\Models\TechStack::where('name', $techStack['name'])->first();
                if ($existingTechStack) {
                    $techStackIds[] = $existingTechStack->id;
                } else {
                    $newTechStack = \App\Models\TechStack::create(['name' => $techStack['name']]);
                    $techStackIds[] = $newTechStack->id;
                }
            }
        }
        $project->techStacks()->sync($techStackIds);

        // ✅ タグの処理（重複回避）
        $tagIds = [];
        foreach ($validated['tags'] as $tag) {
            if (!empty($tag['id'])) {
                $tagIds[] = $tag['id'];
            } else {
                // 🔥 すでに存在するタグを再利用
                $existingTag = \App\Models\Tag::where('name', $tag['name'])->first();
                if ($existingTag) {
                    $tagIds[] = $existingTag->id;
                } else {
                    $newTag = \App\Models\Tag::create(['name' => $tag['name']]);
                    $tagIds[] = $newTag->id;
                }
            }
        }
        $project->tags()->sync($tagIds);

        // 🔥 **技術スタック統計データを更新**
        TechStackStatistic::updateStatistics();

        return Redirect::route('projects.show', $project->fresh()->id)
            ->with('success', 'プロジェクト情報を更新しました！');
    }


    public function statistics()
    {
        $techStackCounts = TechStackStatistic::with('techStack')->get();

        return Inertia::render('Statistics/Index', [
            'techStackCounts' => $techStackCounts,
        ]);
    }


    public function destroy(Project $project)
    {
        // ✅ ユーザーがプロジェクトのリーダーか確認
        $isLeader = $project->team
            ->users()
            ->where('users.id', auth()->id())
            ->wherePivot('role', 'owner') // リーダー判定
            ->exists();

        if (!$isLeader) {
            return redirect()->route('projects.show', $project->id)
                ->with('error', 'プロジェクトを削除できるのはリーダーのみです。');
        }

        DB::transaction(function () use ($project) {
            // 🔥 関連データの削除
            $project->projectSteps()->delete(); // ✅ 正しいメソッド名を使用
            $project->techStacks()->detach(); // ✅ メソッド名を統一（camelCase）
            $project->tags()->detach();

            // 🔥 プロジェクトの削除
            $project->delete();

            // 🔥 統計データを更新
            TechStackStatistic::updateStatistics();
        });


        return redirect()->route('home')->with('success', 'プロジェクトが削除されました！');
    }
}
