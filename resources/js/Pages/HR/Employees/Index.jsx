import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import HRLayout from '@/Layouts/HRLayout';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import SelectInput from '@/Components/SelectInput';
import { toast } from 'react-hot-toast';
import { QrCode,Plus,Download   } from 'lucide-react';

export default function Index({ auth, employees, clusters, departments, filters }) {
  const [search, setSearch] = useState(filters.search || '');
  const [clusterFilter, setClusterFilter] = useState(filters.cluster_id || '');
  const [departmentFilter, setDepartmentFilter] = useState(filters.department_id || '');
  const [resettingId, setResettingId] = useState(null);

  const handleSearch = (e) => {
    e.preventDefault();
    router.get(route('hr.employees.index'), {
      search,
      cluster_id: clusterFilter,
      department_id: departmentFilter,
    });
  };

  const handleResetPassword = (employeeId, employeeName) => {
    if (confirm(`Reset password for ${employeeName}?`)) {
      setResettingId(employeeId);
      router.post(
        route('hr.employees.reset-password', employeeId),
        {},
        {
          onSuccess: () => {
            toast.success(`Password reset for ${employeeName}`);
            setResettingId(null);
          },
          onError: () => {
            toast.error('Failed to reset password.');
            setResettingId(null);
          },
        }
      );
    }
  };

  // Filter departments based on selected cluster
  const filteredDepartments = departments.filter(
    (dept) => !clusterFilter || dept.cluster_id == clusterFilter
  );

  return (
    <HRLayout user={auth.user}>
      <Head title="Employees" />

      <div className="py-8 sm:py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
   <div className="flex flex-wrap items-center gap-2">
    <Link href={route('hr.employees.create')}>
        <PrimaryButton className="flex items-center whitespace-nowrap">
            <Plus className="mr-2 h-4 w-4" />
            Add Employee
        </PrimaryButton>
    </Link>
    <Link href={route('hr.employees.import')}>
        <PrimaryButton className="flex items-center whitespace-nowrap">
            <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Import Employees
        </PrimaryButton>
    </Link>
    <a
        href={route('hr.employees.export-credentials')}
        className="inline-flex items-center rounded-md bg-navy-700 px-4 py-2 text-sm font-medium text-white hover:bg-navy-800 focus:outline-none focus:ring-2 focus:ring-navy-500 focus:ring-offset-2"
    >
        <Download className="mr-2 h-4 w-4" />
        Export Credentials
    </a>
</div>


          {/* Filters */}
          <div className="mt-6 overflow-hidden rounded-xl bg-white shadow-sm">
            <div className="p-4 sm:p-6">
              <form onSubmit={handleSearch} className="flex flex-wrap items-end gap-3">
                <div className="flex-1 min-w-[150px]">
                  <TextInput
                    type="text"
                    placeholder="Search by name, username, department..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="block w-full"
                  />
                </div>
                <div className="w-48">
                  <SelectInput
                    value={clusterFilter}
                    onChange={(e) => {
                      setClusterFilter(e.target.value);
                      setDepartmentFilter(''); // reset department when cluster changes
                    }}
                    className="block w-full"
                  >
                    <option value="">All Clusters</option>
                    {clusters.map((cluster) => (
                      <option key={cluster.id} value={cluster.id}>
                        {cluster.name}
                      </option>
                    ))}
                  </SelectInput>
                </div>
                <div className="w-48">
                  <SelectInput
                    value={departmentFilter}
                    onChange={(e) => setDepartmentFilter(e.target.value)}
                    className="block w-full"
                  >
                    <option value="">All Departments</option>
                    {filteredDepartments.map((dept) => (
                      <option key={dept.id} value={dept.id}>
                        {dept.name}
                      </option>
                    ))}
                  </SelectInput>
                </div>
                <PrimaryButton type="submit" className="px-6">
                  Filter
                </PrimaryButton>
                {(search || clusterFilter || departmentFilter) && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearch('');
                      setClusterFilter('');
                      setDepartmentFilter('');
                      router.get(route('hr.employees.index'));
                    }}
                    className="text-sm text-gray-500 hover:text-gray-700"
                  >
                    Clear
                  </button>
                )}
              </form>
            </div>
          </div>

          {/* Table */}
          <div className="mt-6 overflow-hidden rounded-xl bg-white shadow-sm">
            <div className="overflow-x-auto">
              {employees.data.length === 0 ? (
                <div className="p-12 text-center text-gray-500">
                  <svg className="mx-auto h-12 w-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  <p className="mt-2">No employees found.</p>
                  <p className="text-sm">Try adjusting your filters or import employees.</p>
                </div>
              ) : (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 sm:px-6">
                        Name
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 sm:px-6">
                        Department
                      </th>
                      <th className="hidden px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 sm:table-cell sm:px-6">
                        Cluster
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 sm:px-6">
                        Username
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 sm:px-6">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {employees.data.map((employee) => (
                      <tr key={employee.id} className="hover:bg-gray-50">
                        <td className="px-4 py-4 sm:px-6">
                          <div className="text-sm font-medium text-navy-800">
                            {employee.formatted_name}
                          </div>
                          {/* Mobile-only details */}
                          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500 sm:hidden">
                            <span>Dept: {employee.department?.name || 'Unassigned'}</span>
                            <span>Cluster: {employee.department?.cluster?.name || '—'}</span>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-500 sm:px-6">
                          {employee.department?.name || 'Unassigned'}
                        </td>
                        <td className="hidden px-4 py-4 text-sm text-gray-500 sm:table-cell sm:px-6">
                          {employee.department?.cluster?.name || '—'}
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-500 sm:px-6">
                          {employee.user.username}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium sm:px-6">
                          <button
                            onClick={() =>
                              handleResetPassword(employee.id, employee.full_name)
                            }
                            disabled={resettingId === employee.id}
                            className="mr-2 inline-flex items-center rounded-md p-1.5 text-navy-600 hover:bg-navy-50 hover:text-navy-900 disabled:opacity-50"
                            title="Reset Password"
                          >
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                            </svg>
                            <span className="sr-only">Reset Password</span>
                          </button>
                          <Link
                            href={route('hr.employees.qr', employee.id)}
                            className="inline-flex items-center rounded-md p-1.5 text-green-600 hover:bg-green-50 hover:text-green-900"
                            title="View QR Code"
                          >
                            <QrCode className="h-4 w-4" />
                            <span className="sr-only">View QR</span>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* Pagination */}
            {employees.links && employees.data.length > 0 && (
              <div className="border-t border-gray-200 px-4 py-4 sm:px-6">
                <div className="flex flex-wrap items-center justify-center gap-1">
                  {employees.links.map((link, index) => (
                    <Link
                      key={index}
                      href={link.url || '#'}
                      className={`inline-flex items-center rounded-md px-3 py-1.5 text-sm ${
                        link.active
                          ? 'bg-navy-700 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
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
    </HRLayout>
  );
}
