<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->text('bio')->nullable()->after('password');
            $table->enum('tech_level', ['beginner', 'intermediate', 'advanced'])->after('bio');
            $table->string('profile_image_url')->nullable()->after('tech_level');
        });
    }

    public function down()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['bio', 'tech_level', 'profile_image_url']);
        });
    }
};
