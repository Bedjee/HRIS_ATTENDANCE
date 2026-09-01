<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use App\Models\Employee;

class StoreEmployeeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->isHr();
    }

    public function rules(): array
    {
        return [
            'first_name'         => ['required', 'string', 'max:255'],
            'last_name'          => ['required', 'string', 'max:255'],
            'middle_initial'     => ['nullable', 'string', 'max:1'],
            'department_id'      => ['required', 'integer', 'exists:departments,id'],
            'employment_status'  => ['required', 'string', Rule::in(Employee::getStatuses())],
        ];
    }
}
