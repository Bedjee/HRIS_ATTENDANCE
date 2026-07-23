import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import HRLayout from '@/Layouts/HRLayout';
import PrimaryButton from '@/Components/PrimaryButton';
import { toast } from 'react-hot-toast';
import { Plus, Pencil, Trash2, Layers, Users, Building2 } from 'lucide-react';

export default function Index({ auth, clusters }) {
  const [deletingId, setDeletingId] = useState(null);

  const handleDelete = (id, name) => {
    if (confirm(`Are you sure you want to delete the cluster "${name}"?`)) {
      setDeletingId(id);
      router.delete(route('hr.clusters.destroy', id), {
        onSuccess: () => {
          toast.success('Cluster deleted successfully.');
          setDeletingId(null);
        },
        onError: (error) => {
          toast.error(error.response?.data?.message || 'Failed to delete cluster.');
          setDeletingId(null);
        },
      });
    }
  };

  return (
    <HRLayout user={auth.user}>
      <Head title="Clusters" />

      <div className="py-8 sm:py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-navy-800 sm:text-3xl">Clusters</h1>
              <p className="text-sm text-gray-500">Organize departments into clusters</p>
            </div>
            <Link href={route('hr.clusters.create')}>
              <PrimaryButton className="flex items-center">
                <Plus className="mr-2 h-4 w-4" />
                Create Cluster
              </PrimaryButton>
            </Link>
          </div>

          {/* Cards Grid */}
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {clusters.data.length === 0 ? (
              <div className="col-span-full rounded-xl bg-white p-12 text-center text-gray-500">
                <Layers className="mx-auto h-12 w-12 text-gray-300" />
                <p className="mt-2">No clusters created yet.</p>
                <Link href={route('hr.clusters.create')} className="mt-4 inline-block text-sm text-navy-600 hover:text-navy-800">
                  Create your first cluster
                </Link>
              </div>
            ) : (
              clusters.data.map((cluster) => (
                <div
                  key={cluster.id}
                  className="group overflow-hidden rounded-xl bg-white shadow-sm transition hover:shadow-md"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-navy-800">{cluster.name}</h3>
                        {cluster.description && (
                          <p className="mt-1 text-sm text-gray-500">{cluster.description}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        <Link
                          href={route('hr.clusters.edit', cluster.id)}
                          className="rounded-md p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                        >
                          <Pencil className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Link>
                        <button
                          onClick={() => handleDelete(cluster.id, cluster.name)}
                          disabled={deletingId === cluster.id}
                          className="rounded-md p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </button>
                      </div>
                    </div>
                    <div className="mt-4 flex flex-wrap items-center gap-4 text-sm">
                      <span className="flex items-center text-gray-600">
                        <Building2 className="mr-1 h-4 w-4" />
                        {cluster.departments_count || 0} Departments
                      </span>
                      <span className="flex items-center text-gray-600">
                        <Users className="mr-1 h-4 w-4" />
                        {cluster.employees_count || 0} Employees
                      </span>
                      <span
                        className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                          cluster.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {cluster.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Pagination */}
          {clusters.links && clusters.data.length > 0 && (
            <div className="mt-6 flex justify-center">
              <div className="flex flex-wrap items-center gap-1">
                {clusters.links.map((link, index) => (
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
    </HRLayout>
  );
}
