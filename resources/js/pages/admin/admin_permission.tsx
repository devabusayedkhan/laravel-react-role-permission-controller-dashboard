import { Head, router, useForm } from '@inertiajs/react';
import { SquarePen, Trash } from 'lucide-react';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import Modal from '@/components/helper/Model';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Permission', href: '/admin/permission' },
];

type PermissionItem = {
    id: number;
    name: string;
    group_name: string;
    guard_name: string;
};

type GroupedPermissions = Record<string, PermissionItem[]>;

type Props = {
    permission?: GroupedPermissions;
    auth: {
        permissions: string[];
    };
};

export default function AdminRoles({ permission, auth }: Props) {
    const [
        isUserPermissionCreateModalOpen,
        setIsUserPermissionCreateModalOpen,
    ] = useState(false);

    // ✅ Edit modal state
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingPermission, setEditingPermission] =
        useState<PermissionItem | null>(null);

    // ✅ Create Form
    const {
        data,
        setData,
        post,
        reset: resetCreate,
    } = useForm({
        name: '',
        group_name: '',
        guard_name: 'web',
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        post(route('admin.permission.store'), {
            preserveScroll: true,

            onSuccess: () => {
                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: 'New Permission create Successfully',
                    showConfirmButton: false,
                    timer: 1500,
                });

                setIsUserPermissionCreateModalOpen(false);
                resetCreate();
            },

            onError: (errors) => {
                const firstError = Object.values(errors)[0];
                Swal.fire({ icon: 'error', text: String(firstError) });
            },
        });
    };

    // ✅ Edit Form
    const {
        data: editData,
        setData: setEditData,
        put,
        reset: resetEdit,
        clearErrors: clearEditErrors,
    } = useForm({
        name: '',
        group_name: '',
        guard_name: 'web',
    });

    useEffect(() => {
        if (editingPermission) {
            setEditData({
                name: editingPermission.name ?? '',
                group_name: editingPermission.group_name ?? '',
                guard_name: editingPermission.guard_name ?? 'web',
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [editingPermission]);

    const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setEditData((prev) => ({ ...prev, [name]: value }));
    };

    const openEditModal = (perm: PermissionItem) => {
        setEditingPermission(perm);
        clearEditErrors();
        setIsEditModalOpen(true);
    };

    const closeEditModal = () => {
        setIsEditModalOpen(false);
        setEditingPermission(null);
        resetEdit();
        clearEditErrors();
    };

    const handleEditSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingPermission) return;

        put(route('admin.permission.update', editingPermission.id), {
            preserveScroll: true,

            onSuccess: () => {
                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: 'Permission updated successfully',
                    showConfirmButton: false,
                    timer: 1500,
                });
                closeEditModal();
            },

            onError: (errors) => {
                const firstError = Object.values(errors)[0];
                Swal.fire({ icon: 'error', text: String(firstError) });
            },
        });
    };

    // ✅ Delete
    const handleDelete = async (perm: PermissionItem) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: `Delete permission: ${perm.name}?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!',
        });

        if (!result.isConfirmed) return;

        router.delete(route('admin.permission.destroy', perm.id), {
            preserveScroll: true,

            onSuccess: () => {
                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: 'Permission deleted successfully',
                    showConfirmButton: false,
                    timer: 1200,
                });
            },

            onError: (errors) => {
                const firstError = Object.values(errors)[0];
                Swal.fire({ icon: 'error', text: String(firstError) });
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Roles" />

            <div className="m-5 flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                {/* Card Header Bar */}
                <div className="flex justify-between">
                    <h2 className="font-semibold">All Permissions</h2>
                    {auth.permissions.includes('admin.permission.store') && (
                        <button
                            className="skBtnShadow text-orange-500 rounded-md font-bold cursor-pointer px-4 py-2"
                            onClick={() =>
                                setIsUserPermissionCreateModalOpen(true)
                            }
                        >
                            + Add Permission
                        </button>
                    )}
                </div>

                {/* Card Body */}
                <div className="p-6 overflow-hidden rounded-xl skShadow">
                    <table className="w-full border-collapse">
                        <tbody>
                            {Object.entries(permission ?? {}).map(
                                ([groupName, permissions]) => (
                                    <tr
                                        key={groupName}
                                        className="border-b border-slate-200 align-middle"
                                    >
                                        <td className="w-64 pt-1 pr-6">
                                            <span className="font-semibold">
                                                {groupName}
                                            </span>
                                        </td>

                                        <td className="pt-1 pb-3">
                                            <div className="mt-3 grid grid-cols-1 gap-4">
                                                {permissions.map((perm) => (
                                                    <div
                                                        key={perm.id}
                                                        className="grid grid-cols-2"
                                                    >
                                                        <span className="border-b border-gray-100">
                                                            {perm.name}
                                                        </span>

                                                        {/* ✅ Edit */}
                                                        <div>
                                                            {auth.permissions.includes(
                                                                'admin.permission.update',
                                                            )&&(

                                                                <button
                                                                type="button"
                                                                className="ml-2 cursor-pointer text-orange-500 hover:text-orange-600"
                                                                onClick={() =>
                                                                    openEditModal(
                                                                        perm,
                                                                    )
                                                                }
                                                                >
                                                                <SquarePen />
                                                            </button>
                                                            )}

                                                            {/* ✅ Delete */}
                                                            {auth.permissions.includes(
                                                                'admin.permission.destroy',
                                                            ) && (
                                                                <button
                                                                    type="button"
                                                                    className="ml-2 cursor-pointer text-red-500 hover:text-red-600"
                                                                    onClick={() =>
                                                                        handleDelete(
                                                                            perm,
                                                                        )
                                                                    }
                                                                >
                                                                    <Trash />
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </td>
                                    </tr>
                                ),
                            )}

                            {Object.keys(permission ?? {}).length === 0 && (
                                <tr>
                                    <td
                                        colSpan={2}
                                        className="py-6 text-slate-500"
                                    >
                                        No permissions found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <Modal
                isOpen={isUserPermissionCreateModalOpen}
                onClose={() => setIsUserPermissionCreateModalOpen(false)}
                title="Create a new Permissions"
                width="w-[90%] md:w-[80%] xl:w-[70%] 2xl:w-[50%]"
            >
                <hr className="mb-2 border-gray-500" />

                <form onSubmit={handleSubmit}>
                    <div className="mb-2">
                        <label className="mb-1 block text-sm font-medium text-slate-700">
                            Name
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={data?.name}
                            placeholder="admin.user.view"
                            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500"
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="mb-2">
                        <label className="mb-1 block text-sm font-medium text-slate-700">
                            Group Name
                        </label>
                        <input
                            type="text"
                            name="group_name"
                            value={data?.group_name}
                            placeholder="Admin"
                            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500"
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="mb-2">
                        <label className="mb-1 block text-sm font-medium text-slate-700">
                            Guard Name
                        </label>
                        <input
                            type="text"
                            name="guard_name"
                            value={data?.guard_name}
                            placeholder="web"
                            className="w-full rounded-md border border-slate-300 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500"
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button
                            type="submit"
                            className="skBtnShadow w-full cursor-pointer rounded-md px-5 py-2 font-bold text-orange-500"
                        >
                            Create
                        </button>
                    </div>
                </form>
            </Modal>

            <Modal
                isOpen={isEditModalOpen}
                onClose={closeEditModal}
                title="Edit Permission"
                width="w-[90%] md:w-[80%] xl:w-[70%] 2xl:w-[50%]"
            >
                <hr className="mb-2 border-gray-500" />

                <form onSubmit={handleEditSubmit}>
                    <div className="mb-2">
                        <label className="mb-1 block text-sm font-medium text-slate-700">
                            Name
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={editData?.name}
                            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500"
                            onChange={handleEditInputChange}
                        />
                    </div>

                    <div className="mb-2">
                        <label className="mb-1 block text-sm font-medium text-slate-700">
                            Group Name
                        </label>
                        <input
                            type="text"
                            name="group_name"
                            value={editData?.group_name}
                            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500"
                            onChange={handleEditInputChange}
                        />
                    </div>

                    <div className="mb-2">
                        <label className="mb-1 block text-sm font-medium text-slate-700">
                            Guard Name
                        </label>
                        <input
                            type="text"
                            name="guard_name"
                            value={editData?.guard_name}
                            className="w-full rounded-md border border-slate-300 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500"
                            onChange={handleEditInputChange}
                        />
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button
                            type="submit"
                            className="skBtnShadow w-full cursor-pointer rounded-md px-5 py-2 font-bold text-orange-500"
                        >
                            Update
                        </button>
                    </div>
                </form>
            </Modal>
        </AppLayout>
    );
}
