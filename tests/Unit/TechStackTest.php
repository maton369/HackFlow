<?php

namespace Tests\Unit;

use App\Models\Project;
use App\Models\ProjectTechStack;
use App\Models\TechStack;
use App\Models\User;
use App\Models\UserTechStack;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TechStackTest extends TestCase
{
    use RefreshDatabase;

    public function test_tech_stack_belongs_to_many_projects()
    {
        $techStack = TechStack::factory()->create();
        $project1 = Project::factory()->create();
        $project2 = Project::factory()->create();

        ProjectTechStack::create([
            'project_id' => $project1->id,
            'tech_stack_id' => $techStack->id,
        ]);

        ProjectTechStack::create([
            'project_id' => $project2->id,
            'tech_stack_id' => $techStack->id,
        ]);

        $this->assertEquals(2, $techStack->projects()->count());
        $this->assertTrue($techStack->projects->contains($project1));
        $this->assertTrue($techStack->projects->contains($project2));
    }

    public function test_tech_stack_belongs_to_many_users()
    {
        $techStack = TechStack::factory()->create();
        $user1 = User::factory()->create();
        $user2 = User::factory()->create();

        UserTechStack::create([
            'user_id' => $user1->id,
            'tech_stack_id' => $techStack->id,
        ]);

        UserTechStack::create([
            'user_id' => $user2->id,
            'tech_stack_id' => $techStack->id,
        ]);

        $this->assertEquals(2, $techStack->users()->count());
        $this->assertTrue($techStack->users->contains($user1));
        $this->assertTrue($techStack->users->contains($user2));
    }

    public function test_tech_stack_has_fillable_attributes()
    {
        $fillable = [
            'name',
        ];

        $techStack = new TechStack;

        $this->assertEquals($fillable, $techStack->getFillable());
    }

    public function test_tech_stack_can_be_created_with_name()
    {
        $techStackData = [
            'name' => 'Laravel',
        ];

        $techStack = TechStack::create($techStackData);

        $this->assertDatabaseHas('tech_stacks', $techStackData);
        $this->assertEquals('Laravel', $techStack->name);
    }

    public function test_tech_stack_name_should_be_unique()
    {
        TechStack::factory()->create(['name' => 'React']);

        $this->expectException(\Illuminate\Database\QueryException::class);
        TechStack::create(['name' => 'React']);
    }

    public function test_tech_stack_usage_count_in_projects()
    {
        $techStack = TechStack::factory()->create();
        $project1 = Project::factory()->create();
        $project2 = Project::factory()->create();
        $project3 = Project::factory()->create();

        // 3つのプロジェクトで使用
        ProjectTechStack::create([
            'project_id' => $project1->id,
            'tech_stack_id' => $techStack->id,
        ]);

        ProjectTechStack::create([
            'project_id' => $project2->id,
            'tech_stack_id' => $techStack->id,
        ]);

        ProjectTechStack::create([
            'project_id' => $project3->id,
            'tech_stack_id' => $techStack->id,
        ]);

        $usageCount = $techStack->projects()->count();
        $this->assertEquals(3, $usageCount);
    }
}
