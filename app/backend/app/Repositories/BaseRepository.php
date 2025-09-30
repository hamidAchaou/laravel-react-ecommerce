<?php

namespace App\Repositories;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

abstract class BaseRepository
{
    protected Model $model;

    public function __construct()
    {
        $this->model = $this->resolveModel();
    }

    /**
     * Get the associated model class name.
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
     * Get all records, with optional eager loading.
     */
    public function all(array $with = []): \Illuminate\Support\Collection
    {
        return $this->model->with($with)->get();
    }

    /**
     * Get paginated records with optional filters, relations, and search.
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
     * Get all filtered and searched records without pagination.
     */
    public function search(
        array $filters = [],
        array $with = [],
        array $searchableFields = [],
        string $orderBy = 'created_at',
        string $direction = 'desc'
    ): \Illuminate\Support\Collection {
        return $this->buildFilteredQuery($filters, $with, $searchableFields)
            ->orderBy($orderBy, $direction)
            ->get();
    }

    /**
     * Find a record by ID or fail.
     */
    public function find(mixed $id, array $with = []): ?Model
    {
        $query = $this->model->newQuery();

        if (!empty($with)) {
            $query->with($with);
        }

        return $query->find($id);
    }


    public function create(array $data)
    {
        $record = $this->model->create($data);
        return $record->fresh();
    }

    /**
     * Update a record by ID.
     */
    public function update(array $data, mixed $id): Model
    {
        $record = $this->find($id);
        $record->update($data);

        return $record;
    }

    /**
     * Delete a record by ID.
     */
    public function delete(mixed $id): int
    {
        return $this->model->destroy($id);
    }

    /**
     * Build a query with filters and optional search.
     */
    protected function buildFilteredQuery(
        array $filters = [],
        array $with = [],
        array $searchableFields = []
    ): Builder {
        $query = $this->model->with($with);

        if (!empty($filters['search']) && !empty($searchableFields)) {
            $keyword = $filters['search'];
            $query->where(function (Builder $q) use ($keyword, $searchableFields) {
                foreach ($searchableFields as $field) {
                    $q->orWhere($field, 'LIKE', "%{$keyword}%");
                }
            });
        }

        foreach ($filters as $field => $value) {
            if ($field !== 'search' && $value !== null) {
                $query->where($field, $value);
            }
        }

        return $query;
    }

    /**
     * Get the total number of records, optionally filtered.
     *
     * @param array $filters Optional filters to apply
     * @return int
     */
    public function countAll(array $filters = []): int
    {
        if (empty($filters)) {
            return $this->model->count();
        }

        // Apply filters using the existing buildFilteredQuery method
        return $this->buildFilteredQuery($filters)->count();
    }

    /**
     * Get the sum of a column, optionally filtered.
     *
     * @param string $column The column to sum
     * @param array  $filters Optional filters to apply
     * @return float|int
     */
    public function sumAll(string $column, array $filters = []): float|int
    {
        if (empty($filters)) {
            return $this->model->sum($column);
        }

        // Apply filters using existing buildFilteredQuery
        return $this->buildFilteredQuery($filters)->sum($column);
    }
}