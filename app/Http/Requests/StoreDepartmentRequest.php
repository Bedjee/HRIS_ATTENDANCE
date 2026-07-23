<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreDepartmentRequest extends FormRequest
{
    public function authorize()
    {
        return $this->user()->isHr();
    }

    public function rules()
    {
        return [
            'cluster_id' => ['required', 'exists:clusters,id'],
            'name' => ['required', 'string', 'max:255', Rule::unique('departments', 'name')->ignore($this->route('department'))],
            'status' => ['required', Rule::in(['active', 'inactive'])],
        ];
    }
}
