<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\TechStack;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Mockery;
use Tests\TestCase;
use CloudinaryLabs\CloudinaryLaravel\Facades\Cloudinary;

class ProfileUpdateTest extends TestCase
{
    use RefreshDatabase;

    public function setUp(): void
    {
        parent::setUp();

        // Cloudinaryをモック
        Cloudinary::shouldReceive('upload')
            ->andReturn((object)[
                'getSecurePath' => 'https://cloudinary.com/fake-image.jpg',
                'getPublicId' => 'fake-public-id',
            ]);

        Cloudinary::shouldReceive('destroy')->andReturn(true);
    }

    public function test_user_can_update_profile_with_image_tech_stacks_and_urls()
    {
        Storage::fake('avatars');

        $user = User::factory()->create();
        $this->actingAs($user);

        $file = UploadedFile::fake()->image('avatar.jpg');

        $response = $this->post(route('profile.update'), [
            'name' => '新しい名前',
            'email' => 'new@example.com',
            'bio' => '自己紹介文',
            'tech_level' => 'intermediate',
            'profile_image' => $file,
            'tech_stacks' => ['Laravel', 'Vue.js'],
            'urls' => [
                ['url' => 'https://github.com/example', 'url_type' => 'GitHub'],
                ['url' => 'https://portfolio.com/me', 'url_type' => 'Portfolio'],
            ],
        ]);

        $response->assertRedirect(route('mypage'));

        $this->assertDatabaseHas('users', [
            'id' => $user->id,
            'name' => '新しい名前',
            'email' => 'new@example.com',
            'bio' => '自己紹介文',
            'tech_level' => 'intermediate',
            'profile_image_url' => 'https://cloudinary.com/fake-image.jpg',
        ]);

        $this->assertDatabaseHas('tech_stacks', ['name' => 'Laravel']);
        $this->assertDatabaseHas('tech_stacks', ['name' => 'Vue.js']);

        $this->assertDatabaseHas('user_urls', [
            'user_id' => $user->id,
            'url' => 'https://github.com/example',
            'url_type' => 'GitHub',
        ]);
    }
}
