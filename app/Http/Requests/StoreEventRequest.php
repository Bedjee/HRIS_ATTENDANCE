<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreEventRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() && $this->user()->isHr();
    }

   public function rules(): array
{
    return [
        'title' => ['required', 'string', 'max:255'],
        'description' => ['nullable', 'string'],
        'date' => ['required', 'date', 'after_or_equal:today'],
        'time' => ['required', 'date_format:H:i'],
        'end_time' => ['nullable', 'date_format:H:i', 'after:time'],
        'venue' => ['required', 'string', 'max:255'],
        'status' => ['required', Rule::in(['upcoming', 'ongoing', 'completed'])],
        'attendance_mode' => ['required', Rule::in(['all_employees', 'selected_clusters', 'selected_departments', 'selected_employees'])],
        'selected_clusters' => ['nullable', 'array'],
        'selected_clusters.*' => ['exists:clusters,id'],
        'selected_departments' => ['nullable', 'array'],
        'selected_departments.*' => ['exists:departments,id'],
        'employee_ids' => ['nullable', 'array'],
        'employee_ids.*' => ['exists:employees,id'],
        'grace_period' => ['nullable', 'integer', 'min:0'],
    ];
}

    public function messages(): array
    {
        return [
            'date.after_or_equal' => 'The event date must be today or a future date.',
            'time.date_format' => 'The time must be in HH:MM format.',
        ];
    }
}
