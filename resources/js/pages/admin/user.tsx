import { Head, router, useForm } from '@inertiajs/react';
import { usePermissions } from 'inertia-permissions';
import { SquarePen, Trash } from 'lucide-react';
import React, { useRef, useState } from 'react';
import Swal from 'sweetalert2';
import Modal from '@/components/helper/Model';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';

/** -------------------- Types -------------------- */
type Role = { id: number; name: string };

type UserRow = {
  id: number;
  name: string;
  email: string;
  created_at: string;
  role: string | null;
};

type PaginationLink = {
  url: string | null;
  label: string;
  active: boolean;
};

type PaginatedUsers = {
  data: UserRow[];
  links: PaginationLink[];
  meta?: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
};

type Props = {
  users: PaginatedUsers; // ✅ paginator now
  roles: Role[];
  filters?: { q?: string };
  auth: { permissions: string[] };
};

type UserFormData = {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  role: string;
};

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Dashboard', href: dashboard().url },
  { title: 'Users', href: '#' },
];

const INDEX_ROUTE = 'admin.users';

const showFirstError = (errors: Record<string, string>) => {
  const firstKey = Object.keys(errors)[0];
  const firstMsg = firstKey ? errors[firstKey] : 'Something went wrong';
  Swal.fire({ icon: 'error', title: 'Action failed', text: firstMsg });
};

function RoleSelect({
  roles,
  value,
  onChange,
  error,
  label = 'Role',
}: {
  roles: Role[];
  value: string;
  onChange: (val: string) => void;
  error?: string;
  label?: string;
}) {
  return (
    <div>
      <label className="text-sm font-semibold">{label}</label>

      <select
        className="mt-1 w-full rounded border px-3 py-2 dark:bg-slate-800"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">Select role</option>
        {roles.map((r) => (
          <option key={r.id} value={r.name}>
            {r.name}
          </option>
        ))}
      </select>

      {error && <div className="mt-1 text-sm text-red-600">{error}</div>}
    </div>
  );
}

function Pagination({ links }: { links: PaginationLink[] }) {
  if (!links?.length) return null;

  return (
    <div className="mt-4 flex flex-wrap justify-end gap-1">
      {links.map((link, idx) => (
        <button
          key={idx}
          disabled={!link.url}
          onClick={() => {
            if (!link.url) return;
            router.get(link.url, {}, { preserveScroll: true, preserveState: true });
          }}
          className={[
            'rounded border px-3 py-1 text-sm',
            link.active
              ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
              : 'bg-white dark:bg-slate-800',
            !link.url ? 'cursor-not-allowed opacity-50' : 'hover:bg-slate-50 dark:hover:bg-slate-700',
          ].join(' ')}
          dangerouslySetInnerHTML={{ __html: link.label }}
        />
      ))}
    </div>
  );
}

/** -------------------- Page -------------------- */
export default function AdminUsersPage({ users, roles, auth, filters }: Props) {
  const { canAny } = usePermissions();

  // ---------- Modal State ----------
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserRow | null>(null);

  // ---------- Search State ----------
  const [search, setSearch] = useState(filters?.q ?? '');
  const debounceRef = useRef<number | null>(null);

  const runSearch = (q: string) => {
    // ✅ search change হলেই request যাবে
    // ✅ page reset করার জন্য url-এ page param পাঠাচ্ছি না (Laravel default page 1)
    router.get(
      route(INDEX_ROUTE),
      { q: q?.trim() ? q.trim() : undefined },
      {
        preserveState: true,
        preserveScroll: true,
        replace: true,
        only: ['users', 'filters'], // ✅ fast & clean (optional)
      },
    );
  };

  const onSearchChange = (val: string) => {
    setSearch(val);

    // ✅ debounce (typing করলে একসাথে অনেক request যাবে না)
    if (debounceRef.current) window.clearTimeout(debounceRef.current);

    debounceRef.current = window.setTimeout(() => {
      runSearch(val);
    }, 350);
  };

  // ---------- Forms ----------
  const createForm = useForm<UserFormData>({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    role: '',
  });

  const editForm = useForm<UserFormData>({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    role: '',
  });

  const openCreate = () => {
    createForm.reset();
    createForm.clearErrors();
    setCreateOpen(true);
  };

  const openEdit = (u: UserRow) => {
    setSelectedUser(u);
    editForm.setData({
      name: u.name,
      email: u.email,
      password: '',
      password_confirmation: '',
      role: u.role ?? '',
    });
    editForm.clearErrors();
    setEditOpen(true);
  };

  const closeCreate = () => {
    setCreateOpen(false);
    createForm.clearErrors();
  };

  const closeEdit = () => {
    setEditOpen(false);
    setSelectedUser(null);
    editForm.clearErrors();
  };

  // ---------- Submit Handlers ----------
  const submitCreate = (e: React.FormEvent) => {
    e.preventDefault();

    if (!createForm.data.role) {
      createForm.setError('role', 'Role is required');
      Swal.fire({ icon: 'warning', title: 'Role is required' });
      return;
    }

    createForm.post(route('admin.user.store'), {
      preserveScroll: true,

      onStart: () => {
        Swal.fire({
          title: 'Creating user...',
          allowOutsideClick: false,
          didOpen: () => Swal.showLoading(),
        });
      },

      onSuccess: () => {
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'User created successfully',
          showConfirmButton: false,
          timer: 1200,
        });
        setCreateOpen(false);
        createForm.reset();

        // ✅ create এর পরে current search বজায় রেখে তালিকা রিফ্রেশ
        runSearch(search);
      },

      onError: (errors) => {
        Swal.close();
        showFirstError(errors);
      },
    });
  };

  const submitEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;

    if (!editForm.data.role) {
      editForm.setError('role', 'Role is required');
      Swal.fire({ icon: 'warning', title: 'Role is required' });
      return;
    }

    editForm.put(route('admin.user.update', { user: selectedUser.id }), {
      preserveScroll: true,

      onStart: () => {
        Swal.fire({
          title: 'Updating user...',
          allowOutsideClick: false,
          didOpen: () => Swal.showLoading(),
        });
      },

      onSuccess: () => {
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'User updated successfully',
          showConfirmButton: false,
          timer: 1200,
        });
        setEditOpen(false);
        setSelectedUser(null);
        editForm.reset();

        // ✅ update এর পরে current search বজায় রেখে তালিকা রিফ্রেশ
        runSearch(search);
      },

      onError: (errors) => {
        Swal.close();
        showFirstError(errors);
      },
    });
  };

  const confirmDelete = async (u: UserRow) => {
    const res = await Swal.fire({
      icon: 'warning',
      title: 'Delete user?',
      text: `This will permanently delete "${u.name}".`,
      showCancelButton: true,
      confirmButtonText: 'Yes, delete',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#dc2626',
    });

    if (!res.isConfirmed) return;

    router.delete(route('admin.user.destroy', { user: u.id }), {
      preserveScroll: true,

      onStart: () => {
        Swal.fire({
          title: 'Deleting user...',
          allowOutsideClick: false,
          didOpen: () => Swal.showLoading(),
        });
      },

      onSuccess: () => {
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'User deleted',
          showConfirmButton: false,
          timer: 1200,
        });

        // ✅ delete এর পরে current search বজায় রেখে তালিকা রিফ্রেশ
        runSearch(search);
      },

      onError: (errors) => {
        Swal.close();
        const msg =
          errors && Object.keys(errors).length
            ? (Object.values(errors)[0] as string)
            : 'Delete failed (permission or server error).';

        Swal.fire({ icon: 'error', title: 'Delete failed', text: msg });
      },
    });
  };

  const canShowActions = canAny(['admin.user.update', 'admin.user.destroy']);

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Users" />

      <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
        {/* Header */}
        <div className="flex items-center justify-between gap-3">
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
            Users
          </h1>

            <input
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search by name or email..."
              className="w-95 rounded-md border-2 px-3 py-2 border-orange-500 outline-0"
            />

          <div className="flex items-center gap-2">

            {auth.permissions.includes('admin.user.store') && (
              <button
                onClick={openCreate}
                className="skBtnShadow cursor-pointer rounded-md px-4 py-2 font-bold text-orange-500"
              >
                + Add User
              </button>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-xl skShadow">
          <div className="border-b px-5 py-3 font-semibold text-slate-800 dark:text-slate-100">
            Users List
          </div>

          <div className="overflow-x-auto p-4">
            {users.data.length === 0 ? (
              <div className="text-slate-600 dark:text-slate-300">No users found.</div>
            ) : (
              <>
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b text-left">
                      <th className="px-3 py-2 text-sm font-semibold text-slate-600 dark:text-slate-300">
                        Name
                      </th>
                      <th className="px-3 py-2 text-sm font-semibold text-slate-600 dark:text-slate-300">
                        Email
                      </th>
                      <th className="px-3 py-2 text-sm font-semibold text-slate-600 dark:text-slate-300">
                        Role
                      </th>
                      <th className="px-3 py-2 text-sm font-semibold text-slate-600 dark:text-slate-300">
                        Created
                      </th>

                      {canShowActions && (
                        <th className="px-3 py-2 text-right text-sm font-semibold text-slate-600 dark:text-slate-300">
                          Actions
                        </th>
                      )}
                    </tr>
                  </thead>

                  <tbody>
                    {users.data.map((u) => (
                      <tr
                        key={u.id}
                        className="border-b last:border-b-0 hover:bg-slate-50 dark:hover:bg-slate-800"
                      >
                        <td className="px-3 py-3 font-medium text-slate-800 dark:text-slate-100">
                          {u.name}
                        </td>

                        <td className="px-3 py-3 text-slate-600 dark:text-slate-300">
                          {u.email}
                        </td>

                        <td className="px-3 py-3 text-orange-500">{u.role ?? '—'}</td>

                        <td className="px-3 py-3 text-slate-600 dark:text-slate-300">
                          {new Date(u.created_at).toLocaleDateString()}
                        </td>

                        {canShowActions && (
                          <td className="space-x-3 px-3 py-3 text-right">
                            {auth.permissions.includes('admin.user.update') && (
                              <button
                                onClick={() => openEdit(u)}
                                className="cursor-pointer text-sm font-semibold text-orange-500 hover:text-orange-600"
                              >
                                <SquarePen />
                              </button>
                            )}

                            {auth.permissions.includes('admin.user.destroy') && (
                              <button
                                onClick={() => confirmDelete(u)}
                                className="cursor-pointer text-sm font-semibold text-red-500 hover:text-red-600"
                              >
                                <Trash />
                              </button>
                            )}
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>

                <Pagination links={users.links} />
              </>
            )}
          </div>
        </div>
      </div>

      {/* ---------------- CREATE MODAL ---------------- */}
      <Modal isOpen={createOpen} onClose={closeCreate} title="Create User" width="w-full max-w-xl">
        <form onSubmit={submitCreate} className="space-y-4">
          <div>
            <label className="text-sm font-semibold">Name</label>
            <input
              className="mt-1 w-full rounded border px-3 py-2 dark:bg-slate-800"
              value={createForm.data.name}
              onChange={(e) => createForm.setData('name', e.target.value)}
            />
            {createForm.errors.name && (
              <div className="mt-1 text-sm text-red-600">{createForm.errors.name}</div>
            )}
          </div>

          <div>
            <label className="text-sm font-semibold">Email</label>
            <input
              type="email"
              className="mt-1 w-full rounded border px-3 py-2 dark:bg-slate-800"
              value={createForm.data.email}
              onChange={(e) => createForm.setData('email', e.target.value)}
            />
            {createForm.errors.email && (
              <div className="mt-1 text-sm text-red-600">{createForm.errors.email}</div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-semibold">Password</label>
              <input
                type="password"
                className="mt-1 w-full rounded border px-3 py-2 dark:bg-slate-800"
                value={createForm.data.password}
                onChange={(e) => createForm.setData('password', e.target.value)}
              />
              {createForm.errors.password && (
                <div className="mt-1 text-sm text-red-600">{createForm.errors.password}</div>
              )}
            </div>

            <div>
              <label className="text-sm font-semibold">Confirm Password</label>
              <input
                type="password"
                className="mt-1 w-full rounded border px-3 py-2 dark:bg-slate-800"
                value={createForm.data.password_confirmation}
                onChange={(e) => createForm.setData('password_confirmation', e.target.value)}
              />
            </div>
          </div>

          <RoleSelect
            roles={roles}
            value={createForm.data.role}
            onChange={(v) => createForm.setData('role', v)}
            error={createForm.errors.role}
            label="Role"
          />

          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={closeCreate} className="rounded border px-4 py-2 text-sm">
              Cancel
            </button>

            <button
              disabled={createForm.processing}
              className="rounded bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
            >
              {createForm.processing ? 'Saving...' : 'Create'}
            </button>
          </div>
        </form>
      </Modal>

      {/* ---------------- EDIT MODAL ---------------- */}
      <Modal
        isOpen={editOpen}
        onClose={closeEdit}
        title={`Edit User${selectedUser ? `: ${selectedUser.name}` : ''}`}
        width="w-full max-w-xl"
      >
        <form onSubmit={submitEdit} className="space-y-4">
          <div>
            <label className="text-sm font-semibold">Name</label>
            <input
              className="mt-1 w-full rounded border px-3 py-2 dark:bg-slate-800"
              value={editForm.data.name}
              onChange={(e) => editForm.setData('name', e.target.value)}
            />
            {editForm.errors.name && (
              <div className="mt-1 text-sm text-red-600">{editForm.errors.name}</div>
            )}
          </div>

          <div>
            <label className="text-sm font-semibold">Email</label>
            <input
              type="email"
              className="mt-1 w-full rounded border px-3 py-2 dark:bg-slate-800"
              value={editForm.data.email}
              onChange={(e) => editForm.setData('email', e.target.value)}
            />
            {editForm.errors.email && (
              <div className="mt-1 text-sm text-red-600">{editForm.errors.email}</div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-semibold">New Password (optional)</label>
              <input
                type="password"
                className="mt-1 w-full rounded border px-3 py-2 dark:bg-slate-800"
                value={editForm.data.password}
                onChange={(e) => editForm.setData('password', e.target.value)}
              />
              {editForm.errors.password && (
                <div className="mt-1 text-sm text-red-600">{editForm.errors.password}</div>
              )}
            </div>

            <div>
              <label className="text-sm font-semibold">Confirm Password (optional)</label>
              <input
                type="password"
                className="mt-1 w-full rounded border px-3 py-2 dark:bg-slate-800"
                value={editForm.data.password_confirmation}
                onChange={(e) => editForm.setData('password_confirmation', e.target.value)}
              />
            </div>
          </div>

          <RoleSelect
            roles={roles}
            value={editForm.data.role}
            onChange={(v) => editForm.setData('role', v)}
            error={editForm.errors.role}
            label="Role"
          />

          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={closeEdit} className="rounded border px-4 py-2 text-sm">
              Cancel
            </button>

            <button
              disabled={editForm.processing}
              className="rounded bg-amber-600 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-700 disabled:opacity-60"
            >
              {editForm.processing ? 'Updating...' : 'Update'}
            </button>
          </div>
        </form>
      </Modal>
    </AppLayout>
  );
}
