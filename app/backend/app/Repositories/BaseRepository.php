<?php

namespace App\Repositories;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Collection;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\ModelNotFoundException;

abstract class BaseRepository
{
    protected Model $model;

    public function __construct()
    {
        $this->model = $this->resolveModel();
    }

    /**
     * Define the model class name.
     */
    abstract protected function model(): string;

    /**
     * Resolve and instantiate the model.
     */
    protected function resolveModel(): Model
    {
        return app($this->model());
    }

    /**
     * Base query builder.
     */
    protected function query(): Builder
    {
        return $this->model->newQuery();
    }

    /**
     * Get all records, with optional relations.
     */
    public function all(array $with = []): Collection
    {
        return $this->query()->with($with)->get();
    }

    /**
     * Get paginated data with filters, search, and relations.
     */
    public function getAllPaginate(
        array $filters = [],
        array $with = [],
        array $searchableFields = [],
        int $perPage = 15,
        string $orderBy = 'created_at',
        string $direction = 'desc'
    ): LengthAwarePaginator {
        return $this->buildFilteredQuery($filters, $with, $searchableFields)
            ->orderBy($orderBy, $direction)
            ->paginate($perPage);
    }

    /**
     * Get filtered and searched data without pagination.
     */
    public function search(
        array $filters = [],
        array $with = [],
        array $searchableFields = [],
        string $orderBy = 'created_at',
        string $direction = 'desc'
    ): Collection {
        return $this->buildFilteredQuery($filters, $with, $searchableFields)
            ->orderBy($orderBy, $direction)
            ->get();
    }

    /**
     * Find a record by ID or return null.
     */
    public function find(mixed $id, array $with = []): ?Model
    {
        $query = $this->query();

        if (!empty($with)) {
            $query->with($with);
        }

        return $query->find($id);
    }

    /**
     * Find a record or fail.
     */
    public function findOrFail(mixed $id, array $with = []): Model
    {
        $query = $this->query();

        if (!empty($with)) {
            $query->with($with);
        }

        return $query->findOrFail($id);
    }

    /**
     * Create a new record.
     */
    public function create(array $data): Model
    {
        return $this->model->create($data)->fresh();
    }

    /**
     * Update a record by ID.
     */
    public function update(array $data, mixed $id): Model
    {
        $record = $this->findOrFail($id);
        $record->update($data);

        return $record->refresh();
    }

    /**
     * Delete a record by ID.
     */
    public function delete(mixed $id): bool
    {
        $record = $this->find($id);
        if (!$record) {
            throw new ModelNotFoundException("Record with ID {$id} not found.");
        }

        return (bool) $record->delete();
    }

    /**
     * Build query with filters and search.
     */
    protected function buildFilteredQuery(
        array $filters = [],
        array $with = [],
        array $searchableFields = []
    ): Builder {
        $query = $this->query()->with($with);

        // 🔍 Keyword search
        if (!empty($filters['search']) && !empty($searchableFields)) {
            $keyword = trim($filters['search']);
            $query->where(function (Builder $q) use ($keyword, $searchableFields) {
                foreach ($searchableFields as $field) {
                    $q->orWhere($field, 'LIKE', "%{$keyword}%");
                }
            });
        }

        // 🔎 Other filters
        foreach ($filters as $field => $value) {
            if ($value === null || $field === 'search') {
                continue;
            }

            if ($field === 'min_price') {
                $query->where('price', '>=', $value);
            } elseif ($field === 'max_price') {
                $query->where('price', '<=', $value);
            } else {
                $query->where($field, $value);
            }
        }

        return $query;
    }

    /**
     * Count total records (with optional filters).
     */
    public function countAll(array $filters = []): int
    {
        return empty($filters)
            ? $this->model->count()
            : $this->buildFilteredQuery($filters)->count();
    }

    /**
     * Sum a column (with optional filters).
     */
    public function sumAll(string $column, array $filters = []): float|int
    {
        return empty($filters)
            ? $this->model->sum($column)
            : $this->buildFilteredQuery($filters)->sum($column);
    }
}