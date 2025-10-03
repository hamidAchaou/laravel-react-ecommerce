<?php

namespace App\Repositories;

use App\Models\Client;

class ClientRepository extends BaseRepository
{
    protected function model(): string
    {
        return Client::class;
    }
}