<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('tech_stack_statistics', function (Blueprint $table) {
            $table->id();
            $table->integer('total_projects')->default(0)->comment('全プロジェクト数');
            $table->foreignId('tech_stack_id')->constrained('tech_stacks')->onDelete('cascade')->comment('技術スタックID');
            $table->integer('usage_count')->default(0)->comment('この技術スタックが使用されているプロジェクト数');
            $table->float('usage_ratio')->default(0)->comment('使用率（%）= usage_count / total_projects * 100');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tech_stack_statistics');
    }
};
