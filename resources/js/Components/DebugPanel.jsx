import { useState } from 'react';

export default function DebugPanel({ data, isVisible, onToggle }) {
    if (!isVisible) return null;

    const getStatusColor = (status) => {
        if (status === 'success') return 'text-green-600';
        if (status === 'error') return 'text-red-600';
        if (status === 'processing') return 'text-yellow-600';
        return 'text-gray-600';
    };

    const getStatusIcon = (status) => {
        if (status === 'success') return '🟢';
        if (status === 'error') return '🔴';
        if (status === 'processing') return '🟡';
        return '🔵';
    };

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 max-h-[60vh] overflow-y-auto bg-white/95 shadow-lg border-t border-gray-300 p-4 text-sm">
            <div className="flex justify-between items-center mb-2">
                <h3 className="font-bold text-gray-700">🔍 Debug Panel</h3>
                <button
                    onClick={onToggle}
                    className="text-gray-500 hover:text-gray-700"
                >
                    Hide
                </button>
            </div>

            <div className="space-y-2">
                {/* Scanner Status */}
                <div>
                    <div className="font-semibold text-gray-600">Scanner Status</div>
                    <div className="grid grid-cols-2 gap-1">
                        <div>Initialized: {data.scannerInitialized ? '✅' : '❌'}</div>
                        <div>Camera: {data.cameraStatus}</div>
                        <div>Scanning: {data.isScanning ? '🟢' : '🔴'}</div>
                        {data.cameraError && <div className="col-span-2 text-red-500">Error: {data.cameraError}</div>}
                    </div>
                </div>

                {/* QR Detection */}
                <div>
                    <div className="font-semibold text-gray-600">QR Detection</div>
                    <div className="grid grid-cols-2 gap-1">
                        <div>Last Token: {data.lastToken || '—'}</div>
                        <div>Timestamp: {data.timestamp || '—'}</div>
                        <div>Detection Status: {data.detectionStatus || '⏳'}</div>
                    </div>
                </div>

                {/* Event Info */}
                <div>
                    <div className="font-semibold text-gray-600">Event</div>
                    <div className="grid grid-cols-2 gap-1">
                        <div>ID: {data.eventId || '—'}</div>
                        <div>Title: {data.eventTitle || '—'}</div>
                    </div>
                </div>

                {/* Request */}
                <div>
                    <div className="font-semibold text-gray-600">Request</div>
                    <div className="grid grid-cols-2 gap-1">
                        <div>Endpoint: {data.endpoint || '—'}</div>
                        <div>Method: {data.method || '—'}</div>
                        <div className="col-span-2">Payload: {data.payload ? JSON.stringify(data.payload) : '—'}</div>
                        <div>Status: <span className={getStatusColor(data.requestStatus)}>{data.requestStatus || '⏳'}</span></div>
                    </div>
                </div>

                {/* Backend Response */}
                {data.response && (
                    <div>
                        <div className="font-semibold text-gray-600">Backend Response</div>
                        <div className="grid grid-cols-2 gap-1">
                            <div>HTTP: {data.response.status || '—'}</div>
                            <div>Message: {data.response.message || '—'}</div>
                            <div className="col-span-2">Data: {data.response.data ? JSON.stringify(data.response.data) : '—'}</div>
                        </div>
                    </div>
                )}

                {/* Employee Lookup */}
                <div>
                    <div className="font-semibold text-gray-600">Employee Lookup</div>
                    <div className="grid grid-cols-2 gap-1">
                        <div>Found: {data.employeeFound ? '✅' : '❌'}</div>
                        <div>ID: {data.employeeId || '—'}</div>
                        <div>Name: {data.employeeName || '—'}</div>
                        <div>Department: {data.employeeDepartment || '—'}</div>
                    </div>
                </div>

                {/* Attendance */}
                <div>
                    <div className="font-semibold text-gray-600">Attendance</div>
                    <div className="grid grid-cols-2 gap-1">
                        <div>Created: {data.attendanceCreated ? '✅' : '❌'}</div>
                        <div>Duplicate: {data.duplicate ? '⚠️' : '❌'}</div>
                        <div>ID: {data.attendanceId || '—'}</div>
                        <div>Time In: {data.timeIn || '—'}</div>
                    </div>
                </div>

                {/* Errors */}
                {data.error && (
                    <div className="border border-red-300 bg-red-50 p-2 rounded">
                        <div className="font-semibold text-red-700">Error</div>
                        <div className="text-red-600">{data.error}</div>
                    </div>
                )}
            </div>
        </div>
    );
}
