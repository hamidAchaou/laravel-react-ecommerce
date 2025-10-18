<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UserStoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // Or use policies if needed
    }

    public function rules(): array
    {
        return [
            'name'      => ['required', 'string', 'max:255'],
            'email'     => ['required', 'email', 'unique:users,email'],
            'password'  => ['required', 'string', 'min:6'],
            'role'      => ['nullable', 'string', 'in:admin,seller,customer'],
            'is_active' => ['nullable', 'boolean'],
        ];
    }
}