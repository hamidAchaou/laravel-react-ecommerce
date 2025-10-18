<?php

namespace App\Repositories;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;

class UserRepository extends BaseRepository
{
    protected function model(): string
    {
        return User::class;
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

        if (!empty($filters['role'])) {
            $query->whereHas('roles', function ($q) use ($filters) {
                $q->where('name', $filters['role']);
            });
        }

        return $query->orderBy($orderBy, $direction)->paginate($perPage);
    }

    /**
     * Custom update logic if needed (ex: hashing password).
     */
    public function update(array $data, mixed $id): Model
    {
        $user = $this->findOrFail($id);

        $fields = ['name', 'email', 'role', 'is_active'];

        foreach ($fields as $field) {
            if (isset($data[$field])) {
                $user->{$field} = $data[$field];
            }
        }

        // Handle password if present
        if (!empty($data['password'])) {
            $user->password = bcrypt($data['password']);
        }

        $user->save();

        return $user->refresh();
    }

    /**
     * Secure user creation with hashed password.
     */
    public function create(array $data): Model
    {
        if (isset($data['password'])) {
            $data['password'] = bcrypt($data['password']);
        }

        return parent::create($data);
    }
}