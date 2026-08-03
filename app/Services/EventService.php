<?php

namespace App\Services;

use App\Models\Event;
use App\Models\Employee;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class EventService
{
    private function computeEmployeeIds(array $data): array
    {
        $mode = $data['attendance_mode'] ?? 'all_employees';
        $ids = [];

        Log::info('Computing employee IDs for mode: ' . $mode, [
            'selected_clusters' => $data['selected_clusters'] ?? [],
            'selected_departments' => $data['selected_departments'] ?? [],
            'employee_ids' => $data['employee_ids'] ?? [],
        ]);

        switch ($mode) {
            case 'all_employees':
                $ids = Employee::pluck('id')->toArray();
                break;

            case 'selected_clusters':
                $clusterIds = $data['selected_clusters'] ?? [];
                $ids = Employee::whereHas('department.cluster', function ($q) use ($clusterIds) {
                    $q->whereIn('clusters.id', $clusterIds);
                })->pluck('id')->toArray();
                break;

            case 'selected_departments':
                $deptIds = $data['selected_departments'] ?? [];
                $ids = Employee::whereIn('department_id', $deptIds)->pluck('id')->toArray();
                break;

            case 'selected_employees':
                $ids = $data['employee_ids'] ?? [];
                break;
        }

        $uniqueIds = array_unique($ids);
        Log::info('Computed ' . count($uniqueIds) . ' employee IDs');
        return $uniqueIds;
    }

    public function getAllEvents($perPage = 10)
    {
        return Event::withCount('requiredEmployees')
            ->orderBy('date', 'desc')
            ->paginate($perPage);
    }

    public function getEventById($id)
    {
        return Event::with('requiredEmployees')->findOrFail($id);
    }

    public function createEvent(array $data)
{
    return DB::transaction(function () use ($data) {
        Log::info('1. Creating event with data:', $data);

        try {
            $event = Event::create($data);
            Log::info('2. Event created with ID: ' . ($event->id ?? 'null'));
        } catch (\Exception $e) {
            Log::error('3. Event::create failed: ' . $e->getMessage());
            throw $e;
        }

        try {
            $employeeIds = $this->computeEmployeeIds($data);
            Log::info('4. Computed employee IDs:', ['ids' => $employeeIds]);
        } catch (\Exception $e) {
            Log::error('5. computeEmployeeIds failed: ' . $e->getMessage());
            throw $e;
        }

        try {
            $event->requiredEmployees()->sync($employeeIds);
            Log::info('6. Sync completed successfully.');
        } catch (\Exception $e) {
            Log::error('7. Sync failed: ' . $e->getMessage());
            throw $e;
        }

        Log::info('8. Event created with ' . count($employeeIds) . ' required employees');
        return $event;
    });
}


    public function updateEvent($id, array $data)
    {
        return DB::transaction(function () use ($id, $data) {
            $event = Event::findOrFail($id);
            $event->update($data);
            $employeeIds = $this->computeEmployeeIds($data);
            $event->requiredEmployees()->sync($employeeIds);
            return $event;
        });
    }

// app/Services/EventService.php

// app/Services/EventService.php

public function deleteEvent($id)
{
    return DB::transaction(function () use ($id) {
        $event = Event::findOrFail($id);

        Log::info('Deleting event with attendance records: ' . $event->attendances()->count());

        // Delete all attendance records (cascading foreign key will also handle)
        $event->attendances()->delete();

        // Detach required employees (pivot table)
        $event->requiredEmployees()->detach();

        // Delete the event
        $event->delete();

        Log::info('Event deleted successfully: ' . $id);
        return true;
    });
}

}
