<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class OrderStoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        // Allow only authenticated users to create orders
        return true;
    }

    public function rules(): array
    {
        return [
            'client_id'    => ['required', 'exists:clients,id'],
            'payment_id'   => ['nullable', 'exists:payments,id'],
            'total_amount' => ['required', 'numeric', 'min:0'],
            'status'       => ['required', 'in:pending,paid,shipped,completed,cancelled'],
            'order_items'  => ['required', 'array', 'min:1'],
            'order_items.*.product_id' => ['required', 'exists:products,id'],
            'order_items.*.quantity'   => ['required', 'integer', 'min:1'],
            'order_items.*.price'      => ['required', 'numeric', 'min:0'],
        ];
    }

    public function prepareForValidation(): void
    {
        // Ensure total_amount is numeric
        if (isset($this->total_amount)) {
            $this->merge([
                'total_amount' => (float) $this->total_amount,
            ]);
        }
    }
}