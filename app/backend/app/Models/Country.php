<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Country extends Model
{
    protected $fillable = [
        'id',
        'name',
        'code',
    ];

    /**
     * Get the cities in the country.
     */
    public function cities()
    {
        return $this->hasMany(City::class, 'country_id', 'id');
    }

    /**
     * Get the clients in the country.
     */
    public function clients()
    {
        return $this->hasMany(Client::class, 'country_id', 'id');
    }
}