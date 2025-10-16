<?php

namespace App\Repositories;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;

class UserRepository extends BaseRepository
{
    protected function model(): string
    {
        return User::class;
    }

    /**
     * Custom update logic if needed (ex: hashing password).
     */
    public function update(array $data, mixed $id): Model
    {
        $user = $this->findOrFail($id);

        $fields = ['name', 'email', 'role', 'is_active'];

        foreach ($fields as $field) {
            if (isset($data[$field])) {
                $user->{$field} = $data[$field];
            }
        }

        // Handle password if present
        if (!empty($data['password'])) {
            $user->password = bcrypt($data['password']);
        }

        $user->save();

        return $user->refresh();
    }

    /**
     * Secure user creation with hashed password.
     */
    public function create(array $data): Model
    {
        if (isset($data['password'])) {
            $data['password'] = bcrypt($data['password']);
        }

        return parent::create($data);
    }
}