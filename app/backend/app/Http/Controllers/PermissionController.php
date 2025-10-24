<?php

namespace App\Http\Controllers;

use App\Http\Resources\PermissionResource;
use App\Repositories\PermissionRepository;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Validation\ValidationException;

class PermissionController extends Controller
{
    protected $permissionRepository;

    public function __construct(PermissionRepository $permissionRepository)
    {
        $this->permissionRepository = $permissionRepository;
    }

    /**
     * Display a listing of the permissions.
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        $perPage = $request->get('per_page', 15);
        $filters = $request->only(['search', 'guard_name', 'sort_by', 'sort_direction']);
        
        $permissions = $this->permissionRepository->getAllPaginated($filters, $perPage);
        
        return PermissionResource::collection($permissions);
    }

    /**
     * Store a newly created permission.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:permissions,name',
            'guard_name' => 'sometimes|string|max:255|in:web,api',
        ]);

        $permission = $this->permissionRepository->create([
            'name' => $validated['name'],
            'guard_name' => $validated['guard_name'] ?? 'web',
        ]);

        return response()->json([
            'message' => 'Permission created successfully',
            'data' => new PermissionResource($permission)
        ], 201);
    }

    /**
     * Display the specified permission.
     */
    public function show($id): PermissionResource
    {
        $permission = $this->permissionRepository->findById($id);
        return new PermissionResource($permission);
    }

    /**
     * Update the specified permission.
     */
    public function update(Request $request, $id): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255|unique:permissions,name,' . $id,
            'guard_name' => 'sometimes|string|max:255|in:web,api',
        ]);

        // ✅ FIXED: Pass data array first, then ID (matching BaseRepository signature)
        $permission = $this->permissionRepository->update($validated, $id);

        return response()->json([
            'message' => 'Permission updated successfully',
            'data' => new PermissionResource($permission)
        ]);
    }

    /**
     * Remove the specified permission.
     */
    public function destroy($id): JsonResponse
    {
        $this->permissionRepository->delete($id);

        return response()->json([
            'message' => 'Permission deleted successfully'
        ]);
    }

    /**
     * Get permissions for selection (for roles, etc.)
     */
    public function getForSelect(): AnonymousResourceCollection
    {
        $permissions = $this->permissionRepository->getAll();
        return PermissionResource::collection($permissions);
    }

    /**
     * Get permissions grouped by guard
     */
    public function getGroupedByGuard(): JsonResponse
    {
        $groupedPermissions = $this->permissionRepository->getGroupedByGuard();
        
        return response()->json([
            'data' => $groupedPermissions
        ]);
    }
}