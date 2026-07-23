import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import HRLayout from '@/Layouts/HRLayout';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import SelectInput from '@/Components/SelectInput';
import { toast } from 'react-hot-toast';
import { Plus, Pencil, Trash2, Users, Building2 } from 'lucide-react';

export default function Index({ auth, departments, clusters, filters }) {
  const [search, setSearch] = useState(filters.search || '');
  const [clusterFilter, setClusterFilter] = useState(filters.cluster_id || '');
  const [deletingId, setDeletingId] = useState(null);

  const handleSearch = (e) => {
    e.preventDefault();
    router.get(route('hr.departments.index'), {
      search,
      cluster_id: clusterFilter,
    });
  };

  const handleDelete = (id, name) => {
    if (confirm(`Are you sure you want to delete the department "${name}"?`)) {
      setDeletingId(id);
      router.delete(route('hr.departments.destroy', id), {
        onSuccess: () => {
          toast.success('Department deleted successfully.');
          setDeletingId(null);
        },
        onError: (error) => {
          toast.error(error.response?.data?.message || 'Failed to delete department.');
          setDeletingId(null);
        },
      });
    }
  };

  return (
    <HRLayout user={auth.user}>
      <Head title="Departments" />

      <div className="py-8 sm:py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-navy-800 sm:text-3xl">Departments</h1>
              <p className="text-sm text-gray-500">Manage departments within clusters</p>
            </div>
            <Link href={route('hr.departments.create')}>
              <PrimaryButton className="flex items-center">
                <Plus className="mr-2 h-4 w-4" />
                Create Department
              </PrimaryButton>
            </Link>
          </div>

          {/* Filters */}
          <div className="mt-6 overflow-hidden rounded-xl bg-white shadow-sm">
            <div className="p-4 sm:p-6">
              <form onSubmit={handleSearch} className="flex flex-wrap items-end gap-3">
                <div className="flex-1 min-w-[150px]">
                  <TextInput
                    type="text"
                    placeholder="Search departments..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="block w-full"
                  />
                </div>
                <div className="w-48">
                  <SelectInput
                    value={clusterFilter}
                    onChange={(e) => setClusterFilter(e.target.value)}
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
                <PrimaryButton type="submit" className="px-6">
                  Filter
                </PrimaryButton>
                {(search || clusterFilter) && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearch('');
                      setClusterFilter('');
                      router.get(route('hr.departments.index'));
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
              {departments.data.length === 0 ? (
                <div className="p-12 text-center text-gray-500">
                  <Building2 className="mx-auto h-12 w-12 text-gray-300" />
                  <p className="mt-2">No departments found.</p>
                  <Link href={route('hr.departments.create')} className="mt-4 inline-block text-sm text-navy-600 hover:text-navy-800">
                    Create your first department
                  </Link>
                </div>
              ) : (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 sm:px-6">
                        Department
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 sm:px-6">
                        Cluster
                      </th>
                      <th className="hidden px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 sm:table-cell sm:px-6">
                        Employees
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 sm:px-6">
                        Status
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 sm:px-6">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {departments.data.map((dept) => (
                      <tr key={dept.id} className="hover:bg-gray-50">
                        <td className="px-4 py-4 sm:px-6">
                          <div className="text-sm font-medium text-navy-800">{dept.name}</div>
                          {/* Mobile-only details */}
                          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500 sm:hidden">
                            <span>Cluster: {dept.cluster?.name || '—'}</span>
                            <span>Employees: {dept.employees_count || 0}</span>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-500 sm:px-6">
                          {dept.cluster?.name || '—'}
                        </td>
                        <td className="hidden px-4 py-4 text-sm text-gray-500 sm:table-cell sm:px-6">
                          {dept.employees_count || 0}
                        </td>
                        <td className="px-4 py-4 sm:px-6">
                          <span
                            className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                              dept.status === 'active'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {dept.status}
                          </span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium sm:px-6">
                          <Link
                            href={route('hr.departments.edit', dept.id)}
                            className="mr-2 inline-flex items-center rounded-md p-1.5 text-navy-600 hover:bg-navy-50 hover:text-navy-900"
                          >
                            <Pencil className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Link>
                          <button
                            onClick={() => handleDelete(dept.id, dept.name)}
                            disabled={deletingId === dept.id}
                            className="inline-flex items-center rounded-md p-1.5 text-red-600 hover:bg-red-50 hover:text-red-900 disabled:opacity-50"
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* Pagination */}
            {departments.links && departments.data.length > 0 && (
              <div className="border-t border-gray-200 px-4 py-4 sm:px-6">
                <div className="flex flex-wrap items-center justify-center gap-1">
                  {departments.links.map((link, index) => (
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
