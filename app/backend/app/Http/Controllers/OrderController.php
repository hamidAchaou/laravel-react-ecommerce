<?php

namespace App\Http\Controllers;

use App\Http\Requests\OrderStoreRequest;
use App\Http\Requests\OrderUpdateRequest;
use App\Http\Resources\OrderResource;
use App\Repositories\OrderRepository;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    public function __construct(
        private readonly OrderRepository $orderRepository
    ) {}

    /**
     * List orders with search, filters & pagination.
     */
    public function index(Request $request): JsonResponse
    {
        $filters = [
            'search'     => $request->get('search'),
            'status'     => $request->get('status'),
            'customer_id'=> $request->get('customer_id'),
            'min_total'  => $request->get('min_total'),
            'max_total'  => $request->get('max_total'),
        ];

        $perPage   = $request->integer('per_page', 15);
        $sortBy    = $request->get('sort_by', 'created_at');
        $sortDir   = $request->get('sort_dir', 'desc');

        $orders = $this->orderRepository->getAllPaginate(
            filters: $filters,
            with: ['client', 'orderItems.product'],
            searchableFields: ['id', 'status', 'payment_method'],
            perPage: $perPage,
            orderBy: $sortBy,
            direction: $sortDir
        );

        return response()->json(
            OrderResource::collection($orders)->response()->getData(true)
        );
    }

    /**
     * Show a single order.
     */
    public function show(int $id): JsonResponse
    {
        $order = $this->orderRepository->findOrFail($id, ['client', 'orderItems.product']);

        if (!$order) {
            return response()->json(['message' => 'Order not found'], 404);
        }

        return response()->json(new OrderResource($order));
    }

    /**
     * Store a new order.
     */
    public function store(OrderStoreRequest $request): JsonResponse
    {
        $order = $this->orderRepository->create($request->validated());

        return response()->json(new OrderResource($order), 201);
    }

    /**
     * Update an existing order.
     */
    public function update(OrderUpdateRequest $request, int $id): JsonResponse
    {
        $order = $this->orderRepository->find($id);

        if (!$order) {
            return response()->json(['message' => 'Order not found'], 404);
        }

        $order = $this->orderRepository->update($request->validated(), $id);

        return response()->json(new OrderResource($order));
    }

    /**
     * Delete an order.
     */
    public function destroy(int $id): JsonResponse
    {
        $deleted = $this->orderRepository->delete($id);

        if (!$deleted) {
            return response()->json(['message' => 'Order not found'], 404);
        }

        return response()->json(['message' => 'Order deleted successfully']);
    }
}