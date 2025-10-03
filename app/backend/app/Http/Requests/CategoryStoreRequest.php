<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CategoryStoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // set to true to allow all authenticated users
    }

    public function rules(): array
    {
        return [
            'name'      => 'required|string|max:255|unique:categories,name',
            'parent_id' => 'nullable|exists:categories,id',
            'type'      => 'nullable|string|max:255',
            'image'     => 'nullable|string|max:255',
        ];
    }
}