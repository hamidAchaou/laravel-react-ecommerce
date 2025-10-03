<?php

namespace App\Repositories;

use App\Models\Category;

class CategoryRepository extends BaseRepository
{
    protected function model(): string
    {
        return Category::class;
    }
}