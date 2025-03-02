<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\TechStack;

class TechStacksTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $stacks = ['Laravel', 'Vue.js', 'React', 'Node.js', 'Django', 'Ruby on Rails'];

        foreach ($stacks as $stack) {
            TechStack::firstOrCreate(['name' => $stack]);
        }
    }
}
