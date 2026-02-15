<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Spatie\Permission\Models\Permission;

class AdminPermissionController extends Controller
{
    public function index()
    {
        $permission = Permission::get()->groupBy('group_name');
        return Inertia::render('admin/admin_permission', ["permission" => $permission]);
    }

    public function store(Request $request)
    {
        try {
            // 1️⃣ Validation
            $validated = $request->validate([
                'name'       => ['required', 'string', 'max:150', 'unique:permissions,name'],
                'group_name' => ['required', 'string', 'max:100'],
                'guard_name' => ['required', 'string', 'max:50'],
            ]);

            // 2️⃣ Create Permission (transaction safe)
            DB::beginTransaction();

            $permission = Permission::create([
                'name'       => $validated['name'],
                'group_name' => $validated['group_name'],
                'guard_name' => $validated['guard_name'],
            ]);

            // Spatie permission cache reset
            app(\Spatie\Permission\PermissionRegistrar::class)->forgetCachedPermissions();

            DB::commit();
        } catch (ValidationException $e) {
            throw $e;
        } catch (\Throwable $e) {
            DB::rollBack();
        }
    }

    public function update(Request $request, Permission $permission)
    {
        try {
            $validated = $request->validate([
                'name'       => ['required', 'string', 'max:150', 'unique:permissions,name,' . $permission->id],
                'group_name' => ['required', 'string', 'max:100'],
                'guard_name' => ['required', 'string', 'max:50'],
            ]);

            DB::beginTransaction();

            $permission->update([
                'name'       => $validated['name'],
                'group_name' => $validated['group_name'],
                'guard_name' => $validated['guard_name'],
            ]);

            app(\Spatie\Permission\PermissionRegistrar::class)->forgetCachedPermissions();

            DB::commit();

        } catch (ValidationException $e) {
            throw $e;
        } catch (\Throwable $e) {
            DB::rollBack();
        }
    }

    // ✅ DELETE
    public function destroy(Permission $permission)
    {
        try {
            DB::beginTransaction();

            $permission->delete();

            app(\Spatie\Permission\PermissionRegistrar::class)->forgetCachedPermissions();

            DB::commit();

        } catch (\Throwable $e) {
            DB::rollBack();
        }
    }
}
