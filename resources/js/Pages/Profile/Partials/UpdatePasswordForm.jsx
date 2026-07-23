import { useRef } from 'react';
import { useForm } from '@inertiajs/react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import { Lock } from 'lucide-react';

export default function UpdatePasswordForm() {
  const passwordInput = useRef();
  const currentPasswordInput = useRef();

  const { data, setData, errors, put, reset, processing, recentlySuccessful } = useForm({
    current_password: '',
    password: '',
    password_confirmation: '',
  });

  const submit = (e) => {
    e.preventDefault();
    put(route('profile.password.update'), {
      preserveScroll: true,
      onSuccess: () => reset(),
      onError: (errors) => {
        if (errors.password) {
          reset('password', 'password_confirmation');
          passwordInput.current.focus();
        }
        if (errors.current_password) {
          reset('current_password');
          currentPasswordInput.current.focus();
        }
      },
    });
  };

  return (
    <section className="space-y-6">
      <header>
        <h2 className="text-lg font-medium text-navy-800">Change Password</h2>
        <p className="mt-1 text-sm text-gray-600">Update your account password.</p>
      </header>

      <form onSubmit={submit} className="space-y-6">
        <div>
          <InputLabel htmlFor="current_password" value="Current Password" />
          <div className="relative mt-1">
            <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <TextInput
              ref={currentPasswordInput}
              id="current_password"
              type="password"
              value={data.current_password}
              onChange={(e) => setData('current_password', e.target.value)}
              className="block w-full rounded-lg border-gray-300 pl-9 shadow-sm focus:border-navy-500 focus:ring-navy-500"
              autoComplete="current-password"
            />
          </div>
          <InputError message={errors.current_password} className="mt-2" />
        </div>

        <div>
          <InputLabel htmlFor="password" value="New Password" />
          <div className="relative mt-1">
            <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <TextInput
              ref={passwordInput}
              id="password"
              type="password"
              value={data.password}
              onChange={(e) => setData('password', e.target.value)}
              className="block w-full rounded-lg border-gray-300 pl-9 shadow-sm focus:border-navy-500 focus:ring-navy-500"
              autoComplete="new-password"
            />
          </div>
          <InputError message={errors.password} className="mt-2" />
        </div>

        <div>
          <InputLabel htmlFor="password_confirmation" value="Confirm Password" />
          <div className="relative mt-1">
            <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <TextInput
              id="password_confirmation"
              type="password"
              value={data.password_confirmation}
              onChange={(e) => setData('password_confirmation', e.target.value)}
              className="block w-full rounded-lg border-gray-300 pl-9 shadow-sm focus:border-navy-500 focus:ring-navy-500"
              autoComplete="new-password"
            />
          </div>
          <InputError message={errors.password_confirmation} className="mt-2" />
        </div>

        <div className="flex items-center gap-4">
          <PrimaryButton disabled={processing} className="bg-navy-700 hover:bg-navy-800">
            {processing ? 'Updating...' : 'Update Password'}
          </PrimaryButton>
          {recentlySuccessful && (
            <p className="text-sm text-green-600">Saved.</p>
          )}
        </div>
      </form>
    </section>
  );
}
