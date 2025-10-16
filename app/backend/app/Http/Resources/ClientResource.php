<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ClientResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray(Request $request): array
    {
        return [
            'id'           => $this->id,
            'user'         => new UserResource($this->whenLoaded('user')),
            'phone'        => $this->phone,
            'address'      => $this->address,
            'country'      => new CountryResource($this->whenLoaded('country')),
            'city'         => new CityResource($this->whenLoaded('city')),
            'full_address' => $this->full_address,
            'total_orders' => $this->whenAppended('total_orders', $this->total_orders),
            'total_spent'  => $this->whenAppended('total_spent', $this->total_spent),
            'created_at'   => $this->created_at?->toDateTimeString(),
            'updated_at'   => $this->updated_at?->toDateTimeString(),
        ];
    }
}