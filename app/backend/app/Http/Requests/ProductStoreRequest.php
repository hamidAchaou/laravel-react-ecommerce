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
            'stock' => 'required|integer|min:0',

            // files
            'images' => 'nullable|array',
            'images.*' => 'file|image|mimes:jpg,jpeg,png,webp|max:2048',

            // existing image ids (when editing)
            'existing_image_ids' => 'nullable|array',
            'existing_image_ids.*' => 'integer|exists:product_images,id',

            // primary pointers
            'primary_image_id' => 'nullable|integer',
            'primary_new_index' => 'nullable|integer|min:0',
        ];
    }
}