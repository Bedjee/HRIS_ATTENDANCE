import { Head, useForm, Link } from '@inertiajs/react';
import HRLayout from '@/Layouts/HRLayout';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import SelectInput from '@/Components/SelectInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import { ArrowLeft } from 'lucide-react';

export default function Create({ auth, clusters }) {
  const { data, setData, post, processing, errors } = useForm({
    name: '',
    cluster_id: '',
    status: 'active',
  });

  const submit = (e) => {
    e.preventDefault();
    post(route('hr.departments.store'));
  };

  return (
    <HRLayout user={auth.user}>
      <Head title="Create Department" />

      <div className="py-8 sm:py-12">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-xl bg-white shadow-sm">
            <div className="p-6 sm:p-8">
              <div className="flex items-center gap-4 mb-6">
                <Link href={route('hr.departments.index')} className="text-gray-400 hover:text-gray-600">
                  <ArrowLeft className="h-5 w-5" />
                </Link>
                <h2 className="text-2xl font-bold text-navy-800">Create Department</h2>
              </div>

              <form onSubmit={submit} className="space-y-6">
                <div>
                  <InputLabel htmlFor="name" value="Department Name" />
                  <TextInput
                    id="name"
                    type="text"
                    value={data.name}
                    onChange={(e) => setData('name', e.target.value)}
                    className="mt-1 block w-full"
                    required
                  />
                  <InputError message={errors.name} className="mt-2" />
                </div>

                <div>
                  <InputLabel htmlFor="cluster_id" value="Cluster" />
                  <SelectInput
                    id="cluster_id"
                    value={data.cluster_id}
                    onChange={(e) => setData('cluster_id', e.target.value)}
                    className="mt-1 block w-full"
                    required
                  >
                    <option value="">Select a cluster</option>
                    {clusters.map((cluster) => (
                      <option key={cluster.id} value={cluster.id}>
                        {cluster.name}
                      </option>
                    ))}
                  </SelectInput>
                  <InputError message={errors.cluster_id} className="mt-2" />
                </div>

                <div>
                  <InputLabel htmlFor="status" value="Status" />
                  <SelectInput
                    id="status"
                    value={data.status}
                    onChange={(e) => setData('status', e.target.value)}
                    className="mt-1 block w-full"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </SelectInput>
                  <InputError message={errors.status} className="mt-2" />
                </div>

                <div className="flex justify-end">
                  <PrimaryButton disabled={processing}>
                    {processing ? 'Creating...' : 'Create Department'}
                  </PrimaryButton>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </HRLayout>
  );
}
