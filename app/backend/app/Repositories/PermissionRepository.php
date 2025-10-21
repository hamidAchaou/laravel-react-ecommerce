<?php

namespace App\Repositories;

use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\DB;
use Spatie\Permission\Models\Permission;

class PermissionRepository extends BaseRepository
{
    protected function model(): string
    {
        return Permission::class;
    }

    /**
     * Get all permissions with pagination and filtering
     */
    public function getAllPaginated(array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        $query = $this->model->newQuery();

        // Apply search filter
        if (!empty($filters['search'])) {
            $query->where(function ($q) use ($filters) {
                $q->where('name', 'like', '%' . $filters['search'] . '%')
                  ->orWhere('guard_name', 'like', '%' . $filters['search'] . '%');
            });
        }

        // Apply guard name filter
        if (!empty($filters['guard_name'])) {
            $query->where('guard_name', $filters['guard_name']);
        }

        // Apply sorting
        $sortField = $this->validateSortField($filters['sort_by'] ?? 'name');
        $sortDirection = $this->validateSortDirection($filters['sort_direction'] ?? 'asc');
        
        return $query->orderBy($sortField, $sortDirection)
                    ->paginate($filters['per_page'] ?? $perPage)
                    ->withQueryString();
    }

    /**
     * Get all permissions for select dropdowns
     */
    public function getAll(array $columns = ['*']): Collection
    {
        return $this->model
            ->select($columns)
            ->orderBy('name')
            ->get();
    }

    /**
     * Find permission by ID or throw exception
     */
    public function findById($id, array $columns = ['*'], array $with = []): Permission
    {
        $permission = $this->model
            ->select($columns)
            ->with($with)
            ->find($id);

        if (!$permission) {
            throw new ModelNotFoundException("Permission not found with ID: {$id}");
        }

        return $permission;
    }

    /**
     * Find permission by name
     */
    public function findByName(string $name, string $guardName = null): ?Permission
    {
        $query = $this->model->where('name', $name);

        if ($guardName) {
            $query->where('guard_name', $guardName);
        }

        return $query->first();
    }

    /**
     * Get permissions by multiple names
     */
    public function getByNames(array $names, string $guardName = null): Collection
    {
        $query = $this->model->whereIn('name', $names);

        if ($guardName) {
            $query->where('guard_name', $guardName);
        }

        return $query->get();
    }

    /**
     * Sync permissions - create if not exists
     */
    public function syncPermissions(array $permissions): Collection
    {
        $result = collect();

        foreach ($permissions as $permission) {
            $existing = $this->findByName($permission['name'], $permission['guard_name'] ?? 'web');
            
            if ($existing) {
                $result->push($existing);
            } else {
                $result->push($this->create($permission));
            }
        }

        return $result;
    }

    /**
     * Get permissions grouped by guard name
     */
    public function getGroupedByGuard(): Collection
    {
        return $this->model
            ->orderBy('guard_name')
            ->orderBy('name')
            ->get()
            ->groupBy('guard_name');
    }

    /**
     * Check if permission exists
     */
    public function exists($id): bool
    {
        return $this->model->where('id', $id)->exists();
    }

    /**
     * Get permissions for role assignment
     */
    public function getPermissionsForRole(array $permissionNames, string $guardName = 'web'): Collection
    {
        return $this->model
            ->whereIn('name', $permissionNames)
            ->where('guard_name', $guardName)
            ->get();
    }

    /**
     * Get permissions count by guard name
     */
    public function getCountByGuard(): array
    {
        return $this->model
            ->select('guard_name', DB::raw('count(*) as count'))
            ->groupBy('guard_name')
            ->pluck('count', 'guard_name')
            ->toArray();
    }

    /**
     * Delete permission with Spatie relationship check
     * Override the base delete method to add business logic
     */
    public function delete($id): bool
    {
        $permission = $this->findById($id);

        // Check if permission is assigned to any roles using Spatie relationships
        if ($permission->roles()->count() > 0) {
            throw new \RuntimeException('Cannot delete permission that is assigned to roles. Remove the permission from roles first.');
        }

        return parent::delete($id);
    }

    /**
     * Validate sort field to prevent SQL injection
     */
    protected function validateSortField(string $field): string
    {
        $allowedFields = ['id', 'name', 'guard_name', 'created_at', 'updated_at'];
        
        return in_array($field, $allowedFields) ? $field : 'name';
    }

    /**
     * Validate sort direction
     */
    protected function validateSortDirection(string $direction): string
    {
        return in_array(strtolower($direction), ['asc', 'desc']) ? $direction : 'asc';
    }
}