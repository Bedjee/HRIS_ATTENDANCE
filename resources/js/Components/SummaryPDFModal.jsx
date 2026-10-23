import { useState, useMemo } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import PrimaryButton from '@/Components/PrimaryButton';
import { toast } from 'react-hot-toast';
import {
  X,
  RotateCcw,
  Calendar,
  MapPin,
  Briefcase,
  Users,
  Hash,
  FileText,
  Check,
} from 'lucide-react';

export default function SummaryPDFModal({
  isOpen,
  onClose,
  events,
  clusters,
  departments,
  statuses = [],
}) {
  const [filters, setFilters] = useState({
    event_ids: [],
    cluster_id: '',
    department_id: '',
    date_from: '',
    date_to: '',
    max_attendance: '',
    employment_status: '',
  });
  const [loading, setLoading] = useState(false);

  // ─── Helpers ───────────────────────────────────────────
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.event_ids.length > 0) count++;
    if (filters.cluster_id) count++;
    if (filters.department_id) count++;
    if (filters.date_from || filters.date_to) count++;
    if (filters.max_attendance !== '') count++;
    if (filters.employment_status) count++;
    return count;
  }, [filters]);

  const filteredDepartments = departments.filter(
    (dept) => !filters.cluster_id || dept.cluster_id == filters.cluster_id
  );

  const summaryText = useMemo(() => {
    const parts = [];
    if (filters.event_ids.length > 0) {
      parts.push(`${filters.event_ids.length} event${filters.event_ids.length > 1 ? 's' : ''}`);
    }
    if (filters.cluster_id) {
      const c = clusters.find((cl) => cl.id == filters.cluster_id);
      if (c) parts.push(c.name);
    }
    if (filters.department_id) {
      const d = departments.find((dept) => dept.id == filters.department_id);
      if (d) parts.push(d.name);
    }
    if (filters.employment_status) parts.push(filters.employment_status);
    if (filters.date_from || filters.date_to) parts.push('Date range');
    if (filters.max_attendance !== '') parts.push(`≤ ${filters.max_attendance} attendances`);

    return parts.length === 0 ? 'All records will be included' : parts.join(' • ');
  }, [filters, clusters, departments]);

  // ─── Handlers ──────────────────────────────────────────
  const resetAll = () => {
    setFilters({
      event_ids: [],
      cluster_id: '',
      department_id: '',
      date_from: '',
      date_to: '',
      max_attendance: '',
      employment_status: '',
    });
  };

  const toggleEvent = (eventId) => {
    setFilters((prev) => {
      const current = prev.event_ids.includes(eventId)
        ? prev.event_ids.filter((id) => id !== eventId)
        : [...prev.event_ids, eventId];
      return { ...prev, event_ids: current };
    });
  };

  const toggleAllEvents = () => {
    setFilters((prev) => ({
      ...prev,
      event_ids:
        prev.event_ids.length === events.length ? [] : events.map((e) => e.id),
    }));
  };

  const setEmploymentStatus = (status) => {
    setFilters((prev) => ({
      ...prev,
      employment_status: prev.employment_status === status ? '' : status,
    }));
  };

  const applyDatePreset = (preset) => {
    const today = new Date();
    const fmt = (d) => d.toISOString().split('T')[0];
    let from = '';
    let to = fmt(today);

    if (preset === 'today') {
      from = fmt(today);
    } else if (preset === 'week') {
      const d = new Date(today);
      d.setDate(today.getDate() - 7);
      from = fmt(d);
    } else if (preset === 'month') {
      const d = new Date(today);
      d.setMonth(today.getMonth() - 1);
      from = fmt(d);
    } else if (preset === 'year') {
      from = fmt(new Date(today.getFullYear(), 0, 1));
    }

    setFilters((prev) => ({ ...prev, date_from: from, date_to: to }));
  };

  const handleSubmit = () => {
    if (activeFilterCount === 0) {
      toast.error('Please select at least one filter.');
      return;
    }

    setLoading(true);
    const params = new URLSearchParams();
    if (filters.event_ids.length > 0)
      params.append('event_ids', filters.event_ids.join(','));
    if (filters.cluster_id) params.append('cluster_id', filters.cluster_id);
    if (filters.department_id) params.append('department_id', filters.department_id);
    if (filters.date_from) params.append('date_from', filters.date_from);
    if (filters.date_to) params.append('date_to', filters.date_to);
    if (filters.max_attendance !== '')
      params.append('max_attendance', filters.max_attendance);
    if (filters.employment_status)
      params.append('employment_status', filters.employment_status);

    window.location.href =
      route('hr.reports.attendance-summary-pdf') + '?' + params.toString();
    setLoading(false);
    onClose();
    toast.success('Generating PDF...');
  };

  // ─── Chip component ────────────────────────────────────
  const FilterChip = ({ label, onRemove }) => (
    <span className="inline-flex items-center gap-1 rounded-full bg-navy-100 px-2.5 py-1 text-xs font-medium text-navy-800">
      {label}
      <button
        type="button"
        onClick={onRemove}
        className="rounded-full p-0.5 hover:bg-navy-200 transition-colors"
        aria-label={`Remove ${label}`}
      >
        <X className="h-3 w-3" />
      </button>
    </span>
  );

  const availableStatuses =
    statuses.length > 0 ? statuses : ['Regular', 'Job Order (JO)'];

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
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
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
              <Dialog.Panel className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl transition-all">
                {/* ═══════════ STICKY HEADER ═══════════ */}
                <div className="flex items-start justify-between gap-4 border-b border-gray-100 px-5 py-4 sm:px-6">
                  <div className="flex items-start gap-3">
                    <div className="rounded-lg bg-navy-100 p-2">
                      <FileText className="h-5 w-5 text-navy-700" />
                    </div>
                    <div>
                      <Dialog.Title className="text-lg font-semibold text-navy-800">
                        Export Summary PDF
                      </Dialog.Title>
                      <Dialog.Description className="mt-0.5 text-sm text-gray-500">
                        Choose filters to narrow down the report
                      </Dialog.Description>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    {activeFilterCount > 0 && (
                      <button
                        type="button"
                        onClick={resetAll}
                        className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700"
                        title="Reset all filters"
                      >
                        <RotateCcw className="h-4 w-4" />
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={onClose}
                      className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700"
                      aria-label="Close"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                {/* ═══════════ ACTIVE FILTER CHIPS ═══════════ */}
                {activeFilterCount > 0 && (
                  <div className="border-b border-gray-100 bg-gray-50 px-5 py-3 sm:px-6">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-medium text-gray-500">
                        Active filters:
                      </span>
                      {filters.event_ids.length > 0 && (
                        <FilterChip
                          label={`${filters.event_ids.length} event${filters.event_ids.length > 1 ? 's' : ''}`}
                          onRemove={() =>
                            setFilters((prev) => ({ ...prev, event_ids: [] }))
                          }
                        />
                      )}
                      {filters.cluster_id && (
                        <FilterChip
                          label={
                            clusters.find((c) => c.id == filters.cluster_id)?.name ||
                            'Cluster'
                          }
                          onRemove={() =>
                            setFilters((prev) => ({
                              ...prev,
                              cluster_id: '',
                              department_id: '',
                            }))
                          }
                        />
                      )}
                      {filters.department_id && (
                        <FilterChip
                          label={
                            departments.find((d) => d.id == filters.department_id)?.name ||
                            'Department'
                          }
                          onRemove={() =>
                            setFilters((prev) => ({ ...prev, department_id: '' }))
                          }
                        />
                      )}
                      {filters.employment_status && (
                        <FilterChip
                          label={filters.employment_status}
                          onRemove={() =>
                            setFilters((prev) => ({ ...prev, employment_status: '' }))
                          }
                        />
                      )}
                      {(filters.date_from || filters.date_to) && (
                        <FilterChip
                          label={`${filters.date_from || '...'} → ${filters.date_to || '...'}`}
                          onRemove={() =>
                            setFilters((prev) => ({
                              ...prev,
                              date_from: '',
                              date_to: '',
                            }))
                          }
                        />
                      )}
                      {filters.max_attendance !== '' && (
                        <FilterChip
                          label={`≤ ${filters.max_attendance} attendances`}
                          onRemove={() =>
                            setFilters((prev) => ({ ...prev, max_attendance: '' }))
                          }
                        />
                      )}
                    </div>
                  </div>
                )}

                {/* ═══════════ SCROLLABLE BODY ═══════════ */}
                <div className="flex-1 space-y-6 overflow-y-auto px-5 py-5 sm:px-6">
                  {/* ─── EVENTS SECTION ─── */}
                  <section>
                    <div className="mb-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-navy-600" />
                        <h3 className="text-sm font-semibold text-navy-800">Events</h3>
                        {filters.event_ids.length > 0 && (
                          <span className="rounded-full bg-navy-100 px-2 py-0.5 text-[10px] font-semibold text-navy-700">
                            {filters.event_ids.length}
                          </span>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={toggleAllEvents}
                        className="text-xs font-medium text-navy-600 transition-colors hover:text-navy-800"
                      >
                        {filters.event_ids.length === events.length
                          ? 'Deselect All'
                          : 'Select All'}
                      </button>
                    </div>

                    {events.length === 0 ? (
                      <div className="rounded-lg border border-dashed border-gray-200 bg-gray-50 p-6 text-center text-sm text-gray-400">
                        No events available
                      </div>
                    ) : (
                      <div className="max-h-48 overflow-y-auto rounded-lg border border-gray-200 bg-white">
                        {events.map((event) => {
                          const checked = filters.event_ids.includes(event.id);
                          return (
                            <label
                              key={event.id}
                              className={`flex cursor-pointer items-center gap-3 border-b border-gray-100 px-3 py-2 text-sm transition-colors last:border-b-0 ${
                                checked ? 'bg-navy-50' : 'hover:bg-gray-50'
                              }`}
                            >
                              <span
                                className={`flex h-4 w-4 flex-shrink-0 items-center justify-center rounded border transition-colors ${
                                  checked
                                    ? 'border-navy-700 bg-navy-700'
                                    : 'border-gray-300 bg-white'
                                }`}
                              >
                                {checked && <Check className="h-3 w-3 text-white" />}
                              </span>
                              <input
                                type="checkbox"
                                checked={checked}
                                onChange={() => toggleEvent(event.id)}
                                className="sr-only"
                              />
                              <span className="flex-1 truncate text-gray-800">
                                {event.title}
                              </span>
                              <span className="flex-shrink-0 text-xs text-gray-400">
                                {event.date}
                              </span>
                            </label>
                          );
                        })}
                      </div>
                    )}
                  </section>

                  {/* ─── LOCATION (cluster + department) ─── */}
                  <section>
                    <div className="mb-3 flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-navy-600" />
                      <h3 className="text-sm font-semibold text-navy-800">Location</h3>
                    </div>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <div>
                        <label className="mb-1 block text-xs font-medium text-gray-600">
                          Cluster
                        </label>
                        <select
                          value={filters.cluster_id}
                          onChange={(e) =>
                            setFilters((prev) => ({
                              ...prev,
                              cluster_id: e.target.value,
                              department_id: '',
                            }))
                          }
                          className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm transition-colors focus:border-navy-500 focus:outline-none focus:ring-1 focus:ring-navy-500"
                        >
                          <option value="">All Clusters</option>
                          {clusters.map((cluster) => (
                            <option key={cluster.id} value={cluster.id}>
                              {cluster.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="mb-1 block text-xs font-medium text-gray-600">
                          Department
                        </label>
                        <select
                          value={filters.department_id}
                          onChange={(e) =>
                            setFilters((prev) => ({
                              ...prev,
                              department_id: e.target.value,
                            }))
                          }
                          className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm transition-colors focus:border-navy-500 focus:outline-none focus:ring-1 focus:ring-navy-500"
                        >
                          <option value="">All Departments</option>
                          {filteredDepartments.map((dept) => (
                            <option key={dept.id} value={dept.id}>
                              {dept.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </section>

                  {/* ─── EMPLOYMENT STATUS (chips) ─── */}
                  <section>
                    <div className="mb-3 flex items-center gap-2">
                      <Briefcase className="h-4 w-4 text-navy-600" />
                      <h3 className="text-sm font-semibold text-navy-800">
                        Employment Status
                      </h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          setFilters((prev) => ({ ...prev, employment_status: '' }))
                        }
                        className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
                          !filters.employment_status
                            ? 'bg-navy-700 text-white shadow-sm'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        All
                      </button>
                      {availableStatuses.map((status) => (
                        <button
                          key={status}
                          type="button"
                          onClick={() => setEmploymentStatus(status)}
                          className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
                            filters.employment_status === status
                              ? 'bg-navy-700 text-white shadow-sm'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {status}
                        </button>
                      ))}
                    </div>
                  </section>

                  {/* ─── DATE RANGE ─── */}
                  <section>
                    <div className="mb-3 flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-navy-600" />
                      <h3 className="text-sm font-semibold text-navy-800">Date Range</h3>
                      <span className="text-xs text-gray-400">(optional)</span>
                    </div>

                    {/* Quick presets */}
                    <div className="mb-3 flex flex-wrap gap-1.5">
                      {[
                        { key: 'today', label: 'Today' },
                        { key: 'week', label: 'Last 7 days' },
                        { key: 'month', label: 'Last 30 days' },
                        { key: 'year', label: 'This Year' },
                      ].map((preset) => (
                        <button
                          key={preset.key}
                          type="button"
                          onClick={() => applyDatePreset(preset.key)}
                          className="rounded-md border border-gray-200 bg-white px-2.5 py-1 text-xs font-medium text-gray-600 transition-colors hover:border-navy-300 hover:bg-navy-50 hover:text-navy-700"
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="mb-1 block text-xs font-medium text-gray-600">
                          From
                        </label>
                        <input
                          type="date"
                          value={filters.date_from}
                          onChange={(e) =>
                            setFilters((prev) => ({
                              ...prev,
                              date_from: e.target.value,
                            }))
                          }
                          className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm transition-colors focus:border-navy-500 focus:outline-none focus:ring-1 focus:ring-navy-500"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-xs font-medium text-gray-600">
                          To
                        </label>
                        <input
                          type="date"
                          value={filters.date_to}
                          onChange={(e) =>
                            setFilters((prev) => ({
                              ...prev,
                              date_to: e.target.value,
                            }))
                          }
                          className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm transition-colors focus:border-navy-500 focus:outline-none focus:ring-1 focus:ring-navy-500"
                        />
                      </div>
                    </div>
                  </section>

                  {/* ─── MAX ATTENDANCE ─── */}
                  <section>
                    <div className="mb-3 flex items-center gap-2">
                      <Hash className="h-4 w-4 text-navy-600" />
                      <h3 className="text-sm font-semibold text-navy-800">
                        Maximum Attendances
                      </h3>
                      <span className="text-xs text-gray-400">(optional)</span>
                    </div>
                    <input
                      type="number"
                      min="0"
                      placeholder="e.g. 2 — leave blank for all"
                      value={filters.max_attendance}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          max_attendance: e.target.value,
                        }))
                      }
                      className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm transition-colors focus:border-navy-500 focus:outline-none focus:ring-1 focus:ring-navy-500"
                    />
                    <p className="mt-1.5 text-xs text-gray-500">
                      {filters.event_ids.length > 0 && filters.max_attendance !== ''
                        ? `Include only employees who attended ≤ ${filters.max_attendance} of the ${filters.event_ids.length} selected event(s).`
                        : 'Include only employees whose attendance count is at or below this number.'}
                    </p>
                  </section>
                </div>

                {/* ═══════════ STICKY FOOTER ═══════════ */}
                <div className="border-t border-gray-100 bg-gray-50 px-5 py-4 sm:px-6">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-start gap-2 text-xs text-gray-500">
                      <Users className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-navy-600" />
                      <span className="leading-relaxed">{summaryText}</span>
                    </div>

                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={onClose}
                        className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <PrimaryButton
                        onClick={handleSubmit}
                        disabled={loading || activeFilterCount === 0}
                        className="min-w-[140px] justify-center bg-navy-700 hover:bg-navy-800 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {loading ? 'Generating...' : `Generate PDF`}
                        {!loading && activeFilterCount > 0 && (
                          <span className="ml-1.5 rounded-full bg-white/20 px-1.5 text-[10px] font-bold">
                            {activeFilterCount}
                          </span>
                        )}
                      </PrimaryButton>
                    </div>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}