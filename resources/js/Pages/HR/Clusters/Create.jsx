import { Head, useForm, Link } from '@inertiajs/react';
import HRLayout from '@/Layouts/HRLayout';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import SelectInput from '@/Components/SelectInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import { ArrowLeft } from 'lucide-react';

export default function Create({ auth }) {
  const { data, setData, post, processing, errors } = useForm({
    name: '',
    description: '',
    status: 'active',
  });

  const submit = (e) => {
    e.preventDefault();
    post(route('hr.clusters.store'));
  };

  return (
    <HRLayout user={auth.user}>
      <Head title="Create Cluster" />

      <div className="py-8 sm:py-12">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-xl bg-white shadow-sm">
            <div className="p-6 sm:p-8">
              <div className="flex items-center gap-4 mb-6">
                <Link href={route('hr.clusters.index')} className="text-gray-400 hover:text-gray-600">
                  <ArrowLeft className="h-5 w-5" />
                </Link>
                <h2 className="text-2xl font-bold text-navy-800">Create Cluster</h2>
              </div>

              <form onSubmit={submit} className="space-y-6">
                <div>
                  <InputLabel htmlFor="name" value="Cluster Name" />
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
                  <InputLabel htmlFor="description" value="Description (optional)" />
                  <textarea
                    id="description"
                    value={data.description}
                    onChange={(e) => setData('description', e.target.value)}
                    rows={3}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-navy-500 focus:ring-navy-500"
                  />
                  <InputError message={errors.description} className="mt-2" />
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
                    {processing ? 'Creating...' : 'Create Cluster'}
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
