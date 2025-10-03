<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class ProductImageResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray($request): array
    {
        return [
            'id'         => $this->id,
            'image_path' => asset('storage/' . $this->image_path), // full URL
            'alt_text'   => $this->alt_text ?? '',
            'is_primary' => $this->is_primary,
        ];
    }
}