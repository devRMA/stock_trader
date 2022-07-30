<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use App\Enums\CompanyRisk;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('companies', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->unsignedBigInteger('sell_amount')->default(0);
            $table->unsignedBigInteger('buy_amount')->default(0);
            $table->unsignedBigInteger('price')->default(0);
            $table->dateTime('last_price_update')->useCurrent();
            $table->enum('risk', CompanyRisk::values());
            $table->unsignedBigInteger('max_actions')->default(1000);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('companies');
    }
};
