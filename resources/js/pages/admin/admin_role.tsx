import { Head, useForm, router } from '@inertiajs/react';
import { usePermissions } from 'inertia-permissions';
import { SquarePen, Trash } from 'lucide-react';
import React, { useMemo, useRef, useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import Modal from '@/components/helper/Model';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';

type Permission = { id: number; name: string; group_name: string };

type Role = {
    id: number;
    name: string;
    permissions?: { id: number; name: string }[];
};

type Props = {
    roles?: Role[];
    permissions?: Permission[];
    auth: {
        permissions: string[];
    };
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Roles', href: '/admin/role' },
];

function GroupCheckbox({
    label,
    total,
    selectedCount,
    checked,
    indeterminate,
    onChange,
}: {
    label: string;
    total: number;
    selectedCount: number;
    checked: boolean;
    indeterminate: boolean;
    onChange: () => void;
}) {
    const ref = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        if (!ref.current) return;
        ref.current.indeterminate = indeterminate;
    }, [indeterminate]);

    return (
        <label className="mb-2 flex cursor-pointer items-center justify-between gap-1 rounded-md border border-transparent px-2 py-2 hover:border-slate-200 hover:bg-white dark:hover:border-slate-700 dark:hover:bg-slate-900">
            <div className="flex items-center gap-2">
                <input
                    ref={ref}
                    type="checkbox"
                    checked={checked}
                    onChange={onChange}
                />
                <span className="font-semibold text-slate-800 dark:text-slate-100">
                    {label}
                </span>
            </div>

            <span className="text-xs text-slate-500 dark:text-slate-400">
                {selectedCount}/{total}
            </span>
        </label>
    );
}

export default function AdminRoles({
    roles = [],
    permissions = [],
    auth,
}: Props) {
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [editingRole, setEditingRole] = useState<Role | null>(null);

    // ✅ Group permissions
    const groupedPermissions = useMemo(() => {
        return (permissions ?? []).reduce<Record<string, Permission[]>>(
            (acc, p) => {
                acc[p.group_name] = acc[p.group_name] || [];
                acc[p.group_name].push(p);
                return acc;
            },
            {},
        );
    }, [permissions]);

    const getGroupIds = (group: string) =>
        (groupedPermissions[group] ?? []).map((p) => p.id);

    const groupStats = (selectedIds: number[], group: string) => {
        const ids = getGroupIds(group);
        const set = new Set(selectedIds);
        const selectedCount = ids.reduce(
            (c, id) => c + (set.has(id) ? 1 : 0),
            0,
        );
        const total = ids.length;

        return {
            ids,
            total,
            selectedCount,
            checked: total > 0 && selectedCount === total,
            indeterminate: selectedCount > 0 && selectedCount < total,
        };
    };

    const toggleGroup = (
        selectedIds: number[],
        group: string,
        setSelected: (next: number[]) => void,
    ) => {
        const { ids, checked } = groupStats(selectedIds, group);
        const selectedSet = new Set(selectedIds);

        if (checked) {
            // unselect all group
            const next = selectedIds.filter((id) => !ids.includes(id));
            setSelected(next);
            return;
        }

        // select all group
        ids.forEach((id) => selectedSet.add(id));
        setSelected(Array.from(selectedSet));
    };

    // ✅ Inputs (dark mode friendly)
    const inputClass =
        'w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none ' +
        'focus:border-sky-500 focus:ring-2 focus:ring-sky-500 ' +
        'dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100';

    const permissionsBoxClass =
        'max-h-[55vh] overflow-auto rounded-lg border border-slate-200 bg-slate-50 p-3 ' +
        'dark:border-slate-700 dark:bg-slate-950';

    // ✅ Create form
    const {
        data: createData,
        setData: setCreateData,
        post,
        reset: resetCreate,
        processing: creating,
        errors: createErrors,
        clearErrors: clearCreateErrors,
    } = useForm<{ name: string; permissions: number[] }>({
        name: '',
        permissions: [],
    });

    const toggleCreatePermission = (id: number) => {
        setCreateData(
            'permissions',
            createData.permissions.includes(id)
                ? createData.permissions.filter((x) => x !== id)
                : [...createData.permissions, id],
        );
    };

    const openCreate = () => {
        clearCreateErrors();
        setIsCreateOpen(true);
    };

    const closeCreate = () => {
        setIsCreateOpen(false);
        resetCreate();
        clearCreateErrors();
    };

    const submitCreate = (e: React.FormEvent) => {
        e.preventDefault();

        post(route('admin.role.store'), {
            preserveScroll: true,
            onSuccess: () => {
                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: 'Role created successfully',
                    showConfirmButton: false,
                    timer: 1200,
                });
                closeCreate();
            },
            onError: (errors) => {
                const firstError = Object.values(errors)[0];
                if (firstError)
                    Swal.fire({ icon: 'error', text: String(firstError) });
            },
        });
    };

    // ✅ Edit form
    const {
        data: editData,
        setData: setEditData,
        put,
        reset: resetEdit,
        processing: updating,
        errors: editErrors,
        clearErrors: clearEditErrors,
    } = useForm<{ name: string; permissions: number[] }>({
        name: '',
        permissions: [],
    });

    const openEdit = (role: Role) => {
        setEditingRole(role);
        clearEditErrors();

        const permissionIds = (role.permissions ?? []).map((p) => p.id);

        setEditData({
            name: role.name ?? '',
            permissions: permissionIds,
        });

        setIsEditOpen(true);
    };

    const closeEdit = () => {
        setIsEditOpen(false);
        setEditingRole(null);
        resetEdit();
        clearEditErrors();
    };

    const toggleEditPermission = (id: number) => {
        setEditData(
            'permissions',
            editData.permissions.includes(id)
                ? editData.permissions.filter((x) => x !== id)
                : [...editData.permissions, id],
        );
    };

    const submitEdit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingRole) return;

        put(route('admin.role.update', editingRole.id), {
            preserveScroll: true,
            onSuccess: () => {
                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: 'Role updated successfully',
                    showConfirmButton: false,
                    timer: 1200,
                });
                closeEdit();
            },
            onError: (errors) => {
                const firstError = Object.values(errors)[0];
                if (firstError)
                    Swal.fire({ icon: 'error', text: String(firstError) });
            },
        });
    };

    // ✅ Delete
    const handleDelete = async (role: Role) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: `Delete role: ${role.name}?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!',
        });

        if (!result.isConfirmed) return;

        router.delete(route('admin.role.destroy', role.id), {
            preserveScroll: true,
            onSuccess: () => {
                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: 'Role deleted successfully',
                    showConfirmButton: false,
                    timer: 1200,
                });
            },
            onError: (errors) => {
                const firstError = Object.values(errors)[0];
                if (firstError)
                    Swal.fire({ icon: 'error', text: String(firstError) });
            },
        });
    };

    const { canAny } = usePermissions();

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Roles" />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
                        Roles
                    </h1>

                    {auth.permissions.includes('admin.role.store') && (
                        <button
                            type="button"
                            onClick={openCreate}
                            className="skBtnShadow text-orange-500 rounded-md font-bold cursor-pointer px-4 py-2"
                        >
                            + Create Role
                        </button>
                    )}
                </div>

                {/* Table Card */}
                <div className="overflow-hidden rounded-xl skShadow">
                    <div className="border-b border-slate-200 px-5 py-3 font-semibold text-slate-800 dark:border-slate-700 dark:text-slate-100">
                        Roles List
                    </div>

                    <div className="overflow-x-auto p-4">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="border-b border-slate-200 text-left dark:border-slate-700">
                                    <th className="px-3 py-2 text-sm font-semibold text-slate-600 dark:text-slate-300">
                                        Role Name
                                    </th>
                                    <th className="px-3 py-2 text-sm font-semibold text-slate-600 dark:text-slate-300">
                                        Permissions
                                    </th>
                                    {canAny([
                                        'admin.role.update',
                                        'admin.role.destroy',
                                    ]) && (
                                        <th className="px-3 py-2 text-right text-sm font-semibold text-slate-600 dark:text-slate-300">
                                            Actions
                                        </th>
                                    )}
                                </tr>
                            </thead>

                            <tbody>
                                {roles.map((role) => (
                                    <tr
                                        key={role.id}
                                        className="border-b border-slate-200 last:border-b-0 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
                                    >
                                        <td className="min-w-[200px] px-3 py-3 font-medium text-slate-800 dark:text-slate-100">
                                            {role.name}
                                        </td>

                                        <td className="px-3 py-3">
                                            {role.permissions &&
                                            role.permissions.length > 0 ? (
                                                <div className="flex flex-wrap gap-2">
                                                    {role.permissions.map(
                                                        (p) => (
                                                            <span
                                                                key={p.id}
                                                                className="rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-xs font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
                                                            >
                                                                {p.name}
                                                            </span>
                                                        ),
                                                    )}
                                                </div>
                                            ) : (
                                                <span className="text-sm text-slate-500 dark:text-slate-400">
                                                    No permissions
                                                </span>
                                            )}
                                        </td>
                                        {canAny([
                                            'admin.role.update',
                                            'admin.role.destroy',
                                        ]) && (
                                            <td className="px-3 py-3">
                                                <div className="flex justify-end gap-2">
                                                    {auth.permissions.includes(
                                                        'admin.role.update',
                                                    ) && (
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                openEdit(role)
                                                            }
                                                            className="inline-flex cursor-pointer items-center justify-center rounded-md p-2 text-orange-500 hover:text-orange-600"
                                                            aria-label="Edit role"
                                                            title="Edit"
                                                        >
                                                            <SquarePen />
                                                        </button>
                                                    )}

                                                    {auth.permissions.includes(
                                                        'admin.role.destroy',
                                                    ) && (
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handleDelete(
                                                                    role,
                                                                )
                                                            }
                                                            className="inline-flex cursor-pointer items-center justify-center rounded-md text-red-500 hover:text-red-600"
                                                            aria-label="Delete role"
                                                            title="Delete"
                                                        >
                                                            <Trash />
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        )}
                                    </tr>
                                ))}

                                {roles.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan={3}
                                            className="px-3 py-6 text-slate-500 dark:text-slate-400"
                                        >
                                            No roles found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* ✅ CREATE ROLE MODAL */}
            <Modal
                isOpen={isCreateOpen}
                onClose={closeCreate}
                title="Create Role"
                width="w-[95%] md:w-[80%] xl:w-[70%] 2xl:w-[55%]"
            >
                <hr className="mb-3 border-slate-200 dark:border-slate-700" />

                <form onSubmit={submitCreate} className="space-y-4">
                    <div>
                        <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">
                            Role Name
                        </label>
                        <input
                            type="text"
                            value={createData.name}
                            onChange={(e) =>
                                setCreateData('name', e.target.value)
                            }
                            className={inputClass}
                            placeholder="Super Admin"
                        />
                        {createErrors.name && (
                            <div className="mt-1 text-sm text-red-500">
                                {createErrors.name}
                            </div>
                        )}
                    </div>

                    <div className="space-y-3">
                        <div className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                            Permissions
                        </div>

                        <div className={permissionsBoxClass}>
                            {Object.entries(groupedPermissions).map(
                                ([group, perms]) => {
                                    const stats = groupStats(
                                        createData.permissions,
                                        group,
                                    );

                                    return (
                                        <div
                                            key={group}
                                            className="mb-4 grid grid-cols-2 gap-2 border-b last:mb-0"
                                        >
                                            <div className="flex">
                                                <GroupCheckbox
                                                    label={group}
                                                    total={stats.total}
                                                    selectedCount={
                                                        stats.selectedCount
                                                    }
                                                    checked={stats.checked}
                                                    indeterminate={
                                                        stats.indeterminate
                                                    }
                                                    onChange={() =>
                                                        toggleGroup(
                                                            createData.permissions,
                                                            group,
                                                            (next) =>
                                                                setCreateData(
                                                                    'permissions',
                                                                    next,
                                                                ),
                                                        )
                                                    }
                                                />
                                            </div>

                                            <div className="">
                                                {perms.map((p) => (
                                                    <label
                                                        key={p.id}
                                                        className="flex items-center gap-2 rounded-md border border-transparent px-2 py-2 text-sm hover:border-slate-200 hover:bg-white dark:hover:border-slate-700 dark:hover:bg-slate-900"
                                                    >
                                                        <input
                                                            type="checkbox"
                                                            checked={createData.permissions.includes(
                                                                p.id,
                                                            )}
                                                            onChange={() =>
                                                                toggleCreatePermission(
                                                                    p.id,
                                                                )
                                                            }
                                                        />
                                                        <span className="text-slate-700 dark:text-slate-200">
                                                            {p.name}
                                                        </span>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                    );
                                },
                            )}
                        </div>

                        {createErrors.permissions && (
                            <div className="text-sm text-red-500">
                                {createErrors.permissions}
                            </div>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={creating}
                        className="w-full rounded-md bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
                    >
                        Create
                    </button>
                </form>
            </Modal>

            {/* ✅ EDIT ROLE MODAL */}
            <Modal
                isOpen={isEditOpen}
                onClose={closeEdit}
                title="Edit Role"
                width="w-[95%] md:w-[80%] xl:w-[70%] 2xl:w-[55%]"
            >
                <hr className="mb-3 border-slate-200 dark:border-slate-700" />

                <form onSubmit={submitEdit} className="space-y-4">
                    <div>
                        <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">
                            Role Name
                        </label>
                        <input
                            type="text"
                            value={editData.name}
                            onChange={(e) =>
                                setEditData('name', e.target.value)
                            }
                            className={inputClass}
                            placeholder="Role name"
                        />
                        {editErrors.name && (
                            <div className="mt-1 text-sm text-red-500">
                                {editErrors.name}
                            </div>
                        )}
                    </div>

                    <div className="space-y-3">
                        <div className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                            Permissions
                        </div>

                        <div className={permissionsBoxClass}>
                            {Object.entries(groupedPermissions).map(
                                ([group, perms]) => {
                                    const stats = groupStats(
                                        editData.permissions,
                                        group,
                                    );

                                    return (
                                        <div
                                            key={group}
                                            className="mb-4 grid grid-cols-2 gap-2 border-b last:mb-0"
                                        >
                                            <div className="flex">
                                                <GroupCheckbox
                                                    label={group}
                                                    total={stats.total}
                                                    selectedCount={
                                                        stats.selectedCount
                                                    }
                                                    checked={stats.checked}
                                                    indeterminate={
                                                        stats.indeterminate
                                                    }
                                                    onChange={() =>
                                                        toggleGroup(
                                                            editData.permissions,
                                                            group,
                                                            (next) =>
                                                                setEditData(
                                                                    'permissions',
                                                                    next,
                                                                ),
                                                        )
                                                    }
                                                />
                                            </div>

                                            <div className="">
                                                {perms.map((p) => (
                                                    <label
                                                        key={p.id}
                                                        className="flex items-center gap-2 rounded-md border border-transparent px-2 py-2 text-sm hover:border-slate-200 hover:bg-white dark:hover:border-slate-700 dark:hover:bg-slate-900"
                                                    >
                                                        <input
                                                            type="checkbox"
                                                            checked={editData.permissions.includes(
                                                                p.id,
                                                            )}
                                                            onChange={() =>
                                                                toggleEditPermission(
                                                                    p.id,
                                                                )
                                                            }
                                                        />
                                                        <span className="text-slate-700 dark:text-slate-200">
                                                            {p.name}
                                                        </span>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                    );
                                },
                            )}
                        </div>

                        {editErrors.permissions && (
                            <div className="text-sm text-red-500">
                                {editErrors.permissions}
                            </div>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={updating}
                        className="w-full rounded-md bg-amber-600 px-5 py-2 text-sm font-semibold text-white hover:bg-amber-700 disabled:opacity-60"
                    >
                        Update
                    </button>
                </form>
            </Modal>
        </AppLayout>
    );
}
