<?php

namespace Database\Seeders;

use App\Enums\PermissionsEnum;
use App\Enums\RolesEnum;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $userRole = Role::create(['name' => RolesEnum::User->value]); 
        $vendorRole = Role::create(['name' => RolesEnum::Vendor->value]); 
        $adminRole = Role::create(['name' => RolesEnum::Admin->value]); 

        $ApproveVendors = Permission::create([
            'name' => PermissionsEnum::ApproveVendors->value,
        ]);
        $SellProducts = Permission::create([
            'name' => PermissionsEnum::SellProducts->value,
        ]);        
        $BuyProducts = Permission::create([
            'name' => PermissionsEnum::BuyProducts->value,
        ]);

        $userRole->syncPermissions([$BuyProducts]);
        $vendorRole->syncPermissions([$BuyProducts, $SellProducts]);
        $adminRole->syncPermissions([
            $ApproveVendors,
            $SellProducts,
            $BuyProducts
        ]);
        
    }
}