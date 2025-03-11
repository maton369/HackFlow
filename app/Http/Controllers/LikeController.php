<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Like;
use App\Models\Project;
use Illuminate\Support\Facades\Auth;

class LikeController extends Controller
{
    // いいねの切り替え
    public function toggleLike(Request $request, $projectId)
    {
        $user = Auth::user();
        $like = Like::where('user_id', $user->id)->where('project_id', $projectId)->first();

        if ($like) {
            // すでにいいねしていたら削除（いいね解除）
            $like->delete();
            return response()->json(['message' => 'Unliked', 'liked' => false]);
        } else {
            // いいねしていなければ新規作成
            Like::create([
                'user_id' => $user->id,
                'project_id' => $projectId,
            ]);
            return response()->json(['message' => 'Liked', 'liked' => true]);
        }
    }

    // プロジェクトのいいね数を取得
    public function getLikeCount($projectId)
    {
        $count = Like::where('project_id', $projectId)->count();
        return response()->json(['count' => $count]);
    }

    // ユーザーが特定のプロジェクトをいいねしているか判定
    public function isLikedByUser($projectId)
    {
        $user = Auth::user();
        $liked = Like::where('user_id', $user->id)->where('project_id', $projectId)->exists();
        return response()->json(['liked' => $liked]);
    }

    public function getUserLikes()
    {
        $user = Auth::user();
        if (!$user) {
            return response()->json(['likes' => []]); // 未ログインなら空配列を返す
        }

        $likes = Like::where('user_id', $user->id)->pluck('project_id'); // ユーザーがいいねしたプロジェクトIDを取得
        return response()->json(['likes' => $likes]);
    }
}
