<?php

namespace Tests;

use Illuminate\Foundation\Testing\TestCase as BaseTestCase;

abstract class TestCase extends BaseTestCase
{
    use CreatesApplication;

    protected function setUp(): void
    {
        parent::setUp();

        // CSRFミドルウェアを無効化（テスト環境）
        $this->withoutMiddleware(\App\Http\Middleware\VerifyCsrfToken::class);

        // Cloudinaryの設定をモック化（テスト環境）
        config(['cloudinary.cloud_name' => 'test']);
        config(['cloudinary.api_key' => 'test']);
        config(['cloudinary.api_secret' => 'test']);
    }
}
