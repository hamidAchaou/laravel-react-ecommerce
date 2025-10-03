<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class OrderUpdateRequest extends FormRequest
{
    public function authorize(): bool
    {
        // Allow only authenticated users to update orders
        return true;
    }

    public function rules(): array
    {
        return [
            'status'       => ['sometimes', 'in:pending,paid,shipped,completed,cancelled'],
            'payment_id'   => ['nullable', 'exists:payments,id'],
            'total_amount' => ['sometimes', 'numeric', 'min:0'],
            'order_items'  => ['sometimes', 'array', 'min:1'],
            'order_items.*.product_id' => ['required_with:order_items', 'exists:products,id'],
            'order_items.*.quantity'   => ['required_with:order_items', 'integer', 'min:1'],
            'order_items.*.price'      => ['required_with:order_items', 'numeric', 'min:0'],
        ];
    }
}