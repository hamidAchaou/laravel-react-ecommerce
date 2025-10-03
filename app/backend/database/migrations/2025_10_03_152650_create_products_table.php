<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::dropIfExists('products'); // Force clean if existing
    
        Schema::create('products', function (Blueprint $table) {
            $table->id('id'); // ensure auto-increment
            $table->string('title');
            $table->text('description');
            $table->decimal('price', 10, 2);
            $table->unsignedInteger('stock');
            $table->unsignedBigInteger('category_id');
            $table->timestamps();
    
            $table->foreign('category_id')->references('id')->on('categories')->onDelete('restrict');
        });
    }
    

    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};