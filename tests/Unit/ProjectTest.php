<?php

namespace Tests\Unit;

use App\Models\Project;
use App\Models\Team;
use App\Models\TechStack;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProjectTest extends TestCase
{
    use RefreshDatabase;

    public function test_project_belongs_to_team()
    {
        $team = Team::factory()->create();
        $project = Project::factory()->create(['team_id' => $team->id]);

        $this->assertInstanceOf(Team::class, $project->team);
        $this->assertEquals($team->id, $project->team->id);
    }

    public function test_project_has_many_tech_stacks()
    {
        $project = Project::factory()->create();
        $techStack = TechStack::factory()->create();

        $project->techStacks()->attach($techStack->id);

        $this->assertInstanceOf(\Illuminate\Database\Eloquent\Collection::class, $project->techStacks);
        $this->assertTrue($project->techStacks->contains($techStack));
    }

    public function test_project_has_many_likes()
    {
        $project = Project::factory()->create();
        $user = User::factory()->create();

        $project->likes()->create(['user_id' => $user->id]);

        $this->assertEquals(1, $project->likes()->count());
    }

    public function test_project_has_fillable_attributes()
    {
        $fillable = [
            'project_name',
            'app_name',
            'project_image_url',
            'github_url',
            'live_url',
            'team_id',
            'like_count',
        ];

        $project = new Project;

        $this->assertEquals($fillable, $project->getFillable());
    }

    public function test_project_can_be_created_with_required_fields()
    {
        $team = Team::factory()->create();

        $projectData = [
            'project_name' => 'Test Project',
            'app_name' => 'Test App',
            'team_id' => $team->id,
        ];

        $project = Project::create($projectData);

        $this->assertDatabaseHas('projects', $projectData);
        $this->assertEquals('Test Project', $project->project_name);
        $this->assertEquals('Test App', $project->app_name);
    }
}
