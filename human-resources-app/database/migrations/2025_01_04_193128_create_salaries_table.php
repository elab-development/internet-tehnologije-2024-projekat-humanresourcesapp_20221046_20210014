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
            $table->enum('currency', ['USD', 'EUR', 'GBP', 'CAD', 'AUD'])->default('USD');
            $table->enum('payment_frequency', ['monthly', 'yearly'])->default('monthly');
        });
    }

    public function down()
    {
        Schema::dropIfExists('salaries');
    }
};
