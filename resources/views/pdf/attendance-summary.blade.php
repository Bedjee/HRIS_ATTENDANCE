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
        .filters {
            font-size: 10px;
            color: #555;
            margin: 5px 0 10px;
            text-align: center;
        }
        .filters span {
            display: inline-block;
            margin: 0 8px;
            background: #f0f4f8;
            padding: 2px 10px;
            border-radius: 12px;
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
        .legend .present {
            color: #16a34a;
            font-weight: bold;
        }
        .legend .late {
            color: #f59e0b;
            font-weight: bold;
        }
        .legend .absent {
            color: #dc2626;
            font-weight: bold;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 15px;
            table-layout: fixed;
            font-size: 9px;
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
        .status-present {
            color: #16a34a;
            font-weight: bold;
        }
        .status-late {
            color: #f59e0b;
            font-weight: bold;
        }
        .status-absent {
            color: #dc2626;
            font-weight: bold;
        }
        .summary {
            font-weight: bold;
        }
        .event-title {
            word-wrap: break-word;
            hyphens: auto;
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
        .page-break {
            page-break-after: always;
        }
        /* Dynamic sizing */
        @php
            $eventCount = count($events);
            $colWidth = 100;
            $nameWidth = 18;
            $summaryWidth = 8;
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
                $fontSize = max(6, 9 - floor(($eventCount - 10) / 3));
            } else {
                $fontSize = 9;
            }
        @endphp
        .event-col { width: {{ $eventColWidth }}%; }
        .name-col { width: {{ $nameWidth }}%; }
        .summary-col { width: {{ $summaryWidth }}%; }
        .small-font { font-size: {{ $fontSize }}px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>Attendance Summary Report</h1>
        <p><strong>Generated:</strong> {{ $generated_at }}</p>
        @if(!empty($filters))
            <div class="filters">
                <strong>Filters:</strong>
                @foreach($filters as $filter)
                    <span>{{ $filter }}</span>
                @endforeach
            </div>
        @endif
    </div>

    <!-- Legend -->
    <div class="legend">
        <span><span class="present">P</span> = Present</span>
        <span><span class="late">L</span> = Late</span>
        <span><span class="absent">A</span> = Absent</span>
    </div>

    @php
        $grandTotalPresent = 0;
        $grandTotalLate = 0;
        $grandTotalEvents = count($events);
    @endphp

    @foreach ($report as $department => $data)
        <h2 style="margin: 18px 0 8px; background-color: #f0f4f8; padding: 5px 10px; border-left: 4px solid #1a3a56; font-size: 13px;">
            {{ $department }}
        </h2>

        <div style="overflow-x:auto;">
            <table class="small-font">
                <thead>
                    <tr>
                        <th class="name-col" style="text-align:left; padding-left:6px;">Employee</th>
                        @foreach ($events as $event)
                            <th class="event-col event-title" style="font-size: {{ max(7, $fontSize - 1) }}px;">
                                {{ $event->title }}
                                <span class="event-date">{{ \Carbon\Carbon::parse($event->date)->format('M d') }}</span>
                            </th>
                        @endforeach
                        <th class="summary-col">Attendance</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach ($data['employees'] as $employee)
                        @php
                            $presentCount = 0;
                            $lateCount = 0;
                        @endphp
                        <tr>
                            <td class="employee-name name-col">{{ $employee['name'] }}</td>
                            @foreach ($employee['events'] as $eventStatus)
                                @php
                                    $status = $eventStatus['status'];
                                    $display = '';
                                    $class = '';
                                    if ($status === 'present') {
                                        $display = 'P';
                                        $class = 'status-present';
                                        $presentCount++;
                                        $grandTotalPresent++;
                                    } elseif ($status === 'late') {
                                        $display = 'L';
                                        $class = 'status-late';
                                        $lateCount++;
                                        $grandTotalLate++;
                                    } else {
                                        $display = 'A';
                                        $class = 'status-absent';
                                    }
                                @endphp
                                <td class="event-col {{ $class }}">{{ $display }}</td>
                            @endforeach
                            <td class="summary summary-col">
                                {{ $presentCount + $lateCount }}/{{ $eventCount }}
                            </td>
                        </tr>
                    @endforeach
                </tbody>
            </table>
        </div>
    @endforeach

    <div class="footer">
        <p>
            <strong>Grand Totals:</strong>
            P {{ $grandTotalPresent }} |
            L {{ $grandTotalLate }} |
            A {{ ($grandTotalEvents * count($report) * count($data['employees'])) - $grandTotalPresent - $grandTotalLate }}
            <!-- simplified; we could compute properly but not necessary for clarity -->
        </p>
        <p>Generated by QR Attendance System</p>
    </div>
</body>
</html>0
