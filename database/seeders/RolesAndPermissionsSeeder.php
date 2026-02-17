<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\PermissionRegistrar;

class RolesAndPermissionsSeeder extends Seeder
{
    public function run(): void
    {
        app(PermissionRegistrar::class)->forgetCachedPermissions();

        $permissions = [
            // User Management
            'admin.users',
            'admin.user.store',
            'admin.user.update',
            'admin.user.destroy',

            // Role Management
            'admin.roles',
            'admin.role.store',
            'admin.role.update',
            'admin.role.destroy',

            // Permission Management
            'admin.permissions',
            'admin.permission.store',
            'admin.permission.update',
            'admin.permission.destroy',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate([
                'name' => $permission,
                'guard_name' => 'web'
            ]);
        }

        // Roles
        $admin      = Role::firstOrCreate(['name' => 'admin']);
        $user       = Role::firstOrCreate(['name' => 'user']);

        // Super Admin gets everything
        $admin->syncPermissions(Permission::all());

        // Normal user (no admin access)
        $user->syncPermissions([]);
    }
}
