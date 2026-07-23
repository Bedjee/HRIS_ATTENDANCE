<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Attendance Summary Report</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: 'DejaVu Sans', sans-serif;
            margin: 20px;
            font-size: 11px;
            line-height: 1.4;
        }
        .header {
            text-align: center;
            margin-bottom: 20px;
        }
        .header h1 {
            font-size: 22px;
            color: #1a3a56;
        }
        .header p {
            color: #555;
            margin: 4px 0;
        }
        .legend {
            text-align: center;
            margin: 10px 0 15px;
            font-size: 10px;
        }
        .legend span {
            display: inline-block;
            margin: 0 12px;
        }
        .legend .present-color {
            color: #16a34a;
            font-weight: bold;
        }
        .legend .absent-color {
            color: #dc2626;
            font-weight: bold;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 15px;
            table-layout: fixed;
            font-size: 9px; /* base size, will be overridden by dynamic class */
        }
        th {
            background-color: #1a3a56;
            color: white;
            padding: 5px 4px;
            text-align: center;
            border: 1px solid #ccc;
            vertical-align: middle;
        }
        td {
            padding: 4px 3px;
            border: 1px solid #ccc;
            text-align: center;
            vertical-align: middle;
        }
        .department-header {
            background-color: #e8edf3;
            font-weight: bold;
            text-align: left;
            padding: 6px 8px;
            font-size: 12px;
        }
        .employee-name {
            text-align: left;
            font-weight: 500;
            padding-left: 6px;
        }
        .present {
            color: #16a34a;
            font-weight: bold;
        }
        .absent {
            color: #dc2626;
            font-weight: bold;
        }
        .summary {
            font-weight: bold;
        }
        .event-header {
            font-weight: bold;
            font-size: 8px;
            line-height: 1.2;
        }
        .event-date {
            font-weight: normal;
            font-size: 7px;
            display: block;
        }
        .footer {
            text-align: center;
            font-size: 9px;
            color: #888;
            margin-top: 15px;
            border-top: 1px solid #ddd;
            padding-top: 10px;
        }

        /* Dynamic sizing based on event count */
        @php
            $eventCount = count($events);
            $colWidth = 100; // remaining width for event columns
            $nameWidth = 18; // fixed percentage for employee name
            $summaryWidth = 8; // fixed for summary column
            // If many events, reduce name and summary widths slightly
            if ($eventCount > 10) {
                $nameWidth = 15;
                $summaryWidth = 6;
            }
            if ($eventCount > 15) {
                $nameWidth = 12;
                $summaryWidth = 5;
            }
            $eventColWidth = (100 - $nameWidth - $summaryWidth) / $eventCount;
            if ($eventColWidth < 5) {
                // Too many events – we need to shrink font size further
                $fontSize = max(6, 9 - floor(($eventCount - 10) / 3));
            } else {
                $fontSize = 9;
            }
        @endphp
        .event-col {
            width: {{ $eventColWidth }}%;
        }
        .name-col {
            width: {{ $nameWidth }}%;
        }
        .summary-col {
            width: {{ $summaryWidth }}%;
        }
        .small-font {
            font-size: {{ $fontSize }}px;
        }
        /* For wrapping long event titles */
        .event-title {
            word-wrap: break-word;
            hyphens: auto;
        }
        /* Ensure table doesn't overflow */
        .table-container {
            overflow-x: auto;
        }
        /* Page break helper */
        .page-break {
            page-break-after: always;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Attendance Summary Report</h1>
        <p><strong>Generated:</strong> {{ $generated_at }}</p>
        <p><strong>Organization‑wide Events Only</strong></p>
    </div>

    <!-- Legend -->
    <div class="legend">

    </div>

    @php
        $eventCount = count($events);
    @endphp

    @foreach ($report as $department => $data)
        <h2 style="margin: 18px 0 8px; background-color: #f0f4f8; padding: 5px 10px; border-left: 4px solid #1a3a56; font-size: 13px;">
            {{ $department }}
        </h2>

        <div class="table-container">
            <table class="small-font">
                <thead>
                    <tr>
                        <th class="name-col" style="text-align:left; padding-left:6px;">Employee</th>
                        @foreach ($events as $event)
                            <th class="event-col event-header event-title" style="font-size: {{ max(7, $fontSize - 1) }}px; word-wrap:break-word;">
                                {{ $event->title }}
                                <span class="event-date">{{ \Carbon\Carbon::parse($event->date)->format('M d, Y') }}</span>
                            </th>
                        @endforeach
                        <th class="summary-col">Attendance</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach ($data['employees'] as $employee)
                        <tr>
                            <td class="employee-name name-col">{{ $employee['name'] }}</td>
                            @foreach ($employee['events'] as $eventStatus)
                                <td class="event-col">
                                    <span class="{{ $eventStatus['present'] ? 'present' : 'absent' }}">
                                        {{ $eventStatus['present'] ? 'P' : 'A' }}
                                    </span>
                                </td>
                            @endforeach
                            <td class="summary summary-col">
                                {{ $employee['attended_count'] }}/{{ $eventCount }}
                            </td>
                        </tr>
                    @endforeach
                </tbody>
            </table>
        </div>
    @endforeach

    <div class="footer">
        <p>This report includes only events with <strong>All Employees</strong> attendance mode.</p>
        <p>Generated by QR Attendance System</p>
    </div>
</body>
</html>
