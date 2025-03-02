<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration {
    public function up()
    {
        Schema::create('user_urls', function (Blueprint $table) {
            $table->id(); // 主キー
            $table->foreignId('user_id')
                ->constrained('users')
                ->onDelete('cascade') // ユーザー削除時に関連データも削除
                ->comment('ユーザーID');
            $table->string('url', 255)->comment('登録URL');
            $table->string('url_type', 50)->comment('URLの種類（GitHub, Portfolio, LinkedIn, Twitter, Other）');
            $table->timestamp('added_at')->default(DB::raw('CURRENT_TIMESTAMP'))->comment('登録日時');
        });
    }

    public function down()
    {
        Schema::dropIfExists('user_urls');
    }
};
