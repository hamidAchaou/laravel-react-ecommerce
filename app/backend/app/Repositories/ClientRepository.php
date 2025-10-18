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

    public function getAllPaginate(
        array $filters = [],
        array $with = [],
        array $searchableFields = [],
        int $perPage = 15,
        string $orderBy = 'created_at',
        string $direction = 'desc'
    ): \Illuminate\Contracts\Pagination\LengthAwarePaginator {
        $query = $this->buildFilteredQuery($filters, $with, $searchableFields);

        // Only clients with user.role = customer
        $query->whereHas('user.roles', function ($q) {
            $q->where('name', 'customer');
        });

        return $query->orderBy($orderBy, $direction)->paginate($perPage);
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