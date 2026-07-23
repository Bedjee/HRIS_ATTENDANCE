<?php

namespace App\Http\Controllers\HR;
use App\Models\User;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreHRUserRequest;
use App\Services\HRUserService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserController extends Controller
{
    protected $userService;

    public function __construct(HRUserService $userService)
    {
        $this->userService = $userService;
    }

    public function index(Request $request)
    {
        $perPage = $request->input('per_page', 10);
        $users = $this->userService->getAllHRUsers($perPage);
        return Inertia::render('HR/Users/Index', ['users' => $users]);
    }

    public function create()
    {
        return Inertia::render('HR/Users/Create');
    }

    public function store(StoreHRUserRequest $request)
    {
        try {
            $user = $this->userService->createHRUser($request->validated());
            return redirect()->route('hr.users.index')
                ->with('success', 'HR user created successfully.');
        } catch (\Exception $e) {
            return back()->with('error', 'Failed to create HR user: ' . $e->getMessage());
        }
    }

    public function edit(User $user)
    {
        return Inertia::render('HR/Users/Edit', ['user' => $user]);
    }

    public function update(StoreHRUserRequest $request, User $user)
    {
        try {
            $this->userService->updateHRUser($user, $request->validated());
            return redirect()->route('hr.users.index')
                ->with('success', 'HR user updated successfully.');
        } catch (\Exception $e) {
            return back()->with('error', 'Failed to update HR user: ' . $e->getMessage());
        }
    }

    public function resetPassword(Request $request, User $user)
    {
        $request->validate([
            'password' => ['required', 'string', 'min:8', 'confirmed'],
        ]);

        try {
            $this->userService->resetPassword($user, $request->password);
            return response()->json(['success' => true, 'message' => 'Password reset successfully.']);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 422);
        }
    }

    public function destroy(Request $request, User $user)
    {
        try {
            $this->userService->deleteHRUser($user, $request->user());
            return redirect()->route('hr.users.index')
                ->with('success', 'HR user deleted successfully.');
        } catch (\Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }
}
