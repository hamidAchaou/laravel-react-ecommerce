<?php

namespace App\Http\Controllers;

use App\Http\Requests\CategoryStoreRequest;
use App\Http\Requests\CategoryUpdateRequest;
use App\Http\Resources\CategoryResource;
use App\Repositories\CategoryRepository;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class CategoryController extends Controller
{
    public function __construct(
        private readonly CategoryRepository $categoryRepository
    ) {}

    /**
     * List categories
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
     * Show single category
     */
    public function show(int $id): JsonResponse
    {
        try {
            $category = $this->categoryRepository->findOrFail($id, ['parent']);
            return response()->json(['data' => new CategoryResource($category)]);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Category not found'], 404);
        }
    }

    /**
     * Store new category
     */
    public function store(CategoryStoreRequest $request): JsonResponse
    {
        try {
            DB::beginTransaction();

            $data = $request->validated();

            Log::info('Store Category Request Data:', [
                'validated' => $data,
                'has_file' => $request->hasFile('image'),
                'file_valid' => $request->hasFile('image') ? $request->file('image')->isValid() : false,
            ]);

            // Handle image file
            if ($request->hasFile('image') && $request->file('image')->isValid()) {
                $data['image'] = $request->file('image');
            } else {
                unset($data['image']);
            }

            // Create category
            $category = $this->categoryRepository->create($data);

            DB::commit();

            return response()->json([
                'message' => 'Category created successfully',
                'data' => new CategoryResource($category)
            ], 201);

        } catch (\Illuminate\Validation\ValidationException $e) {
            DB::rollBack();
            Log::error('Validation error:', ['errors' => $e->errors()]);
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Category creation failed:', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json([
                'message' => 'Failed to create category',
                'error' => config('app.debug') ? $e->getMessage() : 'Internal server error'
            ], 500);
        }
    }

    /**
     * Update category
     */
    public function update(CategoryUpdateRequest $request, int $id): JsonResponse
    {
        try {
            DB::beginTransaction();

            $category = $this->categoryRepository->find($id);

            if (!$category) {
                return response()->json(['message' => 'Category not found'], 404);
            }

            $data = $request->validated();

            Log::info('Update Category Request Data:', [
                'id' => $id,
                'validated' => $data,
                'has_file' => $request->hasFile('image'),
            ]);

            // Handle image file
            if ($request->hasFile('image') && $request->file('image')->isValid()) {
                $data['image'] = $request->file('image');
            }

            $category = $this->categoryRepository->update($data, $id);

            DB::commit();

            return response()->json([
                'message' => 'Category updated successfully',
                'data' => new CategoryResource($category)
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Category update failed:', [
                'id' => $id,
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json([
                'message' => 'Failed to update category',
                'error' => config('app.debug') ? $e->getMessage() : 'Internal server error'
            ], 500);
        }
    }

    /**
     * Delete category
     */
    public function destroy(int $id): JsonResponse
    {
        try {
            $deleted = $this->categoryRepository->delete($id);

            if (!$deleted) {
                return response()->json(['message' => 'Category not found'], 404);
            }

            return response()->json(['message' => 'Category deleted successfully']);
        } catch (\Exception $e) {
            Log::error('Category deletion failed:', [
                'id' => $id,
                'message' => $e->getMessage()
            ]);
            return response()->json([
                'message' => 'Failed to delete category',
                'error' => config('app.debug') ? $e->getMessage() : 'Internal server error'
            ], 500);
        }
    }
}