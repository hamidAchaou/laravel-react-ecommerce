<?php

namespace App\Http\Controllers;

use App\Http\Requests\CategoryStoreRequest;
use App\Http\Requests\CategoryUpdateRequest;
use App\Http\Resources\CategoryResource;
use App\Repositories\CategoryRepository;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function __construct(
        private readonly CategoryRepository $categoryRepository
    ) {}

    /**
     * List categories with search, filters & pagination.
     */
    public function index(Request $request): JsonResponse
    {
        $filters = [
            'search'      => $request->get('search'),
            'parent_id'   => $request->get('parent_id'),
        ];

        $perPage = $request->integer('per_page', 15);
        $sortBy  = $request->get('sort_by', 'created_at');
        $sortDir = $request->get('sort_dir', 'desc');

        $categories = $this->categoryRepository->getAllPaginate(
            filters: $filters,
            with: ['parent'],
            searchableFields: ['name'],
            perPage: $perPage,
            orderBy: $sortBy,
            direction: $sortDir
        );

        return response()->json(
            CategoryResource::collection($categories)->response()->getData(true)
        );
    }

    /**
     * Show a single category.
     */
    public function show(int $id): JsonResponse
    {
        $category = $this->categoryRepository->find($id, ['parent']);

        if (!$category) {
            return response()->json(['message' => 'Category not found'], 404);
        }

        return response()->json(new CategoryResource($category));
    }

    /**
     * Store a new category.
     */
    public function store(CategoryStoreRequest $request): JsonResponse
    {
        $category = $this->categoryRepository->create($request->validated());

        return response()->json(new CategoryResource($category), 201);
    }

    /**
     * Update an existing category.
     */
    public function update(CategoryUpdateRequest $request, int $id): JsonResponse
    {
        $category = $this->categoryRepository->find($id);

        if (!$category) {
            return response()->json(['message' => 'Category not found'], 404);
        }

        $category = $this->categoryRepository->update($request->validated(), $id);

        return response()->json(new CategoryResource($category));
    }

    /**
     * Delete a category.
     */
    public function destroy(int $id): JsonResponse
    {
        $deleted = $this->categoryRepository->delete($id);

        if (!$deleted) {
            return response()->json(['message' => 'Category not found'], 404);
        }

        return response()->json(['message' => 'Category deleted successfully']);
    }
}