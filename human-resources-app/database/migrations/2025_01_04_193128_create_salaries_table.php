<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::create('salaries', function (Blueprint $table) {
            $table->id();
            $table->decimal('amount', 10, 2);
            $table->date('date_issued');
            $table->enum('currency', ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'RSD'])->default('USD');
        });
    }

    public function down()
    {
        Schema::dropIfExists('salaries');
    }
};
