<?php

namespace App\Repositories;

use App\Models\Wishlist;

class WishlistRepository extends BaseRepository
{
    protected function model(): string
    {
        return Wishlist::class;
    }
}