<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProductStoreRequest;
use App\Http\Requests\ProductUpdateRequest;
use App\Http\Resources\ProductResource;
use App\Repositories\ProductRepository;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

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
        $product = $this->productRepository->create($request->validated());
    
        // ✅ Save images
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $index => $imageFile) {
                $path = $imageFile->store('products', 'public'); // storage/app/public/products
    
                $product->images()->create([
                    'image_path' => $path,
                    'is_primary' => $request->is_primary[$index] ?? 0,
                ]);
            }
        }
    
        return response()->json(new ProductResource($product), 201);
    }
    

    /**
     * Update an existing product.
     */
    public function update(ProductUpdateRequest $request, int $id): JsonResponse
    {
        $product = $this->productRepository->find($id);

        if (!$product) {
            return response()->json(['message' => 'Product not found'], 404);
        }

        $product = $this->productRepository->update($request->validated(), $id);

        return response()->json(new ProductResource($product));
    }

    /**
     * Delete a product.
     */
    public function destroy(int $id): JsonResponse
    {
        $deleted = $this->productRepository->delete($id);

        if (!$deleted) {
            return response()->json(['message' => 'Product not found'], 404);
        }

        return response()->json(['message' => 'Product deleted successfully']);
    }
}