import { Head, useForm, Link } from '@inertiajs/react';
import HRLayout from '@/Layouts/HRLayout';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import SelectInput from '@/Components/SelectInput';
import InputError from '@/Components/InputError';
import { ArrowLeft, Calendar, Clock, MapPin, FileText, Circle } from 'lucide-react';
import EmployeeMultiSelect from '@/Components/EmployeeMultiSelect';

export default function Edit({ auth, event, clusters, departments, employees, selectedEmployeeIds }) {
    const { data, setData, patch, processing, errors } = useForm({
        title: event.title || '',
        description: event.description || '',
        date: event.date || '',
        time: event.time || '',
        end_time: event.end_time || '',
        venue: event.venue || '',
        status: event.status || 'upcoming',
        attendance_mode: event.attendance_mode || 'all_employees',
        selected_clusters: event.selected_clusters || [],
        selected_departments: event.selected_departments || [],
        employee_ids: selectedEmployeeIds || [],
        grace_period: event.grace_period ?? null,
    });

    const submit = (e) => {
        e.preventDefault();
        patch(route('hr.events.update', event.id));
    };

    return (
        <HRLayout user={auth.user}>
            <Head title="Edit Event" />
            <div className="py-8 sm:py-12">
                <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-6 flex items-center">
                        <Link
                            href={route('hr.events.index')}
                            className="mr-4 rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                        >
                            <ArrowLeft className="h-5 w-5" />
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold text-navy-800 sm:text-3xl">Edit Event</h1>
                            <p className="text-sm text-gray-500">Update event details</p>
                        </div>
                    </div>

                    <div className="overflow-hidden rounded-xl bg-white shadow-sm">
                        <form onSubmit={submit} className="p-6 sm:p-8">
                            <div className="space-y-6">
                                {/* Title */}
                                <div>
                                    <InputLabel htmlFor="title" value="Event Title" />
                                    <TextInput
                                        id="title"
                                        type="text"
                                        value={data.title}
                                        onChange={(e) => setData('title', e.target.value)}
                                        className="mt-1 block w-full"
                                        required
                                        placeholder="Enter event title"
                                    />
                                    <InputError message={errors.title} className="mt-2" />
                                </div>

                                {/* Description */}
                                <div>
                                    <InputLabel htmlFor="description" value="Description" />
                                    <div className="relative mt-1">
                                        <FileText className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                        <textarea
                                            id="description"
                                            value={data.description}
                                            rows={3}
                                            className="block w-full rounded-lg border-gray-300 pl-9 shadow-sm focus:border-navy-500 focus:ring-navy-500"
                                            onChange={(e) => setData('description', e.target.value)}
                                            placeholder="Optional description"
                                        />
                                    </div>
                                    <InputError message={errors.description} className="mt-2" />
                                </div>

                                {/* Date & Start Time */}
                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                    <div>
                                        <InputLabel htmlFor="date" value="Event Date" />
                                        <div className="relative mt-1">
                                            <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                            <TextInput
                                                id="date"
                                                type="date"
                                                value={data.date}
                                                onChange={(e) => setData('date', e.target.value)}
                                                className="block w-full rounded-lg border-gray-300 pl-9 shadow-sm focus:border-navy-500 focus:ring-navy-500"
                                                required
                                            />
                                        </div>
                                        <InputError message={errors.date} className="mt-2" />
                                    </div>
                                    <div>
                                        <InputLabel htmlFor="time" value="Start Time" />
                                        <div className="relative mt-1">
                                            <Clock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                            <TextInput
                                                id="time"
                                                type="time"
                                                value={data.time}
                                                onChange={(e) => setData('time', e.target.value)}
                                                className="block w-full rounded-lg border-gray-300 pl-9 shadow-sm focus:border-navy-500 focus:ring-navy-500"
                                                required
                                            />
                                        </div>
                                        <InputError message={errors.time} className="mt-2" />
                                    </div>
                                </div>

                                {/* End Time */}
                                <div>
                                    <InputLabel htmlFor="end_time" value="End Time (optional)" />
                                    <div className="relative mt-1">
                                        <Clock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                        <TextInput
                                            id="end_time"
                                            type="time"
                                            value={data.end_time}
                                            onChange={(e) => setData('end_time', e.target.value)}
                                            className="block w-full rounded-lg border-gray-300 pl-9 shadow-sm focus:border-navy-500 focus:ring-navy-500"
                                        />
                                    </div>
                                    <InputError message={errors.end_time} className="mt-2" />
                                </div>

                                {/* Grace Period */}
                                <div>
                                    <InputLabel htmlFor="grace_period" value="Grace Period (minutes)" />
                                    <div className="relative mt-1">
                                        <Clock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                        <TextInput
                                            id="grace_period"
                                            type="number"
                                            min="0"
                                            value={data.grace_period}
                                            onChange={(e) => setData('grace_period', e.target.value)}
                                            className="block w-full rounded-lg border-gray-300 pl-9 shadow-sm focus:border-navy-500 focus:ring-navy-500"
                                            placeholder="e.g., 15"
                                        />
                                    </div>
                                    <InputError message={errors.grace_period} className="mt-2" />
                                </div>

                                {/* Venue */}
                                <div>
                                    <InputLabel htmlFor="venue" value="Venue" />
                                    <div className="relative mt-1">
                                        <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                        <TextInput
                                            id="venue"
                                            type="text"
                                            value={data.venue}
                                            onChange={(e) => setData('venue', e.target.value)}
                                            className="block w-full rounded-lg border-gray-300 pl-9 shadow-sm focus:border-navy-500 focus:ring-navy-500"
                                            required
                                            placeholder="Enter event venue"
                                        />
                                    </div>
                                    <InputError message={errors.venue} className="mt-2" />
                                </div>

                                {/* Status */}
                                <div>
                                    <InputLabel htmlFor="status" value="Status" />
                                    <div className="relative mt-1">
                                        <Circle className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                        <SelectInput
                                            id="status"
                                            value={data.status}
                                            onChange={(e) => setData('status', e.target.value)}
                                            className="block w-full rounded-lg border-gray-300 pl-9 shadow-sm focus:border-navy-500 focus:ring-navy-500"
                                        >
                                            <option value="upcoming">Upcoming</option>
                                            <option value="ongoing">Ongoing</option>
                                            <option value="completed">Completed</option>
                                        </SelectInput>
                                    </div>
                                    <InputError message={errors.status} className="mt-2" />
                                </div>

                {/* Attendance Mode */}
                <div>
                  <InputLabel htmlFor="attendance_mode" value="Attendance Mode" />
                  <SelectInput
                    id="attendance_mode"
                    value={data.attendance_mode}
                    onChange={(e) => setData('attendance_mode', e.target.value)}
                    className="mt-1 block w-full"
                  >
                    <option value="all_employees">All Employees</option>
                    <option value="selected_clusters">Selected Clusters</option>
                    <option value="selected_departments">Selected Departments</option>
                    <option value="selected_employees">Selected Employees</option>
                  </SelectInput>
                  <InputError message={errors.attendance_mode} className="mt-2" />
                </div>

                {data.attendance_mode === 'selected_clusters' && (
                  <div>
                    <InputLabel>Select Clusters</InputLabel>
                    <SelectInput
                      multiple
                      value={data.selected_clusters}
                      onChange={(e) => {
                        const values = Array.from(e.target.selectedOptions, opt => opt.value);
                        setData('selected_clusters', values);
                      }}
                      className="mt-1 block w-full"
                    >
                      {clusters.map(cluster => (
                        <option key={cluster.id} value={cluster.id}>{cluster.name}</option>
                      ))}
                    </SelectInput>
                    <InputError message={errors.selected_clusters} className="mt-2" />
                  </div>
                )}

                {data.attendance_mode === 'selected_departments' && (
                  <div>
                    <InputLabel>Select Departments</InputLabel>
                    <SelectInput
                      multiple
                      value={data.selected_departments}
                      onChange={(e) => {
                        const values = Array.from(e.target.selectedOptions, opt => opt.value);
                        setData('selected_departments', values);
                      }}
                      className="mt-1 block w-full"
                    >
                      {departments.map(dept => (
                        <option key={dept.id} value={dept.id}>{dept.name}</option>
                      ))}
                    </SelectInput>
                    <InputError message={errors.selected_departments} className="mt-2" />
                  </div>
                )}

                {data.attendance_mode === 'selected_employees' && (
                  <div>
                    <InputLabel>Select Employees</InputLabel>
                    <EmployeeMultiSelect
                      employees={employees}
                      value={data.employee_ids}
                      onChange={(ids) => setData('employee_ids', ids)}
                    />
                    <InputError message={errors.employee_ids} className="mt-2" />
                  </div>
                )}

                {/* Submit */}
                <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                  <Link
                    href={route('hr.events.index')}
                    className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </Link>
                  <button
                    type="submit"
                    disabled={processing}
                    className="inline-flex items-center justify-center rounded-lg bg-navy-700 px-6 py-2 text-sm font-medium text-white hover:bg-navy-800 focus:outline-none focus:ring-2 focus:ring-navy-500 focus:ring-offset-2 disabled:opacity-50"
                  >
                    {processing ? 'Updating...' : 'Update Event'}
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
