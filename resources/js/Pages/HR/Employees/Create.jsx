import { useState } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import { toast } from 'react-hot-toast';
import HRLayout from '@/Layouts/HRLayout';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import SelectInput from '@/Components/SelectInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import { ArrowLeft, User, Building2, Plus } from 'lucide-react';

export default function Create({ auth, departments }) {
    const { data, setData, post, processing, errors } = useForm({
        first_name: '',
        last_name: '',
        middle_initial: '',
        department_id: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('hr.employees.store'), {
            onSuccess: () => {
                toast.success('Employee created successfully.');
            },
            onError: (errors) => {
                // Show first validation error as a toast
                const firstError = Object.values(errors)[0]?.[0];
                if (firstError) {
                    toast.error(firstError);
                } else {
                    toast.error('Failed to create employee.');
                }
            },
        });
    };

    return (
        <HRLayout user={auth.user}>
            <Head title="Add Employee" />

            <div className="py-8 sm:py-12">
                <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-6 flex items-center">
                        <Link
                            href={route('hr.employees.index')}
                            className="mr-4 rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                        >
                            <ArrowLeft className="h-5 w-5" />
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold text-navy-800 sm:text-3xl">Add Employee</h1>
                            <p className="text-sm text-gray-500">Create a new employee account manually</p>
                        </div>
                    </div>

                    <div className="overflow-hidden rounded-xl bg-white shadow-sm">
                        <form onSubmit={submit} className="p-6 sm:p-8">
                            <div className="space-y-6">
                                {/* First Name */}
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

                                {/* Last Name */}
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

                                {/* Middle Initial */}
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

                                {/* Department */}
                                <div>
                                    <InputLabel htmlFor="department_id" value="Department" />
                                    <div className="relative mt-1">
                                        <Building2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                        <SelectInput
                                            id="department_id"
                                            value={data.department_id}
                                            onChange={(e) => setData('department_id', e.target.value)}
                                            className="block w-full rounded-lg border-gray-300 pl-9 shadow-sm focus:border-navy-500 focus:ring-navy-500"
                                            required
                                        >
                                            <option value="">Select a department</option>
                                            {departments.map((dept) => (
                                                <option key={dept.id} value={dept.id}>
                                                    {dept.name}
                                                </option>
                                            ))}
                                        </SelectInput>
                                    </div>
                                    <InputError message={errors.department_id} className="mt-2" />
                                </div>

                                {/* Actions */}
                                <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                                    <Link
                                        href={route('hr.employees.index')}
                                        className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                                    >
                                        Cancel
                                    </Link>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="inline-flex items-center justify-center rounded-lg bg-navy-700 px-6 py-2 text-sm font-medium text-white hover:bg-navy-800 focus:outline-none focus:ring-2 focus:ring-navy-500 focus:ring-offset-2 disabled:opacity-50"
                                    >
                                        {processing ? 'Saving...' : 'Create Employee'}
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
