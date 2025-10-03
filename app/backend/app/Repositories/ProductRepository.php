<?php

namespace App\Repositories;

use App\Models\Product;

class ProductRepository extends BaseRepository
{
    protected function model(): string
    {
        return Product::class;
    }
}