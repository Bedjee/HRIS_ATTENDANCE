import { Head } from '@inertiajs/react';
import EmployeeLayout from '@/Layouts/EmployeeLayout';
import UpdateEmployeeInformationForm from './Partials/UpdateEmployeeInformationForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import { UserCircle } from 'lucide-react';

export default function Edit({ auth, user, employee }) {
  return (
    <EmployeeLayout user={auth.user}>
      <Head title="Profile" />

      <div className="py-8 sm:py-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="mb-6 flex items-center">
            <UserCircle className="h-8 w-8 text-navy-600" />
            <h1 className="ml-3 text-2xl font-bold text-navy-800">My Profile</h1>
          </div>

          <div className="space-y-6">
            <div className="overflow-hidden rounded-xl bg-white shadow-sm">
              <div className="p-6 sm:p-8">
                <UpdateEmployeeInformationForm user={user} employee={employee} />
              </div>
            </div>

            <div className="overflow-hidden rounded-xl bg-white shadow-sm">
              <div className="p-6 sm:p-8">
                <UpdatePasswordForm />
              </div>
            </div>
          </div>
        </div>
      </div>
    </EmployeeLayout>
  );
}
