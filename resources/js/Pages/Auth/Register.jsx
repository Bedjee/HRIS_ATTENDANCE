import { Head, Link } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';
import { Shield, Lock, ArrowLeft } from 'lucide-react';

export default function Register() {
  return (
    <GuestLayout>
      <Head title="Access Restricted" />

      <div className="w-full max-w-md mx-auto">
        {/* Icon and Header */}
        <div className="text-center mb-8">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-navy-100 text-navy-700">
            <Shield className="h-10 w-10" />
          </div>
          <h2 className="mt-4 text-2xl font-bold text-navy-800">Access Restricted</h2>
          <p className="mt-1 text-sm text-gray-500">
            Public registration is not available
          </p>
        </div>

        {/* Info Card */}
        <div className="overflow-hidden rounded-xl bg-white shadow-lg">
          <div className="p-6 sm:p-8">
            <div className="space-y-4 text-gray-600">
              <p>
                This system does <strong>not</strong> support public account registration.
              </p>
              <p>
                Employee accounts are created and managed exclusively by the
                <strong> Human Resources (HR)</strong> department.
              </p>
              <div className="rounded-lg bg-navy-50 p-4 border border-navy-100">
                <div className="flex items-start gap-3">
                  <Lock className="h-5 w-5 text-navy-600 mt-0.5" />
                  <div>
                    <p className="text-sm text-navy-800 font-medium">Need access?</p>
                    <p className="text-sm text-navy-700">
                      Contact your HR administrator to obtain your login credentials.
                      Once your account is created, you will receive a username and
                      temporary password.
                    </p>
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-500">
                You will be required to change your password upon your first login.
              </p>
            </div>

            {/* Back to Login Button */}
            <div className="mt-8">
              <Link
                href={route('login')}
                className="inline-flex w-full items-center justify-center rounded-lg bg-navy-700 px-4 py-3 text-sm font-medium text-white shadow-sm hover:bg-navy-800 focus:outline-none focus:ring-2 focus:ring-navy-500 focus:ring-offset-2"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Login
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center text-xs text-gray-400">
          QR Attendance System
        </div>
      </div>
    </GuestLayout>
  );
}
