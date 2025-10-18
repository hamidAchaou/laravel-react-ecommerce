<?php

namespace App\Http\Controllers;

use App\Http\Requests\ClientStoreRequest;
use App\Http\Requests\ClientUpdateRequest;
use App\Http\Resources\ClientResource;
use App\Repositories\ClientRepository;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ClientController extends Controller
{
    public function __construct(
        private readonly ClientRepository $clientRepository
    ) {}

    /**
     * Display a paginated list of clients with optional filters and search.
     */
    public function index(Request $request): JsonResponse
    {
        $filters = $request->only(['search', 'country_id', 'city_id']);
        $perPage = $request->integer('per_page', 15);
        $sortBy  = $request->get('sort_by', 'created_at');
        $sortDir = $request->get('sort_dir', 'desc');

        $clients = $this->clientRepository->getAllPaginate(
            filters: $filters,
            with: ['user.roles', 'country', 'city'],
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
     * Display the specified client.
     */
    public function show(int $id): JsonResponse
    {
        $client = $this->clientRepository->findOrFail($id, ['user.roles', 'country', 'city', 'orders']);

        if (!$client) {
            return response()->json(['message' => 'Client not found'], Response::HTTP_NOT_FOUND);
        }

        return response()->json(new ClientResource($client));
    }

    /**
     * Store a newly created client.
     */
    public function store(ClientStoreRequest $request): JsonResponse
    {
        $client = $this->clientRepository->create($request->validated());

        return response()->json(
            new ClientResource($client->load(['user.roles', 'country', 'city'])),
            Response::HTTP_CREATED
        );
    }

    /**
     * Update the specified client.
     */
    public function update(ClientUpdateRequest $request, int $id): JsonResponse
    {
        $client = $this->clientRepository->findOrFail($id);

        if (!$client) {
            return response()->json(['message' => 'Client not found'], Response::HTTP_NOT_FOUND);
        }

        $updatedClient = $this->clientRepository->update($request->validated(), $id);

        return response()->json(new ClientResource($updatedClient->load(['user.roles', 'country', 'city'])));
    }

    /**
     * Remove the specified client.
     */
    public function destroy(int $id): JsonResponse
    {
        $deleted = $this->clientRepository->delete($id);

        if (!$deleted) {
            return response()->json(['message' => 'Client not found'], Response::HTTP_NOT_FOUND);
        }

        return response()->json(['message' => 'Client deleted successfully']);
    }
}