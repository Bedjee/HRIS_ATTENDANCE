import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { toast } from 'react-hot-toast';
import HRLayout from '@/Layouts/HRLayout';
import PrimaryButton from '@/Components/PrimaryButton';
import { Plus, Pencil, Trash2, ShieldCheck, User, ToggleLeft, ToggleRight, Key } from 'lucide-react';
import ConfirmationModal from '@/Components/ConfirmationModal';

export default function Index({ auth, users }) {
    const [deletingId, setDeletingId] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);
    const [resettingId, setResettingId] = useState(null);
    const [showResetModal, setShowResetModal] = useState(false);
    const [resetUserId, setResetUserId] = useState(null);
    const [resetPassword, setResetPassword] = useState('');
    const [resetPasswordConfirmation, setResetPasswordConfirmation] = useState('');

    const handleDeleteClick = (user) => {
        setUserToDelete(user);
        setModalOpen(true);
    };

    const confirmDelete = () => {
        if (!userToDelete) return;
        setDeletingId(userToDelete.id);
        router.delete(route('hr.users.destroy', userToDelete.id), {
            onSuccess: () => {
                toast.success('HR user deleted successfully.');
                setDeletingId(null);
                setUserToDelete(null);
            },
            onError: (error) => {
                toast.error(error.response?.data?.message || 'Failed to delete user.');
                setDeletingId(null);
                setUserToDelete(null);
            },
        });
    };

    const handleResetClick = (user) => {
        setResetUserId(user.id);
        setResetPassword('');
        setResetPasswordConfirmation('');
        setShowResetModal(true);
    };

    const confirmReset = () => {
        if (resetPassword !== resetPasswordConfirmation) {
            toast.error('Passwords do not match.');
            return;
        }
        if (resetPassword.length < 8) {
            toast.error('Password must be at least 8 characters.');
            return;
        }
        setResettingId(resetUserId);
        router.post(
            route('hr.users.reset-password', resetUserId),
            { password: resetPassword, password_confirmation: resetPasswordConfirmation },
            {
                onSuccess: () => {
                    toast.success('Password reset successfully.');
                    setResettingId(null);
                    setShowResetModal(false);
                    setResetUserId(null);
                },
                onError: (error) => {
                    toast.error(error.response?.data?.message || 'Failed to reset password.');
                    setResettingId(null);
                },
            }
        );
    };

    return (
        <HRLayout user={auth.user}>
            <Head title="HR Users" />
            <div className="py-8 sm:py-12">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                        <div>
                            <h1 className="text-2xl font-bold text-navy-800 sm:text-3xl">HR Users</h1>
                            <p className="text-sm text-gray-500">Manage HR personnel accounts</p>
                        </div>
                        <Link href={route('hr.users.create')}>
                            <PrimaryButton className="flex items-center">
                                <Plus className="mr-2 h-4 w-4" />
                                Add HR User
                            </PrimaryButton>
                        </Link>
                    </div>

                    <div className="overflow-hidden rounded-xl bg-white shadow-sm">
                        <div className="overflow-x-auto">
                            {users.data.length === 0 ? (
                                <div className="p-12 text-center text-gray-500">
                                    <ShieldCheck className="mx-auto h-12 w-12 text-gray-300" />
                                    <p className="mt-2">No HR users found.</p>
                                </div>
                            ) : (
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Name</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Username</th>
                                            <th className="hidden px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 sm:table-cell">Email</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Status</th>
                                            <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 bg-white">
                                        {users.data.map((user) => (
                                            <tr key={user.id} className="hover:bg-gray-50">
                                                <td className="px-4 py-4 text-sm text-navy-800">
                                                    {user.name || user.username}
                                                </td>
                                                <td className="px-4 py-4 text-sm text-gray-500">{user.username}</td>
                                                <td className="hidden px-4 py-4 text-sm text-gray-500 sm:table-cell">
                                                    {user.email || '—'}
                                                </td>
                                                <td className="px-4 py-4 text-sm">
                                                    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                        {user.status}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <button
                                                        onClick={() => handleResetClick(user)}
                                                        disabled={resettingId === user.id}
                                                        className="inline-flex items-center rounded-md p-1.5 text-blue-600 hover:bg-blue-50 hover:text-blue-900 disabled:opacity-50"
                                                        title="Reset Password"
                                                    >
                                                        <Key className="h-4 w-4" />
                                                    </button>
                                                    <Link
                                                        href={route('hr.users.edit', user.id)}
                                                        className="inline-flex items-center rounded-md p-1.5 text-navy-600 hover:bg-navy-50 hover:text-navy-900"
                                                    >
                                                        <Pencil className="h-4 w-4" />
                                                    </Link>
                                                    {auth.user.id !== user.id && (
                                                        <button
                                                            onClick={() => handleDeleteClick(user)}
                                                            disabled={deletingId === user.id}
                                                            className="inline-flex items-center rounded-md p-1.5 text-red-600 hover:bg-red-50 hover:text-red-900 disabled:opacity-50"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                        {/* Pagination */}
                        {users.links && users.data.length > 0 && (
                            <div className="border-t border-gray-200 px-4 py-4 sm:px-6">
                                <div className="flex flex-wrap items-center justify-center gap-1">
                                    {users.links.map((link, index) => (
                                        <Link
                                            key={index}
                                            href={link.url || '#'}
                                            className={`inline-flex items-center rounded-md px-3 py-1.5 text-sm ${link.active ? 'bg-navy-700 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                } ${!link.url ? 'cursor-not-allowed opacity-50' : ''}`}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                            disabled={!link.url}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Delete Confirmation */}
            <ConfirmationModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                onConfirm={confirmDelete}
                title="Delete HR User"
                message={`Are you sure you want to delete the HR user "${userToDelete?.name || userToDelete?.username}"? This action cannot be undone.`}
                confirmText="Delete"
                cancelText="Cancel"
                type="danger"
            />

            {/* Reset Password Modal */}
            {showResetModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
                        <h3 className="text-lg font-semibold text-navy-800">Reset Password</h3>
                        <p className="mt-1 text-sm text-gray-500">
                            Enter a new password for this HR user.
                        </p>
                        <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700">New Password</label>
                            <input
                                type="password"
                                value={resetPassword}
                                onChange={(e) => setResetPassword(e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-navy-500 focus:ring-navy-500"
                                placeholder="Enter new password"
                            />
                        </div>
                        <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
                            <input
                                type="password"
                                value={resetPasswordConfirmation}
                                onChange={(e) => setResetPasswordConfirmation(e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-navy-500 focus:ring-navy-500"
                                placeholder="Confirm new password"
                            />
                        </div>
                        <div className="mt-6 flex justify-end gap-2">
                            <button
                                onClick={() => setShowResetModal(false)}
                                className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmReset}
                                disabled={resettingId !== null}
                                className="rounded-md bg-navy-700 px-4 py-2 text-sm font-medium text-white hover:bg-navy-800 disabled:opacity-50"
                            >
                                {resettingId ? 'Resetting...' : 'Reset Password'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </HRLayout>
    );
}
