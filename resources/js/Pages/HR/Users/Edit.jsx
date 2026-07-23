import { Head, useForm, Link } from '@inertiajs/react';
import { toast } from 'react-hot-toast';
import HRLayout from '@/Layouts/HRLayout';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import SelectInput from '@/Components/SelectInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import { ArrowLeft, User, Mail, ShieldCheck } from 'lucide-react';

export default function Edit({ auth, user }) {
    const { data, setData, patch, processing, errors } = useForm({
        first_name: user.name ? user.name.split(' ')[0] : '',
        last_name: user.name ? user.name.split(' ').slice(1).join(' ') : '',
        middle_initial: '',
        username: user.username,
        email: user.email || '',
        status: user.status,
    });

    const submit = (e) => {
        e.preventDefault();
        patch(route('hr.users.update', user.id), {
            onSuccess: () => {
                toast.success('HR user updated successfully.');
            },
            onError: () => {
                toast.error('Failed to update HR user.');
            },
        });
    };

    return (
        <HRLayout user={auth.user}>
            <Head title="Edit HR User" />

            <div className="py-8 sm:py-12">
                <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-6 flex items-center">
                        <Link
                            href={route('hr.users.index')}
                            className="mr-4 rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                        >
                            <ArrowLeft className="h-5 w-5" />
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold text-navy-800 sm:text-3xl">Edit HR User</h1>
                            <p className="text-sm text-gray-500">Update HR account details</p>
                        </div>
                    </div>

                    <div className="overflow-hidden rounded-xl bg-white shadow-sm">
                        <form onSubmit={submit} className="p-6 sm:p-8">
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                    <div>
                                        <InputLabel htmlFor="first_name" value="First Name" />
                                        <div className="relative mt-1">
                                            <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                            <TextInput
                                                id="first_name"
                                                type="text"
                                                value={data.first_name}
                                                className="block w-full rounded-lg border-gray-300 pl-9 shadow-sm focus:border-navy-500 focus:ring-navy-500"
                                                onChange={(e) => setData('first_name', e.target.value)}
                                                required
                                            />
                                        </div>
                                        <InputError message={errors.first_name} className="mt-2" />
                                    </div>
                                    <div>
                                        <InputLabel htmlFor="last_name" value="Last Name" />
                                        <div className="relative mt-1">
                                            <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                            <TextInput
                                                id="last_name"
                                                type="text"
                                                value={data.last_name}
                                                className="block w-full rounded-lg border-gray-300 pl-9 shadow-sm focus:border-navy-500 focus:ring-navy-500"
                                                onChange={(e) => setData('last_name', e.target.value)}
                                                required
                                            />
                                        </div>
                                        <InputError message={errors.last_name} className="mt-2" />
                                    </div>
                                </div>

                                <div>
                                    <InputLabel htmlFor="middle_initial" value="Middle Initial (optional)" />
                                    <div className="relative mt-1">
                                        <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                        <TextInput
                                            id="middle_initial"
                                            type="text"
                                            maxLength={1}
                                            value={data.middle_initial}
                                            className="block w-full rounded-lg border-gray-300 pl-9 shadow-sm focus:border-navy-500 focus:ring-navy-500"
                                            onChange={(e) => setData('middle_initial', e.target.value)}
                                        />
                                    </div>
                                    <InputError message={errors.middle_initial} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="username" value="Username" />
                                    <div className="relative mt-1">
                                        <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                        <TextInput
                                            id="username"
                                            type="text"
                                            value={data.username}
                                            className="block w-full rounded-lg border-gray-300 pl-9 shadow-sm focus:border-navy-500 focus:ring-navy-500"
                                            onChange={(e) => setData('username', e.target.value)}
                                            required
                                        />
                                    </div>
                                    <InputError message={errors.username} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="email" value="Email (optional)" />
                                    <div className="relative mt-1">
                                        <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                        <TextInput
                                            id="email"
                                            type="email"
                                            value={data.email}
                                            className="block w-full rounded-lg border-gray-300 pl-9 shadow-sm focus:border-navy-500 focus:ring-navy-500"
                                            onChange={(e) => setData('email', e.target.value)}
                                        />
                                    </div>
                                    <InputError message={errors.email} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="status" value="Status" />
                                    <div className="relative mt-1">
                                        <ShieldCheck className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                        <SelectInput
                                            id="status"
                                            value={data.status}
                                            onChange={(e) => setData('status', e.target.value)}
                                            className="block w-full rounded-lg border-gray-300 pl-9 shadow-sm focus:border-navy-500 focus:ring-navy-500"
                                        >
                                            <option value="active">Active</option>
                                            <option value="inactive">Inactive</option>
                                        </SelectInput>
                                    </div>
                                    <InputError message={errors.status} className="mt-2" />
                                </div>

                                <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                                    <Link
                                        href={route('hr.users.index')}
                                        className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                                    >
                                        Cancel
                                    </Link>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="inline-flex items-center justify-center rounded-lg bg-navy-700 px-6 py-2 text-sm font-medium text-white hover:bg-navy-800 focus:outline-none focus:ring-2 focus:ring-navy-500 focus:ring-offset-2 disabled:opacity-50"
                                    >
                                        {processing ? 'Updating...' : 'Update HR User'}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </HRLayout>
    );
}
