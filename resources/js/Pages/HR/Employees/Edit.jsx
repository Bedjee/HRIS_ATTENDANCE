import { useState } from 'react';
import { Head, Link, router, useForm } from '@inertiajs/react';
import HRLayout from '@/Layouts/HRLayout';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import SelectInput from '@/Components/SelectInput';
import { toast } from 'react-hot-toast';
import { ArrowLeft, Save, User, Building, Shield, Camera } from 'lucide-react';

const defaultAvatar = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect width='100' height='100' fill='%23e2e8f0'/%3E%3Ctext x='50' y='55' text-anchor='middle' font-size='40' font-family='sans-serif' fill='%2394a3b8'%3E%3C/text%3E%3C/svg%3E";

export default function Edit({ auth, employee, clusters, departments }) {
    const { data, setData, put, processing, errors } = useForm({
        first_name: employee.first_name || '',
        last_name: employee.last_name || '',
        middle_initial: employee.middle_initial || '',
        department_id: employee.department_id || '',
        username: employee.user?.username || '',
        is_active: employee.user?.status === 'active' ? 1 : 0,
        profile_photo: null,
        employment_status: employee.employment_status || 'Regular',
    });

    const [photoPreview, setPhotoPreview] = useState(
        employee.profile_photo_url || defaultAvatar
    );
    const [clusterFilter, setClusterFilter] = useState(
        employee.department?.cluster_id || ''
    );

    const filteredDepartments = departments.filter(
        (dept) => !clusterFilter || dept.cluster_id == clusterFilter
    );

    const statusOptions = ['Regular', 'Job Order (JO)'];

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        Object.keys(data).forEach((key) => {
            if (data[key] !== null && data[key] !== undefined && data[key] !== '') {
                formData.append(key, data[key]);
            }
        });
        formData.append('_method', 'PATCH');

        router.post(route('hr.employees.update', employee.id), formData, {
            preserveScroll: true,
            preserveState: true,
            forceFormData: true,
            onSuccess: () => {
                toast.success('Employee updated successfully.');
                router.visit(route('hr.employees.show', employee.id));
            },
            onError: (errors) => {
                toast.error('Validation failed. Please check the form.');
            },
        });
    };

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('profile_photo', file);
            const reader = new FileReader();
            reader.onload = (event) => setPhotoPreview(event.target.result);
            reader.readAsDataURL(file);
        }
    };

    return (
        <HRLayout user={auth.user}>
            <Head title={`Edit - ${employee.full_name}`} />
            <div className="py-4 sm:py-6">
                <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
                    <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <Link href={route('hr.employees.show', employee.id)} className="rounded-full p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600">
                                <ArrowLeft className="h-5 w-5" />
                            </Link>
                            <h1 className="text-xl font-bold text-navy-800 sm:text-2xl lg:text-3xl">Edit Employee</h1>
                        </div>
                        <div className="flex items-center gap-2">
                            <Link href={route('hr.employees.show', employee.id)} className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                                Cancel
                            </Link>
                            <button onClick={handleSubmit} disabled={processing} className="inline-flex items-center rounded-md bg-navy-700 px-4 py-2 text-sm font-medium text-white hover:bg-navy-800 disabled:opacity-50">
                                <Save className="mr-2 h-4 w-4" /> Save Changes
                            </button>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} encType="multipart/form-data">
                        {/* Profile Photo */}
                        <div className="overflow-hidden rounded-xl bg-white shadow-sm">
                            <div className="p-4 sm:p-6">
                                <div className="flex flex-col items-center gap-4 sm:flex-row">
                                    <div className="relative flex-shrink-0">
                                        <img src={photoPreview} alt="Profile photo" className="h-32 w-32 rounded-full object-cover ring-4 ring-navy-100" onError={(e) => { e.target.src = defaultAvatar; }} />
                                        <label htmlFor="photo-upload" className="absolute bottom-0 right-0 cursor-pointer rounded-full bg-navy-700 p-1.5 text-white hover:bg-navy-800">
                                            <Camera className="h-4 w-4" />
                                            <input id="photo-upload" type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
                                        </label>
                                    </div>
                                    <div className="text-center sm:text-left">
                                        <p className="text-sm text-gray-500">Upload a new profile photo (JPG, PNG, max 2MB)</p>
                                        {data.profile_photo && (
                                            <button type="button" onClick={() => { setData('profile_photo', null); setPhotoPreview(employee.profile_photo_url || defaultAvatar); }} className="mt-1 text-sm text-red-600 hover:text-red-800">
                                                Remove selected photo
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
                            {/* Personal Information */}
                            <div className="rounded-xl bg-white p-4 shadow-sm sm:p-6">
                                <h3 className="mb-4 flex items-center text-sm font-semibold uppercase tracking-wider text-gray-500">
                                    <User className="mr-2 h-4 w-4" /> Personal Information
                                </h3>
                                <div className="space-y-3">
                                    <div>
                                        <InputLabel htmlFor="first_name" value="First Name *" />
                                        <TextInput id="first_name" type="text" value={data.first_name} onChange={(e) => setData('first_name', e.target.value)} className="mt-1 block w-full" required />
                                        {errors.first_name && <p className="mt-1 text-sm text-red-600">{errors.first_name}</p>}
                                    </div>
                                    <div>
                                        <InputLabel htmlFor="last_name" value="Last Name *" />
                                        <TextInput id="last_name" type="text" value={data.last_name} onChange={(e) => setData('last_name', e.target.value)} className="mt-1 block w-full" required />
                                        {errors.last_name && <p className="mt-1 text-sm text-red-600">{errors.last_name}</p>}
                                    </div>
                                    <div>
                                        <InputLabel htmlFor="middle_initial" value="Middle Initial" />
                                        <TextInput id="middle_initial" type="text" value={data.middle_initial} onChange={(e) => setData('middle_initial', e.target.value)} className="mt-1 block w-full" maxLength={1} />
                                        {errors.middle_initial && <p className="mt-1 text-sm text-red-600">{errors.middle_initial}</p>}
                                    </div>
                                </div>
                            </div>

                            {/* Employment Information */}
                            <div className="rounded-xl bg-white p-4 shadow-sm sm:p-6">
                                <h3 className="mb-4 flex items-center text-sm font-semibold uppercase tracking-wider text-gray-500">
                                    <Building className="mr-2 h-4 w-4" /> Employment Information
                                </h3>
                                <div className="space-y-3">
                                    <div>
                                        <InputLabel htmlFor="cluster" value="Cluster" />
                                        <SelectInput id="cluster" value={clusterFilter} onChange={(e) => { setClusterFilter(e.target.value); setData('department_id', ''); }} className="mt-1 block w-full">
                                            <option value="">Select Cluster</option>
                                            {clusters.map((cluster) => (
                                                <option key={cluster.id} value={cluster.id}>{cluster.name}</option>
                                            ))}
                                        </SelectInput>
                                    </div>
                                    <div>
                                        <InputLabel htmlFor="department_id" value="Department *" />
                                        <SelectInput id="department_id" value={data.department_id} onChange={(e) => setData('department_id', e.target.value)} className="mt-1 block w-full" required>
                                            <option value="">Select Department</option>
                                            {filteredDepartments.map((dept) => (
                                                <option key={dept.id} value={dept.id}>{dept.name}</option>
                                            ))}
                                        </SelectInput>
                                        {errors.department_id && <p className="mt-1 text-sm text-red-600">{errors.department_id}</p>}
                                    </div>
                                    {/* Employment Status */}
                                    <div>
                                        <InputLabel htmlFor="employment_status" value="Employment Status" />
                                        <SelectInput id="employment_status" value={data.employment_status} onChange={(e) => setData('employment_status', e.target.value)} className="mt-1 block w-full">
                                            {statusOptions.map((status) => (
                                                <option key={status} value={status}>{status}</option>
                                            ))}
                                        </SelectInput>
                                        {errors.employment_status && <p className="mt-1 text-sm text-red-600">{errors.employment_status}</p>}
                                    </div>
                                </div>
                            </div>

                            {/* Account Information */}
                            <div className="rounded-xl bg-white p-4 shadow-sm sm:p-6">
                                <h3 className="mb-4 flex items-center text-sm font-semibold uppercase tracking-wider text-gray-500">
                                    <Shield className="mr-2 h-4 w-4" /> Account Information
                                </h3>
                                <div className="space-y-3">
                                    <div>
                                        <InputLabel htmlFor="username" value="Username *" />
                                        <TextInput id="username" type="text" value={data.username} onChange={(e) => setData('username', e.target.value)} className="mt-1 block w-full" required />
                                        {errors.username && <p className="mt-1 text-sm text-red-600">{errors.username}</p>}
                                    </div>
                                    <div>
                                        <InputLabel htmlFor="is_active" value="Account Status" />
                                        <SelectInput id="is_active" value={String(data.is_active)} onChange={(e) => setData('is_active', parseInt(e.target.value))} className="mt-1 block w-full">
                                            <option value="1">Active</option>
                                            <option value="0">Inactive</option>
                                        </SelectInput>
                                    </div>
                                </div>
                            </div>

                            <div className="rounded-xl bg-white p-4 shadow-sm sm:p-6">
                                <h3 className="mb-4 flex items-center text-sm font-semibold uppercase tracking-wider text-gray-500">
                                    <Shield className="mr-2 h-4 w-4" /> Additional Info
                                </h3>
                                <p className="text-sm text-gray-500">Password management is done separately via the "Reset Password" action on the profile page.</p>
                            </div>
                        </div>

                        <div className="mt-6 flex flex-wrap justify-end gap-3 border-t border-gray-200 pt-6">
                            <Link href={route('hr.employees.show', employee.id)} className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                                Cancel
                            </Link>
                            <button type="submit" disabled={processing} className="inline-flex items-center rounded-md bg-navy-700 px-4 py-2 text-sm font-medium text-white hover:bg-navy-800 disabled:opacity-50">
                                <Save className="mr-2 h-4 w-4" /> Save Changes
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </HRLayout>
    );
}
