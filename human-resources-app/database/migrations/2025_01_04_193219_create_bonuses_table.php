<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::create('bonuses', function (Blueprint $table) {
            $table->id();
            $table->decimal('amount', 10, 2);
            $table->string('reason')->nullable(); 
            $table->date('date_awarded')->nullable();
        });
    }

    public function down()
    {
        Schema::dropIfExists('bonuses');
    }
};
