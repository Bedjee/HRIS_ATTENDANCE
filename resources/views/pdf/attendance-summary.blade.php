<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Attendance - {{ $event->title }}</title>
    <style>
        /* ---- Global & Page Setup ---- */
        body {
            margin: 20px;
            margin-bottom: 85px;   /* space for fixed footer */
            font-family: 'DejaVu Sans', sans-serif;
            font-size: 12px;
            padding: 0;
            background: #fff;
        }
        /* ---- Header ---- */
        .header {
            border-bottom: 3px solid #1e3a5f;
            padding-bottom: 10px;
            margin-bottom: 15px;
        }
        .header-table {
            width: 100%;
            border-collapse: collapse;
        }
        .header-table td {
            vertical-align: middle;
            padding: 0;
            border: none;
        }
        .header-logo-left {
            width: 100px;
            text-align: center;
        }
        .header-logo-left img {
            max-height: 60px;
            max-width: 80px;
            vertical-align: middle;
        }
        .header-logo-right {
            width: 140px;
            text-align: center;
        }
        .header-logo-right img {
            max-height: 80px;
            max-width: 120px;
            vertical-align: middle;
        }
        .header-title {
            text-align: center;
            font-size: 28px;
            font-weight: 700;
            letter-spacing: 4px;
            color: #1e3a5f;
            text-transform: uppercase;
        }
        /* ---- Event Details ---- */
        .event-details {
            margin-bottom: 20px;
        }
        .event-details table {
            border-collapse: collapse;
            font-size: 13px;
            width: auto;
        }
        .event-details td {
            padding: 2px 10px 2px 0;
            border: none;
        }
        .event-details .label {
            font-weight: bold;
            color: #1e293b;
            width: 100px;
            vertical-align: top;
        }
        .event-details .value {
            color: #1e293b;
            vertical-align: top;
        }
        /* ---- Status filter ---- */
        .status-filter {
            text-align: right;
            font-size: 11px;
            color: #64748b;
            margin-bottom: 5px;
        }
        .status-filter strong {
            color: #1e3a5f;
        }
        /* ---- Attendance Table ---- */
        table.attendance {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
            font-size: 11px;
        }
        table.attendance th {
            background: #1e3a5f;
            color: #ffffff;
            font-weight: 600;
            padding: 8px 6px;
            text-align: left;
            border: 1px solid #1e3a5f;
        }
        table.attendance td {
            padding: 7px 6px;
            border: 1px solid #e2e8f0;
            color: #1e293b;
        }
        table.attendance tr:nth-child(even) {
            background: #f8fafc;
        }
        .status-badge {
            display: inline-block;
            padding: 2px 10px;
            border-radius: 12px;
            font-size: 10px;
            font-weight: 600;
            text-transform: capitalize;
        }
        .status-present {
            background: #dcfce7;
            color: #166534;
        }
        .status-late {
            background: #fef9c3;
            color: #854d0e;
        }
        .status-absent {
            background: #fee2e2;
            color: #991b1b;
        }
        .emp-badge {
            display: inline-block;
            padding: 2px 10px;
            border-radius: 12px;
            font-size: 10px;
            font-weight: 600;
        }
        .emp-regular {
            background: #e0e7ff;
            color: #3730a3;
        }
        .emp-jo {
            background: #fef3c7;
            color: #92400e;
        }
        /* ---- Empty state ---- */
        .empty {
            text-align: center;
            padding: 40px 0;
            color: #94a3b8;
            font-size: 14px;
        }
        /* ---- Fallback for missing logos ---- */
        .no-logo {
            display: inline-block;
            width: 80px;
        }
        /* ---- FIXED FOOTER (appears on every page) ---- */
        .footer {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            background: #f8fafc;
            border-top: 2px solid #1e3a5f;
            padding: 6px 20px;
            font-size: 8.5px;
            color: #334155;
            text-align: center;
            line-height: 1.5;
        }
        .footer .office {
            font-weight: 700;
            color: #1e3a5f;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        .footer .statement {
            font-style: italic;
            margin-top: 1px;
        }
        .footer .generated {
            font-size: 8px;
            color: #94a3b8;
            margin-top: 2px;
        }
        .footer .generated span {
            font-weight: 600;
        }
    </style>
</head>
<body>
    <!-- ===== HEADER ===== -->
    <div class="header">
        <table class="header-table">
            <tr>
                <td class="header-logo-left">
                    @if(file_exists($logoLeft))
                        <img src="{{ $logoLeft }}" alt="Logo Left">
                    @else
                        <span class="no-logo"></span>
                    @endif
                </td>
                <td class="header-title">ATTENDANCE</td>
                <td class="header-logo-right">
                    @if(file_exists($logoRight))
                        <img src="{{ $logoRight }}" alt="Logo Right">
                    @else
                        <span class="no-logo"></span>
                    @endif
                </td>
            </tr>
        </table>
    </div>

    <!-- ===== EVENT DETAILS ===== -->
    <div class="event-details">
        <table>
            <tr>
                <td class="label">Activity:</td>
                <td class="value">{{ $event->title }}</td>
            </tr>
            <tr>
                <td class="label">Venue:</td>
                <td class="value">{{ $event->venue }}</td>
            </tr>
            <tr>
                <td class="label">Activity date:</td>
                <td class="value">{{ \Carbon\Carbon::parse($event->date . ' ' . $event->time)->format('F j, Y g:i A') }}</td>
            </tr>
        </table>
    </div>

    <!-- ===== FILTER SUMMARY ===== -->
    <div class="status-filter">
        Showing:
        <strong>{{ $status === 'all' ? 'All Attendance' : ucfirst($status) }}</strong>
        @if(!empty($employmentStatus) && $employmentStatus !== 'all')
            &nbsp;•&nbsp; Employment: <strong>{{ $employmentStatus }}</strong>
        @else
            &nbsp;•&nbsp; Employment: <strong>All</strong>
        @endif
    </div>

    <!-- ===== ATTENDANCE TABLE ===== -->
    @if(count($attendanceData) > 0)
        <table class="attendance">
            <thead>
                <tr>
                    <th style="width: 35px; text-align: center;">#</th>
                    <th style="text-align: left;">Employee Name</th>
                    <th style="text-align: left;">Department</th>
                    <th style="text-align: left;">Cluster</th>
                    <th style="text-align: left;">Employment Status</th>
                    <th style="text-align: left;">Check‑In</th>
                    <th style="text-align: left;">Status</th>
                </tr>
            </thead>
            <tbody>
                @foreach($attendanceData as $index => $record)
                    <tr>
                        <td style="text-align: center;">{{ $index + 1 }}</td>
                        <td>{{ $record['employee_name'] }}</td>
                        <td>{{ $record['department'] }}</td>
                        <td>{{ $record['cluster'] }}</td>
                        <td>
                            @php
                                $emp = $record['employment_status'] ?? '—';
                                $empClass = str_contains($emp, 'Job') ? 'emp-jo' : (str_contains($emp, 'Regular') ? 'emp-regular' : '');
                            @endphp
                            @if($empClass)
                                <span class="emp-badge {{ $empClass }}">{{ $emp }}</span>
                            @else
                                {{ $emp }}
                            @endif
                        </td>
                        <td>{{ $record['time_in'] }}</td>
                        <td>
                            <span class="status-badge status-{{ $record['status'] }}">
                                {{ ucfirst($record['status']) }}
                            </span>
                        </td>
                    </tr>
                @endforeach
            </tbody>
        </table>
    @else
        <div class="empty">No records found for the selected filters.</div>
    @endif

    <!-- ===== FIXED FOOTER (bottom of every page) ===== -->
    <div class="footer">
        <div class="office">OFFICIAL ATTENDANCE FORM • Human Resource Management Office (HRMO)</div>
        <div class="statement">
            This is the official HRMO attendance form used for LGU activities. As part of the LGU's
            digitalization initiative, attendance is recorded through the Activity QR Code Attendance System.
        </div>
    </div>
</body>
</html>