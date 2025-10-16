<?php

namespace App\Http\Controllers;

use App\Http\Requests\ClientStoreRequest;
use App\Http\Requests\ClientUpdateRequest;
use App\Http\Resources\ClientResource;
use App\Repositories\ClientRepository;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ClientController extends Controller
{
    public function __construct(
        private readonly ClientRepository $clientRepository
    ) {}

    /**
     * List all clients with filters, search, and pagination.
     */
    public function index(Request $request): JsonResponse
    {
        $filters = [
            'search'     => $request->get('search'),
            'country_id' => $request->get('country_id'),
            'city_id'    => $request->get('city_id'),
        ];

        $perPage = $request->integer('per_page', 15);
        $sortBy  = $request->get('sort_by', 'created_at');
        $sortDir = $request->get('sort_dir', 'desc');

        $clients = $this->clientRepository->getAllPaginate(
            filters: $filters,
            with: ['user', 'country', 'city'],
            searchableFields: ['user.name', 'user.email', 'phone', 'address'],
            perPage: $perPage,
            orderBy: $sortBy,
            direction: $sortDir
        );

        return response()->json(
            ClientResource::collection($clients)->response()->getData(true)
        );
    }

    /**
     * Show a single client.
     */
    public function show(int $id): JsonResponse
    {
        $client = $this->clientRepository->find($id, ['user', 'country', 'city', 'orders']);

        if (!$client) {
            return response()->json(['message' => 'Client not found'], 404);
        }

        return response()->json(new ClientResource($client));
    }

    /**
     * Store a new client.
     */
    public function store(ClientStoreRequest $request): JsonResponse
    {
        $validated = $request->validated();
        $client = $this->clientRepository->create($validated);

        return response()->json(new ClientResource($client->load(['user', 'country', 'city'])), 201);
    }

    /**
     * Update a client.
     */
    public function update(ClientUpdateRequest $request, int $id): JsonResponse
    {
        $client = $this->clientRepository->find($id);
        if (!$client) {
            return response()->json(['message' => 'Client not found'], 404);
        }

        $updated = $this->clientRepository->update($request->validated(), $id);

        return response()->json(new ClientResource($updated->load(['user', 'country', 'city'])));
    }

    /**
     * Delete a client.
     */
    public function destroy(int $id): JsonResponse
    {
        $deleted = $this->clientRepository->delete($id);

        if (!$deleted) {
            return response()->json(['message' => 'Client not found'], 404);
        }

        return response()->json(['message' => 'Client deleted successfully']);
    }
}