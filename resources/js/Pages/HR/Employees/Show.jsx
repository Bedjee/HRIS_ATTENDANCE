import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import HRLayout from '@/Layouts/HRLayout';
import { toast } from 'react-hot-toast';
import {
  User,
  Mail,
  Building,
  Users,
  Key,
  QrCode,
  Edit,
  ArrowLeft,
  Shield,
  Clock,
  Calendar,
  MapPin,
} from 'lucide-react';

const defaultAvatar = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect width='100' height='100' fill='%23e2e8f0'/%3E%3Ctext x='50' y='55' text-anchor='middle' font-size='40' font-family='sans-serif' fill='%2394a3b8'%3E%3C/text%3E%3C/svg%3E";

export default function Show({ auth, employee, clusters, departments }) {
  const [resetting, setResetting] = useState(false);

  const handleResetPassword = () => {
    if (!confirm(`Reset password for ${employee.full_name}?`)) return;
    setResetting(true);
    router.post(
      route('hr.employees.reset-password', employee.id),
      {},
      {
        onSuccess: () => {
          toast.success('Password reset successfully.');
          setResetting(false);
        },
        onError: () => {
          toast.error('Failed to reset password.');
          setResetting(false);
        },
      }
    );
  };

  // Helper for status badge
  const statusBadge = (active) => {
    return active
      ? 'bg-green-100 text-green-800'
      : 'bg-red-100 text-red-800';
  };

  // Helper for employment status badge
  const employmentStatusBadge = (status) => {
    const colors = {
      'Regular': 'bg-blue-100 text-blue-800',
      'Job Order (JO)': 'bg-purple-100 text-purple-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <HRLayout user={auth.user}>
      <Head title={`Profile - ${employee.full_name}`} />

      <div className="py-4 sm:py-6">
        <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Link
                href={route('hr.employees.index')}
                className="rounded-full p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
              >
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <h1 className="text-xl font-bold text-navy-800 sm:text-2xl lg:text-3xl">
                Employee Profile
              </h1>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link
                href={route('hr.employees.edit', employee.id)}
                className="inline-flex items-center rounded-md bg-navy-700 px-3 py-2 text-sm font-medium text-white hover:bg-navy-800"
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit Profile
              </Link>
              <button
                onClick={handleResetPassword}
                disabled={resetting}
                className="inline-flex items-center rounded-md bg-yellow-600 px-3 py-2 text-sm font-medium text-white hover:bg-yellow-700 disabled:opacity-50"
              >
                <Key className="mr-2 h-4 w-4" />
                Reset Password
              </button>
              <Link
                href={route('hr.employees.qr', employee.id)}
                className="inline-flex items-center rounded-md bg-green-600 px-3 py-2 text-sm font-medium text-white hover:bg-green-700"
              >
                <QrCode className="mr-2 h-4 w-4" />
                QR Code
              </Link>
            </div>
          </div>

          {/* Main Profile Card */}
          <div className="overflow-hidden rounded-xl bg-white shadow-sm">
            <div className="p-4 sm:p-6">
              <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
                {/* Photo */}
                <div className="flex-shrink-0">
                  <img
                    src={employee.profile_photo_url || defaultAvatar}
                    alt={employee.full_name}
                    className="h-32 w-32 rounded-full object-cover ring-4 ring-navy-100 sm:h-40 sm:w-40"
                    onError={(e) => { e.target.src = defaultAvatar; }}
                  />
                </div>

                {/* Basic Info */}
                <div className="flex-1 text-center sm:text-left">
                  <h2 className="text-2xl font-bold text-navy-800 sm:text-3xl">
                    {employee.formatted_name}
                  </h2>
                  <div className="mt-1 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                    <span className="inline-flex items-center rounded-full bg-navy-100 px-2.5 py-0.5 text-xs font-medium text-navy-800">
                      {employee.department?.name || 'Unassigned'}
                    </span>
                    <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-700">
                      {employee.department?.cluster?.name || '—'}
                    </span>
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusBadge(employee.user?.is_active ?? true)}`}>
                      {employee.user?.is_active ? 'Active' : 'Inactive'}
                    </span>
                    {/* Employment Status Badge */}
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${employmentStatusBadge(employee.employment_status)}`}>
                      {employee.employment_status || '—'}
                    </span>
                  </div>
                  <div className="mt-4 grid grid-cols-1 gap-2 text-sm sm:grid-cols-2 sm:gap-4">
                    <div className="flex items-center gap-2 text-gray-600">
                      <User className="h-4 w-4" />
                      <span>Username: <span className="font-medium">{employee.user?.username || '—'}</span></span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Details Grid */}
          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* Personal Information */}
            <div className="rounded-xl bg-white p-4 shadow-sm sm:p-6">
              <h3 className="mb-3 flex items-center text-sm font-semibold uppercase tracking-wider text-gray-500">
                <User className="mr-2 h-4 w-4" />
                Personal Information
              </h3>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between border-b border-gray-100 py-1">
                  <dt className="text-gray-500">Full Name</dt>
                  <dd className="font-medium text-navy-800">{employee.formatted_name}</dd>
                </div>
                <div className="flex justify-between border-b border-gray-100 py-1">
                  <dt className="text-gray-500">First Name</dt>
                  <dd>{employee.first_name}</dd>
                </div>
                <div className="flex justify-between border-b border-gray-100 py-1">
                  <dt className="text-gray-500">Last Name</dt>
                  <dd>{employee.last_name}</dd>
                </div>
                <div className="flex justify-between border-b border-gray-100 py-1">
                  <dt className="text-gray-500">Middle Initial</dt>
                  <dd>{employee.middle_initial || '—'}</dd>
                </div>
              </dl>
            </div>

            {/* Employment Details */}
            <div className="rounded-xl bg-white p-4 shadow-sm sm:p-6">
              <h3 className="mb-3 flex items-center text-sm font-semibold uppercase tracking-wider text-gray-500">
                <Building className="mr-2 h-4 w-4" />
                Employment Details
              </h3>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between border-b border-gray-100 py-1">
                  <dt className="text-gray-500">Department</dt>
                  <dd className="font-medium text-navy-800">{employee.department?.name || 'Unassigned'}</dd>
                </div>
                <div className="flex justify-between border-b border-gray-100 py-1">
                  <dt className="text-gray-500">Cluster</dt>
                  <dd>{employee.department?.cluster?.name || '—'}</dd>
                </div>
                {/* Employment Status - NEW */}
                <div className="flex justify-between border-b border-gray-100 py-1">
                  <dt className="text-gray-500">Employment Status</dt>
                  <dd>
                    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${employmentStatusBadge(employee.employment_status)}`}>
                      {employee.employment_status || '—'}
                    </span>
                  </dd>
                </div>
                <div className="flex justify-between border-b border-gray-100 py-1">
                  <dt className="text-gray-500">Employee ID</dt>
                  <dd>#{employee.id}</dd>
                </div>
                <div className="flex justify-between border-b border-gray-100 py-1">
                  <dt className="text-gray-500">QR Token</dt>
                  <dd className="font-mono text-xs">{employee.qr_token}</dd>
                </div>
              </dl>
            </div>

            {/* Account Information */}
            <div className="rounded-xl bg-white p-4 shadow-sm sm:p-6">
              <h3 className="mb-3 flex items-center text-sm font-semibold uppercase tracking-wider text-gray-500">
                <Shield className="mr-2 h-4 w-4" />
                Account Information
              </h3>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between border-b border-gray-100 py-1">
                  <dt className="text-gray-500">Username</dt>
                  <dd>{employee.user?.username || '—'}</dd>
                </div>
                <div className="flex justify-between border-b border-gray-100 py-1">
                  <dt className="text-gray-500">Email</dt>
                  <dd>{employee.user?.email || '—'}</dd>
                </div>
                <div className="flex justify-between border-b border-gray-100 py-1">
                  <dt className="text-gray-500">Status</dt>
                  <dd>
                    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${statusBadge(employee.user?.is_active ?? true)}`}>
                      {employee.user?.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </dd>
                </div>
                <div className="flex justify-between border-b border-gray-100 py-1">
                  <dt className="text-gray-500">Last Login</dt>
                  <dd>{employee.user?.last_login_at ? new Date(employee.user.last_login_at).toLocaleString() : 'Never'}</dd>
                </div>
              </dl>
            </div>

            {/* Additional Info (if any) */}
            <div className="rounded-xl bg-white p-4 shadow-sm sm:p-6">
              <h3 className="mb-3 flex items-center text-sm font-semibold uppercase tracking-wider text-gray-500">
                <Clock className="mr-2 h-4 w-4" />
                System Info
              </h3>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between border-b border-gray-100 py-1">
                  <dt className="text-gray-500">Created At</dt>
                  <dd>{new Date(employee.created_at).toLocaleString()}</dd>
                </div>
                <div className="flex justify-between border-b border-gray-100 py-1">
                  <dt className="text-gray-500">Last Updated</dt>
                  <dd>{new Date(employee.updated_at).toLocaleString()}</dd>
                </div>
                {employee.user?.created_at && (
                  <div className="flex justify-between border-b border-gray-100 py-1">
                    <dt className="text-gray-500">Account Created</dt>
                    <dd>{new Date(employee.user.created_at).toLocaleString()}</dd>
                  </div>
                )}
              </dl>
            </div>
          </div>

          {/* Quick Actions Footer */}
          <div className="mt-6 flex flex-wrap justify-center gap-3 border-t border-gray-200 pt-6">
            <Link
              href={route('hr.employees.edit', employee.id)}
              className="inline-flex items-center rounded-md bg-navy-700 px-4 py-2 text-sm font-medium text-white hover:bg-navy-800"
            >
              <Edit className="mr-2 h-4 w-4" />
              Edit Profile
            </Link>
            <button
              onClick={handleResetPassword}
              disabled={resetting}
              className="inline-flex items-center rounded-md bg-yellow-600 px-4 py-2 text-sm font-medium text-white hover:bg-yellow-700 disabled:opacity-50"
            >
              <Key className="mr-2 h-4 w-4" />
              Reset Password
            </button>
            <Link
              href={route('hr.employees.qr', employee.id)}
              className="inline-flex items-center rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
            >
              <QrCode className="mr-2 h-4 w-4" />
              View QR Code
            </Link>
          </div>
        </div>
      </div>
    </HRLayout>
  );
}
