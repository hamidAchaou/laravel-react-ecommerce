<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Categories extends Model
{
    public function parent()
    {
        return $this->belongsTo(Categories::class, 'parent_id');
    }
}