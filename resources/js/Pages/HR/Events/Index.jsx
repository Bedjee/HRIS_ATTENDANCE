import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import HRLayout from '@/Layouts/HRLayout';
import { toast } from 'react-hot-toast';
import { formatDate, formatTime } from '@/utils/date';
import {
  Plus, Pencil, Trash2, Calendar, Clock, MapPin, Circle,
  Users, Layers, GitBranch, User, Eye, UserCheck
} from 'lucide-react';
import ConfirmationModal from '@/Components/ConfirmationModal';
import Tooltip from '@/Components/Tooltip';

export default function Index({ auth, events }) {
  const [deletingId, setDeletingId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);

  // Helper to get a human-readable label for attendance mode
  const getAttendanceModeLabel = (event) => {
    const mode = event.attendance_mode || 'all_employees';
    const count = event.required_employees_count || 0;

    switch (mode) {
      case 'all_employees':
        return { label: 'All Employees', icon: Users, color: 'text-green-700' };
      case 'selected_clusters':
        const clusterCount = event.selected_clusters?.length || 0;
        return { label: `${clusterCount} Cluster${clusterCount > 1 ? 's' : ''}`, icon: Layers, color: 'text-blue-700' };
      case 'selected_departments':
        const deptCount = event.selected_departments?.length || 0;
        return { label: `${deptCount} Department${deptCount > 1 ? 's' : ''}`, icon: GitBranch, color: 'text-purple-700' };
      case 'selected_employees':
        return { label: `${count} Employee${count > 1 ? 's' : ''}`, icon: User, color: 'text-amber-700' };
      default:
        return { label: 'Unknown', icon: Users, color: 'text-gray-700' };
    }
  };

  const handleDeleteClick = (event) => {
    setEventToDelete(event);
    setModalOpen(true);
  };

  const confirmDelete = () => {
    if (!eventToDelete) return;
    const id = eventToDelete.id;
    const title = eventToDelete.title;
    setDeletingId(id);
    router.delete(route('hr.events.destroy', id), {
      onSuccess: () => {
        toast.success('Event deleted successfully.');
        setDeletingId(null);
        setEventToDelete(null);
      },
      onError: (error) => {
        const msg = error.response?.data?.message || 'Failed to delete event.';
        toast.error(msg);
        setDeletingId(null);
        setEventToDelete(null);
      },
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      upcoming: 'bg-blue-100 text-blue-800',
      ongoing: 'bg-green-100 text-green-800',
      completed: 'bg-gray-100 text-gray-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <HRLayout user={auth.user}>
      <Head title="Events" />
      <div className="py-8 sm:py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h1 className="text-2xl font-bold text-navy-800 sm:text-3xl">Events</h1>
              <p className="text-sm text-gray-500">Manage your organization's events</p>
            </div>
            <Link href={route('hr.events.create')}>
              <button className="inline-flex items-center rounded-lg bg-navy-700 px-4 py-2 text-sm font-medium text-white hover:bg-navy-800 focus:outline-none focus:ring-2 focus:ring-navy-500 focus:ring-offset-2">
                <Plus className="mr-2 h-4 w-4" />
                Create Event
              </button>
            </Link>
          </div>

          {/* Event cards (mobile-friendly) */}
          <div className="space-y-4 sm:hidden">
            {events.data.length === 0 ? (
              <div className="rounded-xl bg-white p-8 text-center text-gray-500 shadow-sm">
                <Calendar className="mx-auto h-12 w-12 text-gray-300" />
                <p className="mt-2">No events created yet.</p>
                <Link href={route('hr.events.create')} className="mt-4 inline-block text-sm text-navy-600 hover:text-navy-800">
                  Create your first event
                </Link>
              </div>
            ) : (
              events.data.map((event) => {
                const mode = getAttendanceModeLabel(event);
                const ModeIcon = mode.icon;
                return (
                  <div key={event.id} className="overflow-hidden rounded-xl bg-white shadow-sm">
                    <div className="p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-medium text-navy-800">{event.title}</h3>
                          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500">
                            <span className="flex items-center">
                              <Calendar className="mr-1 h-3 w-3" />
                              {formatDate(`${event.date}T${event.time}`)}
                            </span>
                            <span className="flex items-center">
                              <Clock className="mr-1 h-3 w-3" />
                              {formatTime(`${event.date}T${event.time}`)}
                            </span>
                            <span className="flex items-center">
                              <MapPin className="mr-1 h-3 w-3" />
                              {event.venue}
                            </span>
                          </div>
                        </div>
                        <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${getStatusColor(event.status)}`}>
                          {event.status}
                        </span>
                      </div>

                      <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-3">
                        <div className="flex items-center gap-1 text-xs text-gray-600">
                          <ModeIcon className={`h-4 w-4 ${mode.color}`} />
                          <span className={mode.color}>{mode.label}</span>
                        </div>
                        <div className="flex gap-1">
                          {/* Required Attendees */}
                          <Tooltip text="Required Attendees">
                            <Link
                              href={route('hr.events.required', event.id)}
                              className="inline-flex items-center rounded-md p-1.5 text-blue-600 hover:bg-blue-50 hover:text-blue-900"
                            >
                              <Users className="h-4 w-4" />
                              <span className="sr-only">Required</span>
                            </Link>
                          </Tooltip>
                          {/* View Attendance */}
                          <Tooltip text="View Attendance">
                            <Link
                              href={route('hr.events.attendance', event.id)}
                              className="inline-flex items-center rounded-md p-1.5 text-green-600 hover:bg-green-50 hover:text-green-900"
                            >
                              <UserCheck className="h-4 w-4" />
                              <span className="sr-only">Attendance</span>
                            </Link>
                          </Tooltip>
                          {/* Edit */}
                          <Tooltip text="Edit Event">
                            <Link
                              href={route('hr.events.edit', event.id)}
                              className="rounded-md p-1.5 text-navy-600 hover:bg-navy-50 hover:text-navy-900"
                            >
                              <Pencil className="h-4 w-4" />
                              <span className="sr-only">Edit</span>
                            </Link>
                          </Tooltip>
                          {/* Delete */}
                          <Tooltip text="Delete Event">
                            <button
                              onClick={() => handleDeleteClick(event)}
                              disabled={deletingId === event.id}
                              className="rounded-md p-1.5 text-red-600 hover:bg-red-50 hover:text-red-900 disabled:opacity-50"
                            >
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Delete</span>
                            </button>
                          </Tooltip>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
            {/* Pagination on mobile */}
            {events.links && events.data.length > 0 && (
              <div className="mt-4 flex flex-wrap justify-center gap-1">
                {events.links.map((link, index) => (
                  <Link
                    key={index}
                    href={link.url || '#'}
                    className={`inline-flex items-center rounded-md px-3 py-1.5 text-sm ${
                      link.active
                        ? 'bg-navy-700 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    } ${!link.url ? 'cursor-not-allowed opacity-50' : ''}`}
                    dangerouslySetInnerHTML={{ __html: link.label }}
                    disabled={!link.url}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Desktop table */}
          <div className="hidden overflow-hidden rounded-xl bg-white shadow-sm sm:block">
            <div className="overflow-x-auto">
              {events.data.length === 0 ? (
                <div className="p-12 text-center text-gray-500">
                  <Calendar className="mx-auto h-12 w-12 text-gray-300" />
                  <p className="mt-2">No events created yet.</p>
                  <Link href={route('hr.events.create')} className="mt-4 inline-block text-sm text-navy-600 hover:text-navy-800">
                    Create your first event
                  </Link>
                </div>
              ) : (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 sm:px-6">Title</th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 sm:px-6">Date</th>
                      <th className="hidden px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 sm:table-cell sm:px-6">Time</th>
                      <th className="hidden px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 md:table-cell md:px-6">Venue</th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 sm:px-6">Status</th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 sm:px-6">Mode</th>
                      <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 sm:px-6">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {events.data.map((event) => {
                      const mode = getAttendanceModeLabel(event);
                      const ModeIcon = mode.icon;
                      return (
                        <tr key={event.id} className="hover:bg-gray-50">
                          <td className="px-4 py-4 sm:px-6">
                            <div className="text-sm font-medium text-navy-800">{event.title}</div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 sm:px-6">
                            {formatDate(`${event.date}T${event.time}`)}
                          </td>
                          <td className="hidden px-4 py-4 whitespace-nowrap text-sm text-gray-500 sm:table-cell sm:px-6">
                            {formatTime(`${event.date}T${event.time}`)}
                          </td>
                          <td className="hidden px-4 py-4 whitespace-nowrap text-sm text-gray-500 md:table-cell md:px-6">
                            {event.venue}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm sm:px-6">
                            <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${getStatusColor(event.status)}`}>
                              {event.status}
                            </span>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 sm:px-6">
                            <span className="flex items-center gap-1">
                              <ModeIcon className={`h-4 w-4 ${mode.color}`} />
                              <span className={mode.color}>{mode.label}</span>
                            </span>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium sm:px-6">
                            {/* Required Attendees */}
                            <Tooltip text="Required Attendees">
                              <Link
                                href={route('hr.events.required', event.id)}
                                className="inline-flex items-center rounded-md p-1.5 text-blue-600 hover:bg-blue-50 hover:text-blue-900"
                              >
                                <Users className="h-4 w-4" />
                                <span className="sr-only">Required</span>
                              </Link>
                            </Tooltip>
                            {/* View Attendance */}
                            <Tooltip text="View Attendance">
                              <Link
                                href={route('hr.events.attendance', event.id)}
                                className="inline-flex items-center rounded-md p-1.5 text-green-600 hover:bg-green-50 hover:text-green-900"
                              >
                                <UserCheck className="h-4 w-4" />
                                <span className="sr-only">Attendance</span>
                              </Link>
                            </Tooltip>
                            {/* Edit */}
                            <Tooltip text="Edit Event">
                              <Link
                                href={route('hr.events.edit', event.id)}
                                className="inline-flex items-center rounded-md p-1.5 text-navy-600 hover:bg-navy-50 hover:text-navy-900"
                              >
                                <Pencil className="h-4 w-4" />
                                <span className="sr-only">Edit</span>
                              </Link>
                            </Tooltip>
                            {/* Delete */}
                            <Tooltip text="Delete Event">
                              <button
                                onClick={() => handleDeleteClick(event)}
                                disabled={deletingId === event.id}
                                className="ml-2 inline-flex items-center rounded-md p-1.5 text-red-600 hover:bg-red-50 hover:text-red-900 disabled:opacity-50"
                              >
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">Delete</span>
                              </button>
                            </Tooltip>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>

            {/* Pagination */}
            {events.links && events.data.length > 0 && (
              <div className="border-t border-gray-200 px-4 py-4 sm:px-6">
                <div className="flex flex-wrap items-center justify-center gap-1">
                  {events.links.map((link, index) => (
                    <Link
                      key={index}
                      href={link.url || '#'}
                      className={`inline-flex items-center rounded-md px-3 py-1.5 text-sm ${
                        link.active
                          ? 'bg-navy-700 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      } ${!link.url ? 'cursor-not-allowed opacity-50' : ''}`}
                      dangerouslySetInnerHTML={{ __html: link.label }}
                      disabled={!link.url}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <ConfirmationModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Event"
        message={`Are you sure you want to delete the event "${eventToDelete?.title}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />
    </HRLayout>
  );
}
