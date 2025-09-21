<?php

namespace Tests\Feature;

use App\Models\Team;
use App\Models\TeamMember;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TeamControllerTest extends TestCase
{
    use RefreshDatabase;

    protected $user;

    protected function setUp(): void
    {
        parent::setUp();

        $this->user = User::factory()->create();
    }

    public function test_team_show_page_can_be_accessed()
    {
        $team = Team::factory()->create();

        $response = $this->get(route('teams.show', $team));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('Teams/Show')
            ->has('team')
        );
    }

    public function test_team_create_page_requires_authentication()
    {
        $response = $this->get(route('teams.create'));

        $response->assertRedirect(route('login'));
    }

    public function test_authenticated_user_can_access_team_create_page()
    {
        $response = $this->actingAs($this->user)->get(route('teams.create'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('Teams/Create')
        );
    }

    public function test_user_can_create_team()
    {
        $teamData = [
            'team_name' => 'New Test Team',
            'team_image_url' => 'https://example.com/team.jpg',
        ];

        $response = $this->actingAs($this->user)
            ->post(route('teams.store'), $teamData);

        $response->assertRedirect();
        $this->assertDatabaseHas('teams', [
            'team_name' => 'New Test Team',
        ]);

        // チーム作成者がオーナーになることを確認
        $team = Team::where('team_name', 'New Test Team')->first();
        $this->assertDatabaseHas('team_members', [
            'user_id' => $this->user->id,
            'team_id' => $team->id,
            'role' => 'owner',
        ]);
    }

    public function test_team_edit_page_requires_authentication()
    {
        $team = Team::factory()->create();

        $response = $this->get(route('teams.edit', $team));

        $response->assertRedirect(route('login'));
    }

    public function test_team_owner_can_edit_team()
    {
        $team = Team::factory()->create();

        // ユーザーをチームのオーナーにする
        TeamMember::create([
            'user_id' => $this->user->id,
            'team_id' => $team->id,
            'role' => 'owner',
        ]);

        $response = $this->actingAs($this->user)
            ->get(route('teams.edit', $team));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('Teams/Edit')
        );
    }

    public function test_non_owner_cannot_edit_team()
    {
        $team = Team::factory()->create();
        $owner = User::factory()->create();

        // 別のユーザーをオーナーにする
        TeamMember::create([
            'user_id' => $owner->id,
            'team_id' => $team->id,
            'role' => 'owner',
        ]);

        $response = $this->actingAs($this->user)
            ->get(route('teams.edit', $team));

        // TeamControllerはリダイレクトを返す
        $response->assertRedirect(route('teams.show', $team->id));
    }

    public function test_owner_can_update_team()
    {
        $team = Team::factory()->create();

        TeamMember::create([
            'user_id' => $this->user->id,
            'team_id' => $team->id,
            'role' => 'owner',
        ]);

        $updateData = [
            'team_name' => 'Updated Team Name',
            'members' => [$this->user->id], // メンバー配列を追加
        ];

        $response = $this->actingAs($this->user)
            ->patch(route('teams.update', $team), $updateData);

        $response->assertRedirect();
        $this->assertDatabaseHas('teams', [
            'id' => $team->id,
            'team_name' => 'Updated Team Name',
        ]);
    }

    public function test_owner_can_delete_team()
    {
        $team = Team::factory()->create();

        TeamMember::create([
            'user_id' => $this->user->id,
            'team_id' => $team->id,
            'role' => 'owner',
        ]);

        $response = $this->actingAs($this->user)
            ->delete(route('teams.destroy', $team));

        $response->assertRedirect();
        $this->assertDatabaseMissing('teams', ['id' => $team->id]);
    }

    public function test_team_creation_requires_team_name()
    {
        $response = $this->actingAs($this->user)
            ->post(route('teams.store'), []);

        $response->assertSessionHasErrors(['team_name']);
    }

    public function test_team_name_must_be_unique()
    {
        Team::factory()->create(['team_name' => 'Existing Team']);

        $response = $this->actingAs($this->user)
            ->post(route('teams.store'), [
                'team_name' => 'Existing Team',
            ]);

        $response->assertSessionHasErrors(['team_name']);
    }
}
