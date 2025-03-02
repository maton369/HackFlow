<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Tag;

class TagsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $tags = ['AI', 'Web Development', 'Mobile App', 'Blockchain'];

        foreach ($tags as $tag) {
            Tag::firstOrCreate(['name' => $tag]);
        }
    }
}
