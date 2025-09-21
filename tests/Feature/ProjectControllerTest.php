<?php

namespace Tests\Feature;

use App\Models\Project;
use App\Models\Team;
use App\Models\TeamMember;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProjectControllerTest extends TestCase
{
    use RefreshDatabase;

    protected $user;

    protected $team;

    protected function setUp(): void
    {
        parent::setUp();

        $this->user = User::factory()->create();
        $this->team = Team::factory()->create();

        // ユーザーをチームのオーナーにする
        TeamMember::create([
            'user_id' => $this->user->id,
            'team_id' => $this->team->id,
            'role' => 'owner',
        ]);
    }

    public function test_project_show_page_can_be_accessed()
    {
        $project = Project::factory()->create(['team_id' => $this->team->id]);

        $response = $this->get(route('projects.show', $project));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('Projects/Show')
            ->has('project')
        );
    }

    public function test_project_create_page_requires_authentication()
    {
        $response = $this->get(route('projects.create'));

        $response->assertRedirect(route('login'));
    }

    public function test_authenticated_user_can_access_project_create_page()
    {
        $response = $this->actingAs($this->user)->get(route('projects.create'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('Projects/Create')
        );
    }

    public function test_user_can_create_project()
    {
        $projectData = [
            'project_name' => 'New Test Project',
            'app_name' => 'New Test App',
            'github_url' => 'https://github.com/test/repo',
            'team_id' => $this->team->id,
        ];

        $response = $this->actingAs($this->user)
            ->post(route('projects.store'), $projectData);

        $response->assertRedirect();
        $this->assertDatabaseHas('projects', [
            'project_name' => 'New Test Project',
            'app_name' => 'New Test App',
            'team_id' => $this->team->id,
        ]);
    }

    public function test_project_edit_page_requires_authentication()
    {
        $project = Project::factory()->create(['team_id' => $this->team->id]);

        $response = $this->get(route('projects.edit', $project));

        $response->assertRedirect(route('login'));
    }

    public function test_team_owner_can_edit_project()
    {
        $project = Project::factory()->create(['team_id' => $this->team->id]);

        $response = $this->actingAs($this->user)
            ->get(route('projects.edit', $project));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('Projects/Edit')
        );
    }

    public function test_user_can_update_project()
    {
        $project = Project::factory()->create(['team_id' => $this->team->id]);

        $updateData = [
            'project_name' => 'Updated Project Name',
            'app_name' => 'Updated App Name',
            'github_url' => 'https://github.com/updated/repo',
            'tech_stacks' => [],
            'tags' => [],
        ];

        $response = $this->actingAs($this->user)
            ->patch(route('projects.update', $project), $updateData);

        $response->assertRedirect();
        $this->assertDatabaseHas('projects', [
            'id' => $project->id,
            'project_name' => 'Updated Project Name',
            'app_name' => 'Updated App Name',
        ]);
    }

    public function test_user_can_delete_project()
    {
        $project = Project::factory()->create([
            'team_id' => $this->team->id,
            'project_image_url' => null, // 画像URLなしでテスト
        ]);

        $response = $this->actingAs($this->user)
            ->delete(route('projects.destroy', $project));

        $response->assertRedirect();
        $this->assertDatabaseMissing('projects', ['id' => $project->id]);
    }

    public function test_project_creation_requires_valid_data()
    {
        $response = $this->actingAs($this->user)
            ->post(route('projects.store'), []);

        $response->assertSessionHasErrors(['project_name', 'team_id']);
    }
}
