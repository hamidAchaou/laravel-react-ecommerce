<?php

namespace App\Http\Controllers;

use App\Http\Requests\UserStoreRequest;
use App\Http\Requests\UserUpdateRequest;
use App\Http\Resources\UserResource;
use App\Repositories\UserRepository;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function __construct(
        private readonly UserRepository $userRepository
    ) {}

    /**
     * List users with search, filters & pagination.
     */
    public function index(Request $request): JsonResponse
    {
        $filters = [
            'search'   => $request->get('search'),
            'role'     => $request->get('role'),
            'is_active'=> $request->get('is_active'),
        ];

        $perPage = $request->integer('per_page', 15);
        $sortBy  = $request->get('sort_by', 'created_at');
        $sortDir = $request->get('sort_dir', 'desc');

        $users = $this->userRepository->getAllPaginate(
            filters: $filters,
            with: ['roles'],
            searchableFields: ['name', 'email'],
            perPage: $perPage,
            orderBy: $sortBy,
            direction: $sortDir
        );        

        return response()->json(
            UserResource::collection($users)->response()->getData(true)
        );
    }

    /**
     * Show a single user.
     */
    public function show(int $id): JsonResponse
    {
        $user = $this->userRepository->find($id);
        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        return response()->json(new UserResource($user));
    }

    /**
     * Store a new user.
     */
    public function store(UserStoreRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $user = $this->userRepository->create($validated);

        return response()->json(new UserResource($user), 201);
    }

    /**
     * Update an existing user.
     */
    public function update(UserUpdateRequest $request, int $id): JsonResponse
    {
        $validated = $request->validated();

        $user = $this->userRepository->update($validated, $id);

        return response()->json(new UserResource($user));
    }

    /**
     * Delete a user.
     */
    public function destroy(int $id): JsonResponse
    {
        $deleted = $this->userRepository->delete($id);

        if (!$deleted) {
            return response()->json(['message' => 'User not found'], 404);
        }

        return response()->json(['message' => 'User deleted successfully']);
    }
}