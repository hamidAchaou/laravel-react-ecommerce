<?php

namespace App\Repositories;

use App\Models\City;

class CityRepository extends BaseRepository
{
    protected function model(): string
    {
        return City::class;
    }
}