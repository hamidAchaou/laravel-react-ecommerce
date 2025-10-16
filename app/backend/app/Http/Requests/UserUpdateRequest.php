<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UserUpdateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $userId = $this->route('id');

        return [
            'name'      => ['sometimes', 'string', 'max:255'],
            'email'     => ['sometimes', 'email', 'unique:users,email,' . $userId],
            'password'  => ['nullable', 'string', 'min:8'],
            'role'      => ['sometimes', 'string', 'max:50'],
            'is_active' => ['sometimes', 'boolean'],
        ];
    }
}