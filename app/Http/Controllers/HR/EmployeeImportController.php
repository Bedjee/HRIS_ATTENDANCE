<?php

namespace App\Http\Controllers\HR;

use App\Http\Controllers\Controller;
use App\Http\Requests\ImportEmployeesRequest;
use App\Services\EmployeeImportService;
use Illuminate\Http\Request;

class EmployeeImportController extends Controller
{
    protected $importService;

    public function __construct(EmployeeImportService $importService)
    {
        $this->importService = $importService;
    }

    /**
     * Show the import page.
     */
    public function index()
    {
        return inertia('HR/Employees/Import');
    }

    /**
     * Preview the import.
     */
    public function preview(ImportEmployeesRequest $request)
    {
        try {
            $result = $this->importService->previewImport($request->file('file'));
            return response()->json(['success' => true, 'data' => $result]);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 422);
        }
    }

    /**
     * Confirm and execute the import.
     */
   public function confirm(Request $request)
{
    set_time_limit(0);
    ini_set('memory_limit', '512M');

    $validRecords = $request->input('valid_records', []);
    if (empty($validRecords)) {
        return response()->json(['success' => false, 'message' => 'No valid records to import.'], 422);
    }

    $result = $this->importService->import($validRecords);
    return response()->json(['success' => true, 'data' => $result]);
}


}
