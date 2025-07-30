<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Departement extends Model
{
    protected $fillable = [
        'name', 
        'slug',
        'active',
    ];

    public function categories()
    {
        return $this->hasMany(Categories::class);
    }
}