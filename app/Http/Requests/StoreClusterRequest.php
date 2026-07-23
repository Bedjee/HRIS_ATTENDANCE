<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreClusterRequest extends FormRequest
{
    public function authorize()
    {
        return $this->user()->isHr();
    }

    public function rules()
    {
        return [
            'name' => ['required', 'string', 'max:255', Rule::unique('clusters', 'name')->ignore($this->route('cluster'))],
            'description' => ['nullable', 'string'],
            'status' => ['required', Rule::in(['active', 'inactive'])],
        ];
    }
}
