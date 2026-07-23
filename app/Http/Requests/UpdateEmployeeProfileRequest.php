<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateEmployeeProfileRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->isEmployee();
    }

    public function rules(): array
    {
        $userId = $this->user()->id;
        $employeeId = $this->user()->employee->id;

        return [
            'first_name' => ['required', 'string', 'max:255'],
            'middle_initial' => ['nullable', 'string', 'max:1'],
            'last_name' => ['required', 'string', 'max:255'],
            'username' => [
                'required',
                'string',
                'max:255',
                Rule::unique('users', 'username')->ignore($userId),
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'username.unique' => 'This username is already taken.',
        ];
    }
}
