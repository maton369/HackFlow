<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UsersTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // リーダー作成
        User::firstOrCreate(
            ['email' => 'leader@example.com'],
            [
                'name' => 'Leader User',
                'password' => Hash::make('password'),
                'bio' => 'This is the leader of the team.',
                'tech_level' => 'advanced',
                'profile_image_url' => 'https://example.com/leader.jpg'
            ]
        );

        // メンバー作成
        User::firstOrCreate(
            ['email' => 'member@example.com'],
            [
                'name' => 'Member User',
                'password' => Hash::make('password'),
                'bio' => 'This is a member of the team.',
                'tech_level' => 'intermediate',
                'profile_image_url' => 'https://example.com/member.jpg'
            ]
        );
        
    }
}
