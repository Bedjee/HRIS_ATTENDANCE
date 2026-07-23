import { useForm } from '@inertiajs/react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import { User, UserCircle } from 'lucide-react';

export default function UpdateEmployeeInformationForm({ user, employee }) {
  const { data, setData, patch, processing, errors, recentlySuccessful } = useForm({
    first_name: employee.first_name || '',
    middle_initial: employee.middle_initial || '',
    last_name: employee.last_name || '',
    username: user.username || '',
  });

  const submit = (e) => {
    e.preventDefault();
    patch(route('profile.update'));
  };

  return (
    <section className="space-y-6">
      <header>
        <h2 className="text-lg font-medium text-navy-800">Personal Information</h2>
        <p className="mt-1 text-sm text-gray-600">Update your name and username.</p>
      </header>

      <form onSubmit={submit} className="space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <InputLabel htmlFor="first_name" value="First Name" />
            <div className="relative mt-1">
              <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <TextInput
                id="first_name"
                type="text"
                value={data.first_name}
                onChange={(e) => setData('first_name', e.target.value)}
                className="block w-full rounded-lg border-gray-300 pl-9 shadow-sm focus:border-navy-500 focus:ring-navy-500"
                required
              />
            </div>
            <InputError message={errors.first_name} className="mt-2" />
          </div>

          <div>
            <InputLabel htmlFor="middle_initial" value="Middle Initial" />
            <div className="relative mt-1">
              <UserCircle className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <TextInput
                id="middle_initial"
                type="text"
                value={data.middle_initial}
                onChange={(e) => setData('middle_initial', e.target.value)}
                className="block w-full rounded-lg border-gray-300 pl-9 shadow-sm focus:border-navy-500 focus:ring-navy-500"
                maxLength={1}
              />
            </div>
            <InputError message={errors.middle_initial} className="mt-2" />
          </div>

          <div>
            <InputLabel htmlFor="last_name" value="Last Name" />
            <div className="relative mt-1">
              <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <TextInput
                id="last_name"
                type="text"
                value={data.last_name}
                onChange={(e) => setData('last_name', e.target.value)}
                className="block w-full rounded-lg border-gray-300 pl-9 shadow-sm focus:border-navy-500 focus:ring-navy-500"
                required
              />
            </div>
            <InputError message={errors.last_name} className="mt-2" />
          </div>
        </div>

        <div className="max-w-sm">
          <InputLabel htmlFor="username" value="Username" />
          <div className="relative mt-1">
            <UserCircle className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <TextInput
              id="username"
              type="text"
              value={data.username}
              onChange={(e) => setData('username', e.target.value)}
              className="block w-full rounded-lg border-gray-300 pl-9 shadow-sm focus:border-navy-500 focus:ring-navy-500"
              required
            />
          </div>
          <InputError message={errors.username} className="mt-2" />
        </div>

        <div className="flex items-center gap-4">
          <PrimaryButton disabled={processing} className="bg-navy-700 hover:bg-navy-800">
            {processing ? 'Saving...' : 'Save Changes'}
          </PrimaryButton>
          {recentlySuccessful && (
            <p className="text-sm text-green-600">Saved.</p>
          )}
        </div>
      </form>
    </section>
  );
}
