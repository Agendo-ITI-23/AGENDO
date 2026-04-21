<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->enum('role', ['admin', 'business_owner', 'customer'])->default('customer')->after('email');
            $table->string('business_name')->nullable()->after('role');
            $table->text('business_description')->nullable()->after('business_name');
            $table->string('phone', 20)->nullable()->after('business_description');
            $table->string('address')->nullable()->after('phone');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['role', 'business_name', 'business_description', 'phone', 'address']);
        });
    }
};
