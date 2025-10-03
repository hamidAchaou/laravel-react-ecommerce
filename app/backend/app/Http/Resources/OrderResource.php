<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class OrderResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id'            => $this->id,
            'client'        => $this->client ? [
                'id'   => $this->client->id,
                'name' => $this->client->name,
                'email'=> $this->client->email,
            ] : null,
            'payment'       => $this->payment ? [
                'id'           => $this->payment->id,
                'method'       => $this->payment->method,
                'status'       => $this->payment->status,
            ] : null,
            'total_amount'  => $this->total_amount,
            'status'        => $this->status,
            'status_color'  => $this->status_color,
            'total_items'   => $this->total_items,
            'order_items'   => $this->orderItems->map(function ($item) {
                return [
                    'id'        => $item->id,
                    'product'   => [
                        'id'    => $item->product->id,
                        'name'  => $item->product->name,
                        'price' => $item->product->price,
                    ],
                    'quantity'  => $item->quantity,
                    'price'     => $item->price,
                ];
            }),
            'created_at'    => $this->created_at->toDateTimeString(),
            'updated_at'    => $this->updated_at->toDateTimeString(),
        ];
    }
}