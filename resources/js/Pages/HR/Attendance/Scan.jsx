import { useState, useEffect, useRef } from 'react';
import { Head } from '@inertiajs/react';
import HRLayout from '@/Layouts/HRLayout';
import { QrReader } from 'react-qr-reader';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import InputLabel from '@/Components/InputLabel';
import SelectInput from '@/Components/SelectInput';
import { formatDate, formatTime } from '@/utils/date';
import {
  Camera,
  CheckCircle,
  AlertCircle,
  XCircle,
  Loader2,
  Wrench,
  ChevronDown,
  ChevronUp,
  Calendar,
  Clock,
  MapPin,
} from 'lucide-react';

export default function Scan({ auth, events }) {
  const [selectedEventId, setSelectedEventId] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [lastResult, setLastResult] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [status, setStatus] = useState(null);
  const [manualToken, setManualToken] = useState('');
  const [showDevTools, setShowDevTools] = useState(false);
  const [progress, setProgress] = useState(100);
  const [lastScannedToken, setLastScannedToken] = useState(null);
  const lastScanTimeRef = useRef(null);
  const scannerRef = useRef(null);
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
    // Reset cooldown when event changes
    setLastScannedToken(null);
    lastScanTimeRef.current = null;
  }, [selectedEventId]);

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
          },
        });
        toast.success(`${data.data.employee_name} checked in.`, { duration: 2000 });
      } else if (data.message === 'Already Checked In') {
        setStatus({
          type: 'warning',
          data: {
            employee_name: data.data.employee_name,
            department: data.data.department,
            time_in: data.data.time_in,
            event_title: data.data.event_title,
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

    // Ignore duplicate tokens within 3 seconds
    if (
      token === lastScannedToken &&
      lastScanTimeRef.current &&
      now - lastScanTimeRef.current < 3000
    ) {
      // Silent ignore – no toast, no error
      return;
    }

    setLastScannedToken(token);
    lastScanTimeRef.current = now;

    await processAttendance(token);
  };

  // Manual check‑in handler (development only)
  const handleManualCheckIn = async () => {
    if (!manualToken.trim()) {
      toast.error('Please enter a QR token.');
      return;
    }
    await processAttendance(manualToken.trim());
  };

  const toggleDevTools = () => setShowDevTools(prev => !prev);

  const selectedEvent = events.find(e => e.id == selectedEventId);

  // Helper to combine date and time for formatting
  const getEventDateTime = (event) => {
    if (!event) return null;
    const datetime = `${event.date}T${event.time}`;
    return {
      date: formatDate(datetime),
      time: formatTime(datetime),
    };
  };

  // Status card renderer with progress bar
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

    const progressColor = type === 'success' ? 'bg-green-400' :
                          type === 'warning' ? 'bg-amber-400' :
                          'bg-red-400';

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-3 animate-in fade-in duration-300">
        <div className={`mx-auto w-full max-w-sm rounded-xl ${bgColor} p-4 text-center text-white shadow-lg animate-in slide-in-from-bottom-6 duration-300 relative overflow-hidden`}>
          <div className="flex justify-center mb-1">
            <div className="rounded-full bg-white/20 p-2">
              {icon}
            </div>
          </div>
          <h3 className="text-xl font-bold">{title}</h3>
          {type === 'success' && (
            <div className="mt-2 space-y-0.5 text-base">
              <p className="font-semibold">{data.employee_name}</p>
              <p className="text-xs opacity-90">{data.department}</p>
              <p className="text-xs opacity-90">Event: {data.event_title}</p>
              <p className="text-xs opacity-90">Time In: {formatTime(data.time_in)}</p>
            </div>
          )}
          {type === 'warning' && (
            <div className="mt-2 space-y-0.5 text-base">
              <p className="font-semibold">{data.employee_name}</p>
              <p className="text-xs opacity-90">Already checked in at {formatTime(data.time_in)}</p>
              <p className="text-xs opacity-90">Event: {data.event_title}</p>
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
          {/* Progress bar */}
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
            <h1 className="text-2xl font-bold text-navy-800 sm:text-3xl">Scan Attendance</h1>
            <p className="text-sm text-gray-500">Point camera at employee QR code</p>
          </div>

          {/* Event Selection Card */}
          <div className="mb-6 overflow-hidden rounded-xl bg-white shadow-sm">
            <div className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex-1">
                  <InputLabel htmlFor="event" value="Select Event" className="text-sm font-medium text-gray-700" />
                  <SelectInput
                    id="event"
                    value={selectedEventId}
                    onChange={(e) => setSelectedEventId(e.target.value)}
                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-navy-500 focus:ring-navy-500"
                  >
                    <option value="">-- Select Event --</option>
                    {events.map((event) => {
                      const formatted = getEventDateTime(event);
                      return (
                        <option key={event.id} value={event.id}>
                          {event.title} - {formatted.date} at {formatted.time}
                        </option>
                      );
                    })}
                  </SelectInput>
                </div>
                {selectedEvent && (
                  <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(`${selectedEvent.date}T${selectedEvent.time}`)}</span>
                    <Clock className="h-4 w-4 ml-2" />
                    <span>{formatTime(`${selectedEvent.date}T${selectedEvent.time}`)}</span>
                    <MapPin className="h-4 w-4 ml-2" />
                    <span>{selectedEvent.venue}</span>
                  </div>
                )}
              </div>
            </div>
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
                  <span className="mt-2 text-sm">Select an event to start</span>
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
                {showDevTools ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
              </button>
              {showDevTools && (
                <div className="mt-2 rounded-lg border-2 border-dashed border-yellow-300 bg-yellow-50 p-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-yellow-800">Manual Check‑In</span>
                    <span className="text-xs text-yellow-600">(Development Only)</span>
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
                      Simulate Check‑In
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Status Overlay */}
      {renderStatusCard()}
    </HRLayout>
  );
}
