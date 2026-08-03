import { useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import InputLabel from '@/Components/InputLabel';
import SelectInput from '@/Components/SelectInput';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';
import { toast } from 'react-hot-toast';

export default function SummaryPDFModal({ isOpen, onClose, events, clusters, departments }) {
  const [filters, setFilters] = useState({
    event_ids: [],
    cluster_id: '',
    department_id: '',
    date_from: '',
    date_to: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = () => {
    if (filters.event_ids.length === 0 && !filters.cluster_id && !filters.department_id && !filters.date_from && !filters.date_to) {
      toast.error('Please select at least one filter.');
      return;
    }

    setLoading(true);
    const params = new URLSearchParams();
    if (filters.event_ids.length > 0) {
      params.append('event_ids', filters.event_ids.join(','));
    }
    if (filters.cluster_id) params.append('cluster_id', filters.cluster_id);
    if (filters.department_id) params.append('department_id', filters.department_id);
    if (filters.date_from) params.append('date_from', filters.date_from);
    if (filters.date_to) params.append('date_to', filters.date_to);

    const url = route('hr.reports.attendance-summary-pdf') + '?' + params.toString();
    window.location.href = url;
    setLoading(false);
    onClose();
    toast.success('Generating PDF...');
  };

  const toggleEvent = (eventId) => {
    setFilters(prev => {
      const current = prev.event_ids.includes(eventId)
        ? prev.event_ids.filter(id => id !== eventId)
        : [...prev.event_ids, eventId];
      return { ...prev, event_ids: current };
    });
  };

  const toggleAllEvents = () => {
    setFilters(prev => {
      if (prev.event_ids.length === events.length) {
        return { ...prev, event_ids: [] };
      } else {
        return { ...prev, event_ids: events.map(e => e.id) };
      }
    });
  };

  const filteredDepartments = departments.filter(
    (dept) => !filters.cluster_id || dept.cluster_id == filters.cluster_id
  );

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/50" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 shadow-xl transition-all">
                <Dialog.Title className="text-lg font-semibold text-navy-800">
                  Export Summary PDF
                </Dialog.Title>
                <Dialog.Description className="mt-1 text-sm text-gray-500">
                  Select filters for the attendance summary report.
                </Dialog.Description>

                <div className="mt-4 space-y-4">
                  {/* Events - multi-select */}
                  <div>
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium text-gray-700">Events</label>
                      <button
                        type="button"
                        onClick={toggleAllEvents}
                        className="text-xs text-navy-600 hover:text-navy-800"
                      >
                        {filters.event_ids.length === events.length ? 'Deselect All' : 'Select All'}
                      </button>
                    </div>
                    <div className="mt-1 max-h-40 overflow-y-auto rounded border border-gray-200 p-2">
                      {events.map((event) => (
                        <label key={event.id} className="flex items-center space-x-2 text-sm py-1 hover:bg-gray-50 rounded px-1">
                          <input
                            type="checkbox"
                            checked={filters.event_ids.includes(event.id)}
                            onChange={() => toggleEvent(event.id)}
                            className="rounded border-gray-300 text-navy-600 focus:ring-navy-500"
                          />
                          <span className="truncate">{event.title} ({event.date})</span>
                        </label>
                      ))}
                      {events.length === 0 && (
                        <p className="text-sm text-gray-400">No events available.</p>
                      )}
                    </div>
                    <p className="mt-1 text-xs text-gray-400">
                      {filters.event_ids.length} of {events.length} event(s) selected.
                    </p>
                  </div>

                  {/* Cluster */}
                  <div>
                    <InputLabel value="Cluster" />
                    <SelectInput
                      value={filters.cluster_id}
                      onChange={(e) => {
                        setFilters(prev => ({
                          ...prev,
                          cluster_id: e.target.value,
                          department_id: '',
                        }));
                      }}
                      className="mt-1 block w-full"
                    >
                      <option value="">All Clusters</option>
                      {clusters.map((cluster) => (
                        <option key={cluster.id} value={cluster.id}>
                          {cluster.name}
                        </option>
                      ))}
                    </SelectInput>
                  </div>

                  {/* Department */}
                  <div>
                    <InputLabel value="Department" />
                    <SelectInput
                      value={filters.department_id}
                      onChange={(e) => setFilters(prev => ({ ...prev, department_id: e.target.value }))}
                      className="mt-1 block w-full"
                    >
                      <option value="">All Departments</option>
                      {filteredDepartments.map((dept) => (
                        <option key={dept.id} value={dept.id}>
                          {dept.name}
                        </option>
                      ))}
                    </SelectInput>
                  </div>

                  {/* Date Range */}
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <InputLabel value="Date From" />
                      <TextInput
                        type="date"
                        value={filters.date_from}
                        onChange={(e) => setFilters(prev => ({ ...prev, date_from: e.target.value }))}
                        className="mt-1 block w-full"
                      />
                    </div>
                    <div>
                      <InputLabel value="Date To" />
                      <TextInput
                        type="date"
                        value={filters.date_to}
                        onChange={(e) => setFilters(prev => ({ ...prev, date_to: e.target.value }))}
                        className="mt-1 block w-full"
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-end gap-2">
                  <button
                    onClick={onClose}
                    className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <PrimaryButton
                    onClick={handleSubmit}
                    disabled={loading}
                    className="bg-navy-700 hover:bg-navy-800"
                  >
                    {loading ? 'Generating...' : 'Generate PDF'}
                  </PrimaryButton>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
