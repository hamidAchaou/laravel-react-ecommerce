<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ClientStoreRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'user_id'    => ['required', 'exists:users,id'],
            'phone'      => ['required', 'string', 'max:20'],
            'address'    => ['nullable', 'string', 'max:255'],
            'country_id' => ['required', 'exists:countries,id'],
            'city_id'    => ['required', 'exists:cities,id'],
        ];
    }
}