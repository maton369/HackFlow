<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::create('tech_stacks', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();
        });
    }

    public function down()
    {
        Schema::dropIfExists('tech_stacks');
    }
};
