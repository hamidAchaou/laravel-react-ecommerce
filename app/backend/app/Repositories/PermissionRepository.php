<?php

namespace App\Repositories;

use App\Models\Permission;

class PermissionRepository  extends BaseRepository
{
    protected function model(): string
    {
        return Permission::class;
    }
}