<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ProductStoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
{
    return [
        'title' => 'required|string|max:255',
        'description' => 'nullable|string',
        'price' => 'required|numeric',
        'category_id' => 'required|exists:categories,id',
        'images' => 'nullable|array',
        'images.*' => 'file|image|max:2048',
        'is_primary' => 'nullable|array',
        'is_primary.*' => 'nullable|boolean',
    ];
}

}