<?php

namespace Tests\Feature;

use App\Models\Like;
use App\Models\Project;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class LikeControllerTest extends TestCase
{
    use RefreshDatabase;

    protected $user;

    protected $project;

    protected function setUp(): void
    {
        parent::setUp();

        $this->user = User::factory()->create();
        $this->project = Project::factory()->create();
    }

    public function test_like_toggle_requires_authentication()
    {
        $response = $this->post(route('projects.like', $this->project));

        $response->assertRedirect(route('login'));
    }

    public function test_user_can_like_project()
    {
        $response = $this->actingAs($this->user)
            ->post(route('projects.like', $this->project));

        $response->assertStatus(200);
        $this->assertDatabaseHas('likes', [
            'user_id' => $this->user->id,
            'project_id' => $this->project->id,
        ]);

        $responseData = $response->json();
        $this->assertTrue($responseData['liked']);
    }

    public function test_user_can_unlike_project()
    {
        // 最初にいいねを作成
        Like::create([
            'user_id' => $this->user->id,
            'project_id' => $this->project->id,
        ]);

        $response = $this->actingAs($this->user)
            ->post(route('projects.like', $this->project));

        $response->assertStatus(200);
        $this->assertDatabaseMissing('likes', [
            'user_id' => $this->user->id,
            'project_id' => $this->project->id,
        ]);

        $responseData = $response->json();
        $this->assertFalse($responseData['liked']);
    }

    public function test_get_like_count_returns_correct_count()
    {
        $user2 = User::factory()->create();

        Like::create([
            'user_id' => $this->user->id,
            'project_id' => $this->project->id,
        ]);

        Like::create([
            'user_id' => $user2->id,
            'project_id' => $this->project->id,
        ]);

        $response = $this->get(route('projects.like-count', $this->project));

        $response->assertStatus(200);
        $responseData = $response->json();
        $this->assertEquals(2, $responseData['count']);
    }

    public function test_is_liked_by_user_requires_authentication()
    {
        $response = $this->get(route('projects.is-liked', $this->project));

        $response->assertRedirect(route('login'));
    }

    public function test_is_liked_by_user_returns_correct_status()
    {
        // いいねしていない状態
        $response = $this->actingAs($this->user)
            ->get(route('projects.is-liked', $this->project));

        $response->assertStatus(200);
        $responseData = $response->json();
        $this->assertFalse($responseData['liked']);

        // いいねした状態
        Like::create([
            'user_id' => $this->user->id,
            'project_id' => $this->project->id,
        ]);

        $response = $this->actingAs($this->user)
            ->get(route('projects.is-liked', $this->project));

        $response->assertStatus(200);
        $responseData = $response->json();
        $this->assertTrue($responseData['liked']);
    }

    public function test_get_user_likes_requires_authentication()
    {
        $response = $this->get(route('user.likes'));

        $response->assertRedirect(route('login'));
    }

    public function test_get_user_likes_returns_liked_projects()
    {
        $project2 = Project::factory()->create();

        Like::create([
            'user_id' => $this->user->id,
            'project_id' => $this->project->id,
        ]);

        Like::create([
            'user_id' => $this->user->id,
            'project_id' => $project2->id,
        ]);

        $response = $this->actingAs($this->user)
            ->get(route('user.likes'));

        $response->assertStatus(200);
        $responseData = $response->json();
        $this->assertCount(2, $responseData['likes']);
    }

    public function test_multiple_users_can_like_same_project()
    {
        $user2 = User::factory()->create();
        $user3 = User::factory()->create();

        // 複数ユーザーが同じプロジェクトにいいね
        $this->actingAs($this->user)
            ->post(route('projects.like', $this->project));

        $this->actingAs($user2)
            ->post(route('projects.like', $this->project));

        $this->actingAs($user3)
            ->post(route('projects.like', $this->project));

        $this->assertEquals(3, Like::where('project_id', $this->project->id)->count());

        $response = $this->get(route('projects.like-count', $this->project));
        $responseData = $response->json();
        $this->assertEquals(3, $responseData['count']);
    }
}
