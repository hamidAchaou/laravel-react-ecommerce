<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $admin = User::create([
            'name' => 'Admin',
            'email' => 'admin@gmail.com',
            'password' => Hash::make('admin'), 
        ]);
        $admin->assignRole('admin');

        $seller = User::create([
            'name' => 'Seller',
            'email' => 'seller@gmail.com',
            'password' => Hash::make('seller'),
        ]);
        $seller->assignRole('seller');

        $customer = User::create([
            'name' => 'Customer',
            'email' => 'customer@gmail.com',
            'password' => Hash::make('customer'),
        ]);
        $customer->assignRole('customer');
    }
}