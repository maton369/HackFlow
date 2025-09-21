<?php

namespace Database\Factories;

use App\Models\TechStack;
use Illuminate\Database\Eloquent\Factories\Factory;

class TechStackFactory extends Factory
{
    protected $model = TechStack::class;

    public function definition(): array
    {
        $techStacks = [
            ['name' => 'Laravel', 'color' => '#FF2D20'],
            ['name' => 'React', 'color' => '#61DAFB'],
            ['name' => 'Vue.js', 'color' => '#4FC08D'],
            ['name' => 'PHP', 'color' => '#777BB4'],
            ['name' => 'JavaScript', 'color' => '#F7DF1E'],
            ['name' => 'TypeScript', 'color' => '#3178C6'],
            ['name' => 'Python', 'color' => '#3776AB'],
            ['name' => 'Node.js', 'color' => '#339933'],
            ['name' => 'MySQL', 'color' => '#4479A1'],
            ['name' => 'PostgreSQL', 'color' => '#336791'],
        ];

        $tech = $this->faker->randomElement($techStacks);

        return [
            'name' => $tech['name'] . '-' . $this->faker->randomNumber(3),
        ];
    }

    public function laravel(): static
    {
        return $this->state(fn (array $attributes) => [
            'name' => 'Laravel',
        ]);
    }

    public function react(): static
    {
        return $this->state(fn (array $attributes) => [
            'name' => 'React',
        ]);
    }

    public function vue(): static
    {
        return $this->state(fn (array $attributes) => [
            'name' => 'Vue.js',
        ]);
    }
}