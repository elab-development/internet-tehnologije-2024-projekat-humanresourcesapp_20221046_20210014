<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {

        Schema::table('payslips', function (Blueprint $table) {
            $table->foreignId('user_id')->after('id')->nullable()->constrained()->onDelete('cascade');
            $table->foreignId('salary_id')->after('user_id')->nullable()->constrained()->onDelete('set null');
            $table->foreignId('bonus_id')->after('salary_id')->nullable()->constrained()->onDelete('set null');
        });

        Schema::table('salaries', function (Blueprint $table) {
            $table->foreignId('user_id')->after('id')->nullable()->constrained()->onDelete('cascade');
        });

        Schema::table('bonuses', function (Blueprint $table) {
            $table->foreignId('user_id')->after('id')->nullable()->constrained()->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::table('payslips', function (Blueprint $table) {
            $table->dropForeign(['user_id']);
            $table->dropForeign(['salary_id']);
            $table->dropForeign(['bonus_id']);
            $table->dropColumn(['user_id', 'salary_id', 'bonus_id']);
        });

        Schema::table('salaries', function (Blueprint $table) {
            $table->dropForeign(['user_id']);
            $table->dropColumn('user_id');
        });

        Schema::table('bonuses', function (Blueprint $table) {
            $table->dropForeign(['user_id']);
            $table->dropColumn('user_id');
        });
    }
};
