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
        // Ensure a valid user_id if user exists
        if (isset($data['user_id'])) {
            // could validate user existence here if needed
        }

        return parent::create($data);
    }

    /**
     * Update client fields safely.
     */
    public function update(array $data, mixed $id): Model
    {
        $client = $this->findOrFail($id);

        $updatable = ['user_id', 'phone', 'address', 'country_id', 'city_id'];
        foreach ($updatable as $field) {
            if (array_key_exists($field, $data)) {
                $client->{$field} = $data[$field];
            }
        }

        $client->save();

        return $client->fresh(['user', 'country', 'city']);
    }
}