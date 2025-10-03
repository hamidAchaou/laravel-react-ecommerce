<?php

namespace App\Repositories;

use App\Models\Order;

class OrderRepository extends BaseRepository
{
    protected function model(): string
    {
        return Order::class;
    }
}