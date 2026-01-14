<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::table('bonuses', function (Blueprint $table) {
  
            $table->string('reason')->nullable(false)->change();
            $table->date('date_awarded')->nullable(false)->change();
        });
    }

    public function down()
    {
        Schema::table('bonuses', function (Blueprint $table) {

            $table->string('reason')->nullable()->change();
            $table->date('date_awarded')->nullable()->change();
        });
    }
};
