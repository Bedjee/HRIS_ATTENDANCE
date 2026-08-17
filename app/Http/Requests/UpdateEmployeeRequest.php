<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use App\Models\Employee;

class UpdateEmployeeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->isHr();
    }

    public function rules(): array
    {
        $employee = $this->route('employee');
        $userId   = $employee->user_id;

        return [
            'first_name'         => ['required', 'string', 'max:255'],
            'last_name'          => ['required', 'string', 'max:255'],
            'middle_initial'     => ['nullable', 'string', 'max:1'],
            'department_id'      => ['required', 'integer', 'exists:departments,id'],
            'username'           => ['required', 'string', 'max:255', Rule::unique('users', 'username')->ignore($userId)],
            'is_active'          => ['boolean'],
            'profile_photo'      => ['nullable', 'image', 'max:2048'],
            'employment_status'  => ['nullable', 'string', Rule::in(Employee::getStatuses())],
        ];
    }
}
