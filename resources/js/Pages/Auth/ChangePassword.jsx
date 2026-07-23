import { useState, useRef, forwardRef } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Lock, Shield, ArrowLeft, Eye, EyeOff } from 'lucide-react';

// PasswordField component with forwardRef
const PasswordField = forwardRef(({
  id,
  label,
  value,
  onChange,
  error,
  placeholder,
  autoComplete,
  show,
  setShow,
}, ref) => {
  const toggleVisibility = () => {
    setShow(!show);
    // Focus after toggle
    setTimeout(() => {
      if (ref && ref.current) {
        ref.current.focus();
      }
    }, 0);
  };

  return (
    <div>
      <InputLabel htmlFor={id} value={label} className="text-sm font-medium text-gray-700" />
      <div className="relative mt-1">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <Lock className="h-4 w-4 text-gray-400" />
        </div>
        <TextInput
          id={id}
          type={show ? 'text' : 'password'}
          name={id}
          value={value}
          ref={ref}
          className="block w-full rounded-lg border-gray-300 pl-10 pr-10 shadow-sm focus:border-navy-500 focus:ring-navy-500"
          autoComplete={autoComplete}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required
        />
        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            toggleVisibility();
          }}
          className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 focus:outline-none"
          aria-label={show ? 'Hide password' : 'Show password'}
        >
          {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
      <InputError message={error} className="mt-2" />
    </div>
  );
});

PasswordField.displayName = 'PasswordField';

export default function ChangePassword({ mustChange }) {
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const currentRef = useRef(null);
  const newRef = useRef(null);
  const confirmRef = useRef(null);

  const { data, setData, post, processing, errors, reset } = useForm({
    current_password: '',
    password: '',
    password_confirmation: '',
  });

  const submit = (e) => {
    e.preventDefault();
    post(route('password.update'), {
      onSuccess: () => reset(),
    });
  };

  return (
    <GuestLayout>
      <Head title="Change Password" />

      <div className="w-full max-w-md mx-auto">
        {/* Icon and Header */}
        <div className="text-center mb-8">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-navy-100 text-navy-700">
            <Shield className="h-8 w-8" />
          </div>
          <h2 className="mt-4 text-2xl font-bold text-navy-800">
            {mustChange ? 'Set New Password' : 'Change Password'}
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            {mustChange
              ? 'You must change your password before accessing the dashboard.'
              : 'Update your password to keep your account secure.'}
          </p>
        </div>

        {/* Card */}
        <div className="overflow-hidden rounded-xl bg-white shadow-lg">
          <div className="p-6 sm:p-8">
            <form onSubmit={submit} className="space-y-6">
              <PasswordField
                id="current_password"
                label="Current Password"
                value={data.current_password}
                onChange={(val) => setData('current_password', val)}
                error={errors.current_password}
                placeholder="Enter your current password"
                autoComplete="current-password"
                show={showCurrent}
                setShow={setShowCurrent}
                ref={currentRef}
              />

              <PasswordField
                id="password"
                label="New Password"
                value={data.password}
                onChange={(val) => setData('password', val)}
                error={errors.password}
                placeholder="Enter new password"
                autoComplete="new-password"
                show={showNew}
                setShow={setShowNew}
                ref={newRef}
              />

              <PasswordField
                id="password_confirmation"
                label="Confirm Password"
                value={data.password_confirmation}
                onChange={(val) => setData('password_confirmation', val)}
                error={errors.password_confirmation}
                placeholder="Confirm new password"
                autoComplete="new-password"
                show={showConfirm}
                setShow={setShowConfirm}
                ref={confirmRef}
              />

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <Link
                  href={route('login')}
                  className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700"
                >
                  <ArrowLeft className="mr-1 h-4 w-4" />
                  Back to Login
                </Link>
                <PrimaryButton
                  className="w-full sm:w-auto justify-center rounded-lg bg-navy-700 px-6 py-3 text-white hover:bg-navy-800 focus:ring-2 focus:ring-navy-500 focus:ring-offset-2"
                  disabled={processing}
                >
                  {processing ? (
                    <span className="flex items-center">
                      <svg className="mr-2 h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Updating...
                    </span>
                  ) : (
                    'Update Password'
                  )}
                </PrimaryButton>
              </div>
            </form>
          </div>
        </div>

        <div className="mt-6 text-center text-xs text-gray-400">
          QR Attendance System
        </div>
      </div>
    </GuestLayout>
  );
}
