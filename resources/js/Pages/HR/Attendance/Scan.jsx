import { useState, useEffect, useRef } from 'react';
import { Head } from '@inertiajs/react';
import HRLayout from '@/Layouts/HRLayout';
import { QrReader } from 'react-qr-reader';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { formatDate, formatTime } from '@/utils/date';
import {
  Camera,
  CheckCircle,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Loader2,
  Wrench,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  Calendar,
  Clock,
  MapPin,
  X,
  Inbox,
} from 'lucide-react';

const defaultAvatar =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40'%3E%3Crect width='40' height='40' fill='%23e2e8f0'/%3E%3Ctext x='20' y='26' text-anchor='middle' font-size='18' font-family='sans-serif' fill='%2394a3b8'%3E%3C/text%3E%3C/svg%3E";

// Status presentation config for event cards
const eventStatusConfig = {
  ongoing: {
    label: 'Ongoing',
    badge:
      'bg-green-50 text-green-700 ring-1 ring-inset ring-green-200',
  },
  upcoming: {
    label: 'Upcoming',
    badge:
      'bg-gray-50 text-gray-500 ring-1 ring-inset ring-gray-200',
  },
  completed: {
    label: 'Completed',
    badge:
      'bg-gray-50 text-gray-400 ring-1 ring-inset ring-gray-200',
  },
};

// Determine event status based on its date.
// Without an end time, the entire event day is treated as ongoing.
const getEventStatus = (event) => {
  if (!event) return 'upcoming';

  // 1. Trust the explicit status if present
  if (event.status) {
    const s = String(event.status).toLowerCase();
    if (['completed', 'closed', 'done'].includes(s)) return 'completed';
    if (['cancelled', 'canceled'].includes(s)) return 'completed'; // muted/disabled
    if (['ongoing', 'active', 'in_progress', 'open'].includes(s)) return 'ongoing';
    // 'upcoming' / 'scheduled' / 'draft' fall through to the date check
  }

  // 2. Fallback: date-based (same as before)
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const [y, m, d] = event.date.split('-').map(Number);
  const eventDay = new Date(y, m - 1, d);

  if (eventDay.getTime() === today.getTime()) return 'ongoing';
  if (eventDay < today) return 'completed';
  return 'upcoming';
};




// Sort: ongoing → upcoming (soonest first) → completed (most recent first)
const sortEventsByStatus = (list) => {
  const priority = { ongoing: 0, upcoming: 1, completed: 2 };
  return [...list].sort((a, b) => {
    const sa = getEventStatus(a);
    const sb = getEventStatus(b);
    if (priority[sa] !== priority[sb]) return priority[sa] - priority[sb];

    const da = new Date(`${a.date}T${a.time}`);
    const db = new Date(`${b.date}T${b.time}`);
    return sa === 'completed' ? db - da : da - db;
  });
};

export default function Scan({ auth, events }) {
  const [selectedEventId, setSelectedEventId] = useState('');
  const [eventModalOpen, setEventModalOpen] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [lastResult, setLastResult] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [status, setStatus] = useState(null);
  const [manualToken, setManualToken] = useState('');
  const [showDevTools, setShowDevTools] = useState(false);
  const [progress, setProgress] = useState(100);
  const [lastScannedToken, setLastScannedToken] = useState(null);
  const lastScanTimeRef = useRef(null);
  const intervalRef = useRef(null);

  // Clear progress interval
  const clearProgressInterval = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  // When status changes, start/restart the progress countdown
  useEffect(() => {
    if (status) {
      setProgress(100);
      clearProgressInterval();

      intervalRef.current = setInterval(() => {
        setProgress((prev) => {
          const next = prev - 3.33; // 100% in ~3 seconds
          if (next <= 0) {
            clearProgressInterval();
            setStatus(null);
            setLastResult(null);
            return 0;
          }
          return next;
        });
      }, 100);
    } else {
      clearProgressInterval();
      setProgress(100);
    }

    return clearProgressInterval;
  }, [status]);

  // Update scanning state when event changes
  useEffect(() => {
    if (selectedEventId) {
      setIsScanning(true);
    } else {
      setIsScanning(false);
    }
    setLastScannedToken(null);
    lastScanTimeRef.current = null;
  }, [selectedEventId]);

  // Modal: ESC to close + body scroll lock
  useEffect(() => {
    if (!eventModalOpen) return;

    const onKey = (e) => {
      if (e.key === 'Escape') setEventModalOpen(false);
    };
    window.addEventListener('keydown', onKey);

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [eventModalOpen]);

  const handleScannerError = (err) => {
    console.error('Scanner error:', err);
    toast.error('Camera error. Please allow camera access.');
  };

  // Shared processing function for both real scan and manual entry
  const processAttendance = async (token) => {
    if (status) return;

    if (!selectedEventId) {
      toast.error('Please select an event first.');
      setStatus({ type: 'error', data: { message: 'No event selected' } });
      return;
    }

    if (processing) return;
    if (lastResult === token) return;

    setLastResult(token);
    setProcessing(true);

    const payload = { qr_token: token, event_id: selectedEventId };

    try {
      const response = await axios.post(
        route('hr.attendance.scan.process'),
        payload,
        {
          headers: {
            'X-Requested-With': 'XMLHttpRequest',
            'Content-Type': 'application/json',
          },
        }
      );

      const data = response.data;

      if (data.success) {
        setStatus({
          type: 'success',
          data: {
            employee_name: data.data.employee_name,
            department: data.data.department,
            time_in: data.data.time_in,
            event_title: data.data.event_title,
            profile_photo: data.data.profile_photo || null,
            status: data.data.status || 'present',
          },
        });
        toast.success(`${data.data.employee_name} checked in.`, {
          duration: 2000,
        });
      } else if (data.message === 'Already Checked In') {
        setStatus({
          type: 'warning',
          data: {
            employee_name: data.data.employee_name,
            department: data.data.department,
            time_in: data.data.time_in,
            event_title: data.data.event_title,
            profile_photo: data.data.profile_photo || null,
            status: data.data.status || 'present',
            message: data.message,
          },
        });
        toast.error(data.message);
      } else {
        setStatus({
          type: 'error',
          data: { message: data.message },
        });
        toast.error(data.message);
      }
    } catch (error) {
      console.error('Scan error:', error);
      let errMsg = 'Error processing scan.';
      if (error.response) {
        errMsg = error.response.data?.message || errMsg;
      }
      setStatus({
        type: 'error',
        data: { message: errMsg },
      });
      toast.error(errMsg);
      setTimeout(() => setLastResult(null), 1000);
    } finally {
      setProcessing(false);
    }
  };

  // Real scan handler with cooldown
  const handleScan = async (result) => {
    if (!result) return;
    if (status || processing) return;

    const token = result.text;
    const now = Date.now();

    if (
      token === lastScannedToken &&
      lastScanTimeRef.current &&
      now - lastScanTimeRef.current < 3000
    ) {
      return;
    }

    setLastScannedToken(token);
    lastScanTimeRef.current = now;

    await processAttendance(token);
  };

  // Manual check-in handler (development only)
  const handleManualCheckIn = async () => {
    if (!manualToken.trim()) {
      toast.error('Please enter a QR token.');
      return;
    }
    await processAttendance(manualToken.trim());
  };

  const toggleDevTools = () => setShowDevTools((prev) => !prev);

  const selectedEvent = events.find((e) => e.id == selectedEventId);
  const ongoingCount = events.filter((e) => getEventStatus(e) === 'ongoing').length;

  // Status card renderer with progress bar and status
  const renderStatusCard = () => {
    if (!status) return null;

    const { type, data } = status;
    let icon, bgColor, title;

    if (type === 'success') {
      icon = <CheckCircle className="h-8 w-8 text-white" />;
      bgColor = 'bg-green-600';
      title = 'Attendance Recorded!';
    } else if (type === 'warning') {
      icon = <AlertCircle className="h-8 w-8 text-white" />;
      bgColor = 'bg-amber-500';
      title = 'Already Checked In';
    } else {
      icon = <XCircle className="h-8 w-8 text-white" />;
      bgColor = 'bg-red-600';
      title = 'Error';
    }

    const progressColor =
      type === 'success'
        ? 'bg-green-400'
        : type === 'warning'
        ? 'bg-amber-400'
        : 'bg-red-400';

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-3 animate-in fade-in duration-300">
        <div
          className={`mx-auto w-full max-w-sm rounded-xl ${bgColor} p-4 text-center text-white shadow-lg animate-in slide-in-from-bottom-6 duration-300 relative overflow-hidden`}
        >
          <div className="flex justify-center mb-1">
            <div className="rounded-full bg-white/20 p-2">{icon}</div>
          </div>
          <h3 className="text-xl font-bold">{title}</h3>

          {type === 'success' && (
            <div className="mt-2 flex flex-col items-center space-y-1">
              <img
                src={data.profile_photo || defaultAvatar}
                alt={data.employee_name}
                className="h-20 w-20 rounded-full border-4 border-white object-cover sm:h-24 sm:w-24"
                loading="lazy"
                onError={(e) => {
                  e.target.src = defaultAvatar;
                }}
              />
              <p className="font-semibold text-base">{data.employee_name}</p>
              <p className="text-xs opacity-90">{data.department}</p>
              <p className="text-xs opacity-90">
                Time In: {formatTime(data.time_in)}
              </p>
              <p
                className={`text-xs font-medium ${
                  data.status === 'late' ? 'text-yellow-300' : 'text-white/90'
                }`}
              >
                Status: {data.status === 'late' ? 'Late' : 'Present'}
              </p>
            </div>
          )}

          {type === 'warning' && (
            <div className="mt-2 flex flex-col items-center space-y-1">
              <img
                src={data.profile_photo || defaultAvatar}
                alt={data.employee_name}
                className="h-20 w-20 rounded-full border-4 border-white object-cover sm:h-24 sm:w-24"
                loading="lazy"
                onError={(e) => {
                  e.target.src = defaultAvatar;
                }}
              />
              <p className="font-semibold text-base">{data.employee_name}</p>
              <p className="text-xs opacity-90">
                Already checked in at {formatTime(data.time_in)}
              </p>
              <p className="text-xs opacity-90">Event: {data.event_title}</p>
              <p
                className={`text-xs font-medium ${
                  data.status === 'late' ? 'text-yellow-300' : 'text-white/90'
                }`}
              >
                Status: {data.status === 'late' ? 'Late' : 'Present'}
              </p>
            </div>
          )}

          {type === 'error' && (
            <div className="mt-2 text-base">
              <p>{data.message}</p>
              <p className="text-xs opacity-80 mt-1">Please try again.</p>
            </div>
          )}

          <div className="mt-2 text-xs opacity-75">
            Scanner will resume automatically...
          </div>

          <div className="absolute bottom-0 left-0 h-1 w-full bg-white/20">
            <div
              className={`h-full transition-all duration-100 ease-linear ${progressColor}`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <HRLayout user={auth.user}>
      <Head title="Scan Attendance" />

      <div className="py-6">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-navy-800 sm:text-3xl">
              Scan Attendance
            </h1>
            <p className="text-sm text-gray-500">
              Point camera at employee QR code
            </p>
          </div>

          {/* Event Selection Trigger */}
          <div className="mb-6 overflow-hidden rounded-xl bg-white shadow-sm">
            <button
              type="button"
              onClick={() => setEventModalOpen(true)}
              className="group flex w-full items-center gap-4 p-4 text-left transition-colors duration-200 hover:bg-gray-50/80 sm:p-5"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-navy-50 text-navy-600">
                <Calendar className="h-5 w-5" />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                  Event
                </p>
                {selectedEvent ? (
                  <>
                    <p className="mt-0.5 truncate text-sm font-semibold text-gray-900">
                      {selectedEvent.title}
                    </p>
                    <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500">
                      <span className="inline-flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(
                          `${selectedEvent.date}T${selectedEvent.time}`
                        )}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatTime(
                          `${selectedEvent.date}T${selectedEvent.time}`
                        )}
                      </span>
                      <span className="inline-flex items-center gap-1 truncate">
                        <MapPin className="h-3 w-3" />
                        {selectedEvent.venue}
                      </span>
                    </div>
                  </>
                ) : (
                  <p className="mt-1 text-sm font-medium text-gray-400">
                    Tap to select an event
                  </p>
                )}
              </div>

              <ChevronRight className="h-5 w-5 shrink-0 text-gray-300 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-gray-400" />
            </button>
          </div>

          {/* Scanner Preview */}
          <div className="overflow-hidden rounded-xl bg-white shadow-sm">
            <div className="p-2 sm:p-4">
              {selectedEventId ? (
                <div className="relative aspect-square w-full max-w-md mx-auto overflow-hidden rounded-lg bg-gray-900">
                  <QrReader
                    onResult={handleScan}
                    onError={handleScannerError}
                    constraints={{ facingMode: 'environment' }}
                    videoId="qr-video"
                    scanDelay={300}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                  {processing && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                      <Loader2 className="h-12 w-12 animate-spin text-white" />
                    </div>
                  )}
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-black/50 px-3 py-1 text-xs text-white/80">
                    {isScanning ? 'Scanning...' : 'Waiting...'}
                  </div>
                </div>
              ) : (
                <div className="aspect-square w-full max-w-md mx-auto flex flex-col items-center justify-center rounded-lg bg-gray-100 text-gray-400">
                  <Camera className="h-12 w-12" />
                  <span className="mt-2 text-sm">
                    Select an event to start
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Development Tools (collapsible) */}
          {import.meta.env.DEV && (
            <div className="mt-4">
              <button
                onClick={toggleDevTools}
                className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600"
              >
                <Wrench className="h-3 w-3" />
                {showDevTools ? 'Hide' : 'Show'} Development Tools
                {showDevTools ? (
                  <ChevronUp className="h-3 w-3" />
                ) : (
                  <ChevronDown className="h-3 w-3" />
                )}
              </button>
              {showDevTools && (
                <div className="mt-2 rounded-lg border-2 border-dashed border-yellow-300 bg-yellow-50 p-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-yellow-800">
                      Manual Check-In
                    </span>
                    <span className="text-xs text-yellow-600">
                      (Development Only)
                    </span>
                  </div>
                  <div className="mt-2 flex flex-wrap items-end gap-2">
                    <div className="flex-1 min-w-[200px]">
                      <input
                        type="text"
                        value={manualToken}
                        onChange={(e) => setManualToken(e.target.value)}
                        placeholder="Paste employee QR token"
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500 sm:text-sm"
                      />
                    </div>
                    <button
                      onClick={handleManualCheckIn}
                      disabled={processing || !selectedEventId}
                      className="rounded-md bg-yellow-600 px-4 py-2 text-sm text-white hover:bg-yellow-700 disabled:opacity-50"
                    >
                      Simulate Check-In
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Event Selection Modal */}
      {eventModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4"
          role="dialog"
          aria-modal="true"
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={() => setEventModalOpen(false)}
          />

          {/* Modal panel */}
          <div className="relative flex max-h-[85vh] w-full max-w-lg flex-col overflow-hidden rounded-t-2xl bg-white shadow-2xl animate-in slide-in-from-bottom-4 duration-300 sm:rounded-2xl sm:zoom-in-95 sm:slide-in-from-bottom-0">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-gray-100 px-5 py-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Select Event
                </h2>
                <p className="mt-0.5 text-xs text-gray-500">
                  Only ongoing events can be selected
                </p>
              </div>
              <button
                onClick={() => setEventModalOpen(false)}
                className="-mr-1 rounded-lg p-1.5 text-gray-400 transition-colors duration-150 hover:bg-gray-100 hover:text-gray-600"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-3">
              {events.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Inbox className="h-10 w-10 text-gray-300" />
                  <p className="mt-2 text-sm font-medium text-gray-500">
                    No events available
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {sortEventsByStatus(events).map((event) => {
                    const evStatus = getEventStatus(event);
                    const isDisabled = evStatus !== 'ongoing';
                    const isSelected = event.id == selectedEventId;
                    const config = eventStatusConfig[evStatus];

                    return (
                      <button
                        key={event.id}
                        type="button"
                        disabled={isDisabled}
                        onClick={() => {
                          setSelectedEventId(event.id);
                          setEventModalOpen(false);
                        }}
                        className={`group relative flex w-full items-center gap-3 rounded-xl border p-3 text-left transition-all duration-200 ${
                          isSelected
                            ? 'border-navy-300 bg-navy-50/60 ring-1 ring-navy-200'
                            : evStatus === 'ongoing'
                            ? 'border-gray-200 hover:border-navy-200 hover:bg-navy-50/40 hover:shadow-sm'
                            : 'cursor-not-allowed border-gray-100 opacity-50'
                        }`}
                      >
                        {/* Icon */}
                        <div
                          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-colors ${
                            evStatus === 'ongoing'
                              ? 'bg-green-50 text-green-600'
                              : 'bg-gray-100 text-gray-400'
                          }`}
                        >
                          <Calendar className="h-5 w-5" />
                        </div>

                        {/* Details */}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <p
                              className={`truncate text-sm font-semibold ${
                                isDisabled ? 'text-gray-500' : 'text-gray-900'
                              }`}
                            >
                              {event.title}
                            </p>
                            <span
                              className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium ${config.badge}`}
                            >
                              {evStatus === 'ongoing' && (
                                <span className="relative flex h-1.5 w-1.5">
                                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-green-500" />
                                </span>
                              )}
                              {config.label}
                            </span>
                          </div>

                          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-gray-500">
                            <span className="inline-flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {formatDate(`${event.date}T${event.time}`)}
                            </span>
                            <span className="inline-flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {formatTime(`${event.date}T${event.time}`)}
                            </span>
                            <span className="inline-flex items-center gap-1 truncate">
                              <MapPin className="h-3 w-3" />
                              {event.venue}
                            </span>
                          </div>
                        </div>

                        {/* Right indicator */}
                        {isSelected ? (
                          <CheckCircle2 className="h-5 w-5 shrink-0 text-navy-500" />
                        ) : !isDisabled ? (
                          <ChevronRight className="h-4 w-4 shrink-0 text-gray-300 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-gray-400" />
                        ) : null}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-gray-100 bg-gray-50/70 px-5 py-3">
              <p className="text-center text-xs text-gray-500">
                {ongoingCount > 0
                  ? `${ongoingCount} ongoing event${ongoingCount > 1 ? 's' : ''} available`
                  : 'No ongoing events right now'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Status Overlay */}
      {renderStatusCard()}
    </HRLayout>
  );
}