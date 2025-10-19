<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Repositories\RoleRepository;
use App\Http\Resources\RoleResource;
use Illuminate\Validation\ValidationException;

class RoleController extends Controller
{
    protected RoleRepository $roles;

    public function __construct(RoleRepository $roles)
    {
        $this->roles = $roles;
    }

    /**
     * Display a listing of roles.
     */
    public function index(Request $request)
    {
        $filters = $request->only(['search']);
        $roles = $this->roles->search(
            $filters,
            ['permissions'],
            ['name']
        );

        return RoleResource::collection($roles);
    }

    /**
     * Store a newly created role.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|unique:roles,name',
            'permissions' => 'nullable|array',
            'permissions.*' => 'string',
        ]);

        $role = $this->roles->createRole($validated);

        return new RoleResource($role);
    }

    /**
     * Display the specified role.
     */
    public function show($id)
    {
        $role = $this->roles->findOrFail($id, ['permissions']);
        return new RoleResource($role);
    }

    /**
     * Update the specified role.
     */
    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'name' => 'required|string|unique:roles,name,' . $id,
            'permissions' => 'nullable|array',
            'permissions.*' => 'string',
        ]);

        $role = $this->roles->updateRole($validated, $id);

        return new RoleResource($role);
    }

    /**
     * Remove the specified role.
     */
    public function destroy($id)
    {
        $this->roles->deleteRole($id);
        return response()->json(['message' => 'Role deleted successfully']);
    }
}
