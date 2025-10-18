<?php

namespace App\Repositories;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Spatie\Permission\Models\Role;

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
     * Create a new user with a role (default: customer)
     */
    public function create(array $data): Model
    {
        if (isset($data['password'])) {
            $data['password'] = bcrypt($data['password']);
        }

        // Create the user
        $user = parent::create($data);

        // Assign chosen role or default to "customer"
        $roleName = $data['role'] ?? 'customer';
        $role = Role::where('name', $roleName)->first();

        if ($role) {
            $user->assignRole($role);
        }

        return $user->refresh();
    }

    /**
     * Update user info and optionally their role.
     */
    public function update(array $data, mixed $id): Model
    {
        $user = $this->findOrFail($id);
    
        $fields = ['name', 'email', 'is_active'];
        foreach ($fields as $field) {
            if (isset($data[$field])) {
                $user->{$field} = $data[$field];
            }
        }
    
        if (!empty($data['password'])) {
            $user->password = bcrypt($data['password']);
        }
    
        $user->save();
    
        // ✅ Update role if provided
        if (!empty($data['role'])) {
            $role = Role::where('name', $data['role'])->first();
            if ($role) {
                $user->syncRoles([$role]);
            }
        }
    
        // ✅ Always reload relations before returning
        return $user->load('roles')->refresh();
    }
    
}