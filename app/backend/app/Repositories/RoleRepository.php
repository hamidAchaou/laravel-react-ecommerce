<?php

namespace App\Repositories;

use Spatie\Permission\Models\Role;

class RoleRepository extends BaseRepository
{
    protected function model(): string
    {
        return Role::class;
    }

    /**
     * Get all roles with optional permissions eager-loaded.
     */
    public function getAllWithPermissions(array $with = ['permissions'])
    {
        return $this->all($with);
    }

    /**
     * Create a role and optionally assign permissions.
     */
    public function createRole(array $data): Role
    {
        $role = $this->create([
            'name' => $data['name'],
            'guard_name' => $data['guard_name'] ?? 'web',
        ]);

        if (!empty($data['permissions'])) {
            $role->syncPermissions($data['permissions']);
        }

        return $role->load('permissions');
    }

    /**
     * Update a role and its permissions.
     */
    public function updateRole(array $data, mixed $id): Role
    {
        $role = $this->findOrFail($id);

        $role->update([
            'name' => $data['name'],
        ]);

        if (isset($data['permissions'])) {
            $role->syncPermissions($data['permissions']);
        }

        return $role->load('permissions');
    }

    /**
     * Delete a role safely.
     */
    public function deleteRole(mixed $id): bool
    {
        $role = $this->findOrFail($id);

        // detach permissions before delete
        $role->permissions()->detach();

        return (bool) $role->delete();
    }
}