<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\TechStack;
use App\Models\UserUrl;

class UserTechStackAndUrlSeeder extends Seeder
{
    public function run()
    {
        // ✅ ユーザーを取得 or 作成
        $leader = User::firstOrCreate(
            ['email' => 'leader@example.com'],
            [
                'name' => 'Leader User',
                'password' => Hash::make('password'),
                'bio' => 'This is the leader of the team.',
                'tech_level' => 'advanced',
                'profile_image_url' => 'https://example.com/leader.jpg'
            ]
        );

        $member = User::firstOrCreate(
            ['email' => 'member@example.com'],
            [
                'name' => 'Member User',
                'password' => Hash::make('password'),
                'bio' => 'This is a member of the team.',
                'tech_level' => 'intermediate',
                'profile_image_url' => 'https://example.com/member.jpg'
            ]
        );

        // ✅ 技術スタックを取得 or 作成
        $laravel = TechStack::firstOrCreate(['name' => 'Laravel']);
        $react = TechStack::firstOrCreate(['name' => 'React']);
        $vue = TechStack::firstOrCreate(['name' => 'Vue.js']);

        // ✅ ユーザーと技術スタックを関連付け
        $leader->techStacks()->sync([$laravel->id, $react->id]);
        $member->techStacks()->sync([$vue->id]);

        // ✅ 関連URLを追加（timestamps 無効化）
        UserUrl::withoutEvents(function () use ($leader, $member) {
            UserUrl::create([
                'user_id' => $leader->id,
                'url' => 'https://github.com/leader',
                'url_type' => 'GitHub'
            ]);

            UserUrl::create([
                'user_id' => $leader->id,
                'url' => 'https://leader.dev',
                'url_type' => 'Portfolio'
            ]);

            UserUrl::create([
                'user_id' => $member->id,
                'url' => 'https://github.com/member',
                'url_type' => 'GitHub'
            ]);

            UserUrl::create([
                'user_id' => $member->id,
                'url' => 'https://member.dev',
                'url_type' => 'Portfolio'
            ]);
        });

        $this->command->info('✅ ユーザーの技術スタック & 関連URL を追加しました！（timestamps 無効化済み）');
    }
}
