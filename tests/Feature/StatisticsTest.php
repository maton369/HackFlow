<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class StatisticsTest extends TestCase
{
    use RefreshDatabase;

    public function test_statistics_page_can_be_accessed()
    {
        $response = $this->get(route('statistics'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('Statistics/Index')
            ->has('techStackCounts')
        );
    }

    public function test_statistics_returns_tech_stack_usage_data()
    {
        $response = $this->get(route('statistics'));

        $response->assertStatus(200);

        // 統計データが配列として返されることを確認
        $techStackCounts = $response->original->getData()['page']['props']['techStackCounts'];
        $this->assertIsArray($techStackCounts);
    }

    public function test_statistics_handles_empty_data_gracefully()
    {
        // プロジェクトが存在しない場合
        $response = $this->get(route('statistics'));

        $response->assertStatus(200);
        $techStackCounts = $response->original->getData()['page']['props']['techStackCounts'];

        $this->assertIsArray($techStackCounts);
    }
}
