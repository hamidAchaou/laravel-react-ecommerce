<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class OrderResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,

            'client' => $this->whenLoaded('client', function () {
                $client = $this->client;

                return $client ? [
                    'id' => $client->id,
                    'name' => $client->user?->name,
                    'email' => $client->user?->email,
                    'phone' => $client->phone,
                    'address' => $client->full_address ?? null,
                ] : null;
            }),

            'payment' => $this->whenLoaded('payment', function () {
                return $this->payment ? [
                    'id' => $this->payment->id,
                    'method' => $this->payment->method,
                    'status' => $this->payment->status,
                ] : null;
            }),

            'total_amount' => $this->total_amount,
            'status' => $this->status,
            'status_color' => $this->status_color,
            'total_items' => $this->total_items,

            'order_items' => $this->whenLoaded('orderItems', function () {
                return $this->orderItems->map(function ($item) {
                    $product = $item->product;

                    return [
                        'id' => $item->id,
                        'product' => $product ? [
                            'id' => $product->id,
                            'title' => $product->title,
                            'price' => $product->price,
                        ] : null,
                        'quantity' => $item->quantity,
                        'price' => $item->price,
                        'images' => $product ? $product->images->map(function ($img) {
                            return [
                                'id' => $img->id,
                                'image_path' => $img->image_path,
                                'alt_text' => $img->alt_text,
                                'is_primary' => $img->is_primary,
                            ];
                        }): null,
                    ];
                });
            }),

            'created_at' => $this->created_at?->toDateTimeString(),
            'updated_at' => $this->updated_at?->toDateTimeString(),
        ];
    }
}