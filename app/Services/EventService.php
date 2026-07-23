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
            Log::info('Creating event with data:', $data);
            $event = Event::create($data);
            $employeeIds = $this->computeEmployeeIds($data);
            $event->requiredEmployees()->sync($employeeIds);
            Log::info('Event created with ' . count($employeeIds) . ' required employees');
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

    public function deleteEvent($id)
    {
        return DB::transaction(function () use ($id) {
            $event = Event::findOrFail($id);
            if ($event->attendances()->exists()) {
                throw new \Exception('Cannot delete an event that already has attendance records.');
            }
            $event->requiredEmployees()->detach();
            $event->delete();
            return true;
        });
    }
}
