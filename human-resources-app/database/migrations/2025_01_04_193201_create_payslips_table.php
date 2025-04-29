<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::create('payslips', function (Blueprint $table) {
            $table->id();
            $table->date('issue_date');
            $table->decimal('total_amount', 10, 2);
        });
    }

    public function down()
    {
        Schema::dropIfExists('payslips');
    }
};
