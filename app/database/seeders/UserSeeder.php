<?php

namespace Database\Seeders;

use App\Enums\RolesEnum;
use App\Models\User;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Admin User
        $admin = User::create([
            'name' => 'Admin',
            'email' => 'admin@example.com',
            'password' => bcrypt('Admin'),
        ]);
        $admin->assignRole(RolesEnum::Admin->value);

        // Vendor User
        $vendor = User::create([
            'name' => 'Vendor',
            'email' => 'vendor@example.com',
            'password' => bcrypt('Vendor'),
        ]);
        $vendor->assignRole(RolesEnum::Vendor->value);

        // Normal User
        $user = User::create([
            'name' => 'User',
            'email' => 'user@example.com',
            'password' => bcrypt('User'),
        ]);
        $user->assignRole(RolesEnum::User->value);
    }
}