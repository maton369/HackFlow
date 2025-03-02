<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Project;
use App\Models\TeamMember;

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

    public function show(Project $project)
    {
        $project->load('team.members.user', 'techStacks', 'tags', 'projectSteps');

        return Inertia::render('Projects/Show', [
            'project' => $project
        ]);
    }

    public function edit(Project $project)
    {
        $user = auth()->user();

        // そのプロジェクトのメンバーでない場合は 403 エラー
        $isMember = TeamMember::where('team_id', $project->team_id)
            ->where('user_id', $user->id)
            ->exists();

        if (!$isMember) {
            abort(403, 'このプロジェクトを編集する権限がありません。');
        }

        $project->load('team', 'techStacks', 'tags', 'projectSteps');

        return Inertia::render('Projects/Edit', ['project' => $project]);
    }

    public function update(Request $request, Project $project)
    {
        $user = auth()->user();

        // そのプロジェクトのメンバーでない場合は 403 エラー
        $isMember = TeamMember::where('team_id', $project->team_id)
            ->where('user_id', $user->id)
            ->exists();

        if (!$isMember) {
            abort(403, 'このプロジェクトを編集する権限がありません。');
        }

        // バリデーション
        $validated = $request->validate([
            'project_name' => 'required|string|max:255',
            'app_name' => 'nullable|string|max:255',
            'github_url' => 'nullable|url|max:255',
            'live_url' => 'nullable|url|max:255',
            'tech_stacks' => 'array',
            'tags' => 'array',
            'project_steps' => 'array',
        ]);

        // プロジェクトの基本情報を更新
        $project->update($validated);

        // 🔹 `tech_stacks` を処理（新規追加対応）
        $techStackIds = collect($request->input('tech_stacks', []))->map(function ($stack) {
            if (empty($stack['id'])) {
                $newStack = \App\Models\TechStack::firstOrCreate(['name' => $stack['name']]);
                return $newStack->id;
            }
            return $stack['id'];
        })->filter()->all(); // 🔥 空の ID は削除

        // 🔹 `tags` を処理（新規追加対応）
        $tagIds = collect($request->input('tags', []))->map(function ($tag) {
            if (empty($tag['id'])) {
                $newTag = \App\Models\Tag::firstOrCreate(['name' => $tag['name']]);
                return $newTag->id;
            }
            return $tag['id'];
        })->filter()->all(); // 🔥 空の ID は削除

        // 🔹 `sync()` でリレーション更新
        $project->techStacks()->sync($techStackIds);
        $project->tags()->sync($tagIds);

        // 🔹 `HasMany` の `project_steps` を手動更新
        $project->projectSteps()->delete(); // 既存データ削除
        $project->projectSteps()->createMany($request->input('project_steps', [])); // 新しく作成

        return redirect()->route('projects.show', $project->id)
            ->with('success', 'プロジェクト情報を更新しました。');
    }
}
