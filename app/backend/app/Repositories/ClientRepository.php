<?php

namespace App\Repositories;

use App\Models\Client;
use Illuminate\Database\Eloquent\Model;

class ClientRepository extends BaseRepository
{
    protected function model(): string
    {
        return Client::class;
    }

    /**
     * Custom create with optional user linkage handling.
     */
    public function create(array $data): Model
    {
        // Ensure valid user_id (if passed)
        if (!empty($data['user_id'])) {
            // Optional: validate user exists
        }

        return parent::create($data);
    }

    public function update(array $data, mixed $id): Model
    {
        $client = $this->findOrFail($id);

        $client->fill($data)->save();

        return $client->fresh(['user.roles', 'country', 'city']);
    }
}