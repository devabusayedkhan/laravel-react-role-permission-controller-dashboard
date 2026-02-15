<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class AdminRoleController extends Controller
{
    public function index()
    {
        $roles = Role::query()
            ->with(['permissions:id,name'])
            ->latest()
            ->get(['id', 'name']);

        $permissions = Permission::query()
            ->orderBy('group_name')
            ->orderBy('name')
            ->get(['id', 'name', 'group_name']);

        return Inertia::render('admin/admin_role', [
            'roles' => $roles,
            'permissions' => $permissions,
        ]);
    }



    public function store(Request $request)
    {
        try {
            // ✅ Validation
            $validated = $request->validate([
                'name' => ['required', 'string', 'max:150', 'unique:roles,name'],
                'permissions' => ['nullable', 'array'],
                'permissions.*' => ['integer', 'exists:permissions,id'],
            ]);

            DB::beginTransaction();

            // ✅ Create role
            $role = Role::create([
                'name' => $validated['name'],
                'guard_name' => 'web',
            ]);

            // ✅ Sync permissions
            $role->syncPermissions($validated['permissions'] ?? []);

            // ✅ Clear Spatie cache
            app(\Spatie\Permission\PermissionRegistrar::class)->forgetCachedPermissions();

            DB::commit();

            // ✅ Inertia-friendly response (Modal safe)
            return redirect()->back()->with('success', 'Role created successfully.');
        } catch (ValidationException $e) {
            // 🔁 Let Inertia handle validation errors
            throw $e;
        } catch (\Throwable $e) {
            DB::rollBack();

            report($e); // logs for production

            return redirect()
                ->back()
                ->with('error', 'Something went wrong. Please try again.');
        }
    }

    public function update(Request $request, Role $role)
    {
        try {
            $validated = $request->validate([
                'name' => ['required', 'string', 'max:150', 'unique:roles,name,' . $role->id],
                'permissions' => ['nullable', 'array'],
                'permissions.*' => ['integer', 'exists:permissions,id'],
            ]);

            DB::beginTransaction();

            $role->update([
                'name' => $validated['name'],
            ]);

            $role->syncPermissions($validated['permissions'] ?? []);

            app(\Spatie\Permission\PermissionRegistrar::class)->forgetCachedPermissions();

            DB::commit();

            return redirect()->back()->with('success', 'Role updated successfully.');
        } catch (ValidationException $e) {
            throw $e;
        } catch (\Throwable $e) {
            DB::rollBack();

            report($e);

            return redirect()
                ->back()
                ->with('error', 'Something went wrong. Please try again.');
        }
    }


    public function destroy(Role $role)
    {
        try {
            DB::beginTransaction();

            $role->delete();

            app(\Spatie\Permission\PermissionRegistrar::class)->forgetCachedPermissions();

            DB::commit();

            return redirect()->back()->with('success', 'Role deleted successfully.');
        } catch (\Throwable $e) {
            DB::rollBack();

            report($e);

            return redirect()
                ->back()
                ->with('error', 'Something went wrong. Please try again.');
        }
    }
}
