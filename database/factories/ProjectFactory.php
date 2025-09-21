<?php

namespace Database\Factories;

use App\Models\Project;
use App\Models\Team;
use Illuminate\Database\Eloquent\Factories\Factory;

class ProjectFactory extends Factory
{
    protected $model = Project::class;

    public function definition(): array
    {
        return [
            'project_name' => $this->faker->words(3, true),
            'app_name' => $this->faker->words(2, true),
            'project_image_url' => $this->faker->imageUrl(600, 400, 'projects'),
            'github_url' => $this->faker->url(),
            'live_url' => $this->faker->url(),
            'team_id' => Team::factory(),
            'like_count' => 0,
        ];
    }

    public function withTeam(Team $team): static
    {
        return $this->state(fn (array $attributes) => [
            'team_id' => $team->id,
        ]);
    }
}
