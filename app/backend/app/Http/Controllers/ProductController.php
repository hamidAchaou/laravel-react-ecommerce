<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProductStoreRequest;
use App\Http\Requests\ProductUpdateRequest;
use App\Http\Resources\ProductResource;
use App\Repositories\ProductRepository;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    public function __construct(
        private readonly ProductRepository $productRepository
    ) {}

    /**
     * List products with search, filters & pagination.
     */
    public function index(Request $request): JsonResponse
    {
        $filters = [
            'search'      => $request->get('search'),
            'category_id' => $request->get('category_id'),
            'min_price'   => $request->get('min_price'),
            'max_price'   => $request->get('max_price'),
        ];

        $perPage   = $request->integer('per_page', 15);
        $sortBy    = $request->get('sort_by', 'created_at');
        $sortDir   = $request->get('sort_dir', 'desc');

        $products = $this->productRepository->getAllPaginate(
            filters: $filters,
            with: ['category', 'images'],
            searchableFields: ['title', 'description'],
            perPage: $perPage,
            orderBy: $sortBy,
            direction: $sortDir
        );

        return response()->json(
            ProductResource::collection($products)->response()->getData(true)
        );
    }

    /**
     * Show a single product.
     */
    public function show(int $id): JsonResponse
    {
        $product = $this->productRepository->find($id, ['category']);

        if (!$product) {
            return response()->json(['message' => 'Product not found'], 404);
        }

        return response()->json(new ProductResource($product));
    }

    /**
     * Store a new product.
     */
    public function store(ProductStoreRequest $request): JsonResponse
    {
        $validated = $request->validated();
        $product = $this->productRepository->create($validated);

        $uploaded = $request->file('images', []);
        $primaryIndex = $request->input('primary_new_index', null);
        $primaryId = $request->input('primary_image_id', null);

        // Save uploaded files
        foreach ($uploaded as $i => $file) {
            $path = $file->store('products', 'public');
            $product->images()->create([
                'image_path' => $path,
                'is_primary' => ($primaryIndex !== null && (int)$primaryIndex === $i),
            ]);
        }

        // If primary_image_id provided but it's a just-created id, we won't know it here.
        // But since store creates the images above, prefer primary_new_index for store.
        // If none set, mark first image primary (if exists).
        if ($product->images()->where('is_primary', true)->doesntExist()) {
            $first = $product->images()->first();
            if ($first) $first->update(['is_primary' => true]);
        }

        return response()->json(new ProductResource($product->load(['category', 'images'])), 201);
    }

    public function update(ProductUpdateRequest $request, int $id): JsonResponse
    {
        $product = $this->productRepository->find($id, ['images']);
        if (!$product) {
            return response()->json(['message' => 'Product not found'], 404);
        }

        // Update simple fields
        $updatable = ['title', 'description', 'price', 'stock', 'category_id'];
        foreach ($updatable as $field) {
            if ($request->filled($field)) {
                $product->{$field} = $request->input($field);
            }
        }
        $product->save();

        // Handle images:
        // - existing_image_ids[]: ids to keep
        // - images[]: new uploaded files
        // - primary_image_id: id (existing) to set primary
        // - primary_new_index: index within uploaded files to set primary
        $existingIds = (array) $request->input('existing_image_ids', []);
        $uploadedFiles = $request->file('images', []);

        // Delete images that were removed client-side
        $product->images()->whereNotIn('id', $existingIds)->get()->each(function ($image) {
            Storage::disk('public')->delete($image->image_path);
            $image->delete();
        });

        // Store uploaded files and collect their new ids in order
        $createdNewIds = [];
        foreach ($uploadedFiles as $i => $file) {
            $path = $file->store('products', 'public');
            $new = $product->images()->create([
                'image_path' => $path,
                'is_primary' => false,
            ]);
            $createdNewIds[$i] = $new->id;
        }

        // Reset all primary flags
        $product->images()->update(['is_primary' => false]);

        // Determine primary: prefer primary_image_id (existing), then primary_new_index
        $primaryId = $request->input('primary_image_id', null);
        $primaryNewIndex = $request->input('primary_new_index', null);

        if ($primaryId && $product->images()->where('id', $primaryId)->exists()) {
            $product->images()->where('id', $primaryId)->update(['is_primary' => true]);
        } elseif (is_numeric($primaryNewIndex) && isset($createdNewIds[(int)$primaryNewIndex])) {
            $product->images()->where('id', $createdNewIds[(int)$primaryNewIndex])->update(['is_primary' => true]);
        } else {
            // fallback: set first image as primary if exists
            $first = $product->images()->first();
            if ($first) $first->update(['is_primary' => true]);
        }

        return response()->json(new ProductResource($product->fresh(['category', 'images'])));
    }
    /**
     * Delete a product.
     */    public function destroy(int $id): JsonResponse
    {
        $deleted = $this->productRepository->delete($id);

        if (!$deleted) {
            return response()->json(['message' => 'Product not found'], 404);
        }

        return response()->json(['message' => 'Product deleted successfully']);
    }
}