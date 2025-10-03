<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CategoryUpdateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $categoryId = $this->route('category'); // get category id from route

        return [
            'name'      => [
                'required',
                'string',
                'max:255',
                Rule::unique('categories', 'name')->ignore($categoryId),
            ],
            'parent_id' => 'nullable|exists:categories,id',
            'type'      => 'nullable|string|max:255',
            'image'     => 'nullable|string|max:255',
        ];
    }
}