import { useEffect } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Transition } from '@headlessui/react';
import { LogIn, User, Lock } from 'lucide-react';

export default function Login({ status, canResetPassword }) {
  const { data, setData, post, processing, errors, reset } = useForm({
    username: '',
    password: '',
    remember: false,
  });

  useEffect(() => {
    return () => {
      reset('password');
    };
  }, []);

  const submit = (e) => {
    e.preventDefault();
    post(route('login'));
  };

  return (
    <GuestLayout>
      <Head title="Log in" />

      <div className="w-full max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-navy-100 text-navy-700">
            <LogIn className="h-8 w-8" />
          </div>
          <h2 className="mt-4 text-2xl font-bold text-navy-800">Welcome Back</h2>
          <p className="mt-1 text-sm text-gray-500">
            Sign in to your account to continue
          </p>
        </div>

        {/* Card */}
        <div className="overflow-hidden rounded-xl bg-white shadow-lg">
          <div className="p-6 sm:p-8">
            {status && (
              <div className="mb-4 rounded-md bg-green-50 p-3 text-sm font-medium text-green-800">
                {status}
              </div>
            )}

            <form onSubmit={submit} className="space-y-6">
              {/* Username */}
              <div>
                <InputLabel htmlFor="username" value="Username" className="text-sm font-medium text-gray-700" />
                <div className="relative mt-1">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <User className="h-4 w-4 text-gray-400" />
                  </div>
                  <TextInput
                    id="username"
                    type="text"
                    name="username"
                    value={data.username}
                    className="block w-full rounded-lg border-gray-300 pl-10 shadow-sm focus:border-navy-500 focus:ring-navy-500"
                    autoComplete="username"
                    isFocused={true}
                    onChange={(e) => setData('username', e.target.value)}
                    placeholder="Enter your username"
                  />
                </div>
                <InputError message={errors.username} className="mt-2" />
              </div>

              {/* Password */}
              <div>
                {/* <div className="flex items-center justify-between">
                  <InputLabel htmlFor="password" value="Password" className="text-sm font-medium text-gray-700" />
                  {canResetPassword && (
                    <Link
                      href={route('password.request')}
                      className="text-sm font-medium text-navy-600 hover:text-navy-800 focus:outline-none focus:underline"
                    >
                      Forgot password?
                    </Link>
                  )}
                </div> */}
                <div className="relative mt-1">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Lock className="h-4 w-4 text-gray-400" />
                  </div>
                  <TextInput
                    id="password"
                    type="password"
                    name="password"
                    value={data.password}
                    className="block w-full rounded-lg border-gray-300 pl-10 shadow-sm focus:border-navy-500 focus:ring-navy-500"
                    autoComplete="current-password"
                    onChange={(e) => setData('password', e.target.value)}
                    placeholder="Enter your password"
                  />
                </div>
                <InputError message={errors.password} className="mt-2" />
              </div>

              {/* Remember Me */}
              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="remember"
                    checked={data.remember}
                    onChange={(e) => setData('remember', e.target.checked)}
                    className="rounded border-gray-300 text-navy-600 shadow-sm focus:ring-navy-500"
                  />
                  <span className="ml-2 text-sm text-gray-600">Remember me</span>
                </label>
              </div>

              {/* Submit Button */}
              <PrimaryButton
                className="w-full justify-center rounded-lg bg-navy-700 px-4 py-3 text-white hover:bg-navy-800 focus:ring-2 focus:ring-navy-500 focus:ring-offset-2"
                disabled={processing}
              >
                {processing ? (
                  <span className="flex items-center">
                    <svg className="mr-2 h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Signing in...
                  </span>
                ) : (
                  'Sign in'
                )}
              </PrimaryButton>
            </form>

            {/* Footer */}
            <div className="mt-6 text-center text-sm text-gray-500">
              Don't have an account?{' '}
              <Link
                href={route('register')}
                className="font-medium text-navy-600 hover:text-navy-800 focus:outline-none focus:underline"
              >
                Register
              </Link>
            </div>
          </div>
        </div>

        {/* Version Info */}
        <div className="mt-6 text-center text-xs text-gray-400">
          QR Attendance System
        </div>
      </div>
    </GuestLayout>
  );
}
