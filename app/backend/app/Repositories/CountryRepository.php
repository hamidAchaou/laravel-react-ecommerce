<?php

namespace App\Repositories;

use App\Models\Country;

class CountryRepository extends BaseRepository
{
    protected function model(): string
    {
        return Country::class;
    }
}