<?php

namespace Database\Seeders;

use App\Models\TechStack;
use Illuminate\Database\Seeder;

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
