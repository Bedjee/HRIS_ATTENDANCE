import { useState } from 'react';
import { Head, usePage, router } from '@inertiajs/react';
import axios from 'axios';
import HRLayout from '@/Layouts/HRLayout';
import PrimaryButton from '@/Components/PrimaryButton';
import InputError from '@/Components/InputError';
import { toast } from 'react-hot-toast';

export default function Import({ auth }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [importing, setImporting] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setPreview(null);
  };

  const handlePreview = async () => {
    if (!file) {
      toast.error('Please select a file.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    setLoading(true);
    try {
      const response = await axios.post(route('hr.employees.import.preview'), formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setPreview(response.data.data);
      toast.success('Preview loaded.');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Preview failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async () => {
    if (!preview || preview.valid.length === 0) {
      toast.error('No valid records to import.');
      return;
    }

    setImporting(true);
    try {
      const response = await axios.post(route('hr.employees.import.confirm'), {
        valid_records: preview.valid,
      });
      const { created, failed } = response.data.data;
      toast.success(`Imported ${created.length} employees.`);
      if (failed.length > 0) {
        toast.error(`${failed.length} records failed.`);
      }
      router.visit(route('hr.employees.index'));
    } catch (error) {
      toast.error(error.response?.data?.message || 'Import failed.');
    } finally {
      setImporting(false);
    }
  };

  return (
    <HRLayout user={auth.user}>
      <Head title="Import Employees" />

      <div className="py-8 sm:py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-xl bg-white shadow-sm">
            <div className="p-6 sm:p-8">
              <div className="flex items-center gap-4 mb-6">
                <h2 className="text-2xl font-bold text-navy-800">Import Employees</h2>
              </div>
              <p className="mt-1 text-sm text-gray-600">
                Upload an Excel file with columns: <strong>Last Name, First Name, Middle Initial, Department</strong>.
                Department names must match existing departments in the system.
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-4">
                <input
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  onChange={handleFileChange}
                  className="block w-full max-w-md text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
                />
                <PrimaryButton onClick={handlePreview} disabled={loading || !file}>
                  {loading ? 'Previewing...' : 'Preview'}
                </PrimaryButton>
              </div>

              {preview && (
                <div className="mt-8">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div className="bg-green-100 p-4 rounded-lg">
                      <span className="font-bold text-green-800">Valid</span>
                      <span className="ml-2 text-2xl">{preview.valid.length}</span>
                    </div>
                    <div className="bg-yellow-100 p-4 rounded-lg">
                      <span className="font-bold text-yellow-800">Duplicates</span>
                      <span className="ml-2 text-2xl">{preview.duplicates.length}</span>
                    </div>
                    <div className="bg-red-100 p-4 rounded-lg">
                      <span className="font-bold text-red-800">Invalid</span>
                      <span className="ml-2 text-2xl">{preview.invalid.length}</span>
                    </div>
                  </div>

                  {preview.valid.length > 0 && (
                    <div className="mt-6">
                      <h3 className="text-lg font-semibold text-navy-700">Valid Records</h3>
                      <div className="mt-2 overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">#</th>
                              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">First Name</th>
                              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Last Name</th>
                              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Middle Initial</th>
                              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Department</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200 bg-white">
                            {preview.valid.map((rec, idx) => (
                              <tr key={idx}>
                                <td className="px-4 py-3 text-sm text-gray-900">{idx + 1}</td>
                                <td className="px-4 py-3 text-sm text-gray-900">{rec.first_name}</td>
                                <td className="px-4 py-3 text-sm text-gray-900">{rec.last_name}</td>
                                <td className="px-4 py-3 text-sm text-gray-900">{rec.middle_initial || '—'}</td>
                                <td className="px-4 py-3 text-sm text-gray-900">{rec.department_name}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {preview.duplicates.length > 0 && (
                    <div className="mt-6">
                      <h3 className="text-lg font-semibold text-yellow-700">Duplicates</h3>
                      <div className="mt-2 overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Row</th>
                              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Name</th>
                              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Department</th>
                              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Duplicate Type</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200 bg-white">
                            {preview.duplicates.map((rec, idx) => (
                              <tr key={idx}>
                                <td className="px-4 py-3 text-sm text-gray-900">{rec.row}</td>
                                <td className="px-4 py-3 text-sm text-gray-900">{rec.first_name} {rec.last_name}</td>
                                <td className="px-4 py-3 text-sm text-gray-900">{rec.department_name}</td>
                                <td className="px-4 py-3 text-sm">
                                  <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${rec.duplicate_type === 'database' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                    {rec.duplicate_type === 'database' ? 'Already exists' : 'Duplicate within file'}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {preview.invalid.length > 0 && (
                    <div className="mt-6">
                      <h3 className="text-lg font-semibold text-red-700">Invalid Records</h3>
                      <div className="mt-2 overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Row</th>
                              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Errors</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200 bg-white">
                            {preview.invalid.map((rec, idx) => (
                              <tr key={idx}>
                                <td className="px-4 py-3 text-sm text-gray-900">{rec.row}</td>
                                <td className="px-4 py-3 text-sm text-red-600">{rec.errors.join(', ')}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {preview.valid.length > 0 && (
                    <div className="mt-6">
                      <PrimaryButton
                        onClick={handleConfirm}
                        disabled={importing}
                        className="bg-navy-700 hover:bg-navy-800"
                      >
                        {importing ? 'Importing...' : 'Confirm Import'}
                      </PrimaryButton>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </HRLayout>
  );
}
