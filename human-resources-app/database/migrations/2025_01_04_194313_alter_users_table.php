<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::table('users', function (Blueprint $table) {
            
            $table->boolean('isHr')->after('password')->default(false);
            $table->enum('gender', ['male', 'female', 'other'])->after('isHr');
            $table->date('date_of_birth')->after('gender');
            $table->date('contract_start_date')->after('date_of_birth');
            $table->string('position')->after('contract_start_date');

            $table->dropColumn(['email_verified_at']);
            $table->dropTimestamps();
        });
    }

    public function down()
    {
        Schema::table('users', function (Blueprint $table) {

            $table->dropColumn(['isHr', 'gender', 'date_of_birth', 'contract_start_date']);

            $table->timestamp('email_verified_at')->nullable();
            $table->timestamps();
        });
    }
};
