<?php

namespace App\Http\Controllers;

use App\Http\Requests\UpdateEmployeeProfileRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Display the user's profile form.
     */
    public function edit(Request $request): Response
    {
        $user = $request->user();
        $employee = $user->employee;

        return Inertia::render('Profile/Edit', [
            'user' => [
                'id' => $user->id,
                'username' => $user->username,
            ],
            'employee' => [
                'id' => $employee->id,
                'first_name' => $employee->first_name,
                'middle_initial' => $employee->middle_initial,
                'last_name' => $employee->last_name,
                'full_name' => $employee->full_name,
            ],
        ]);
    }

    /**
     * Update the employee's profile information.
     */
    public function updateEmployee(UpdateEmployeeProfileRequest $request): RedirectResponse
    {
        $user = $request->user();
        $employee = $user->employee;

        // Update user
        $user->username = $request->username;
        $user->save();

        // Update employee
        $employee->first_name = $request->first_name;
        $employee->middle_initial = $request->middle_initial;
        $employee->last_name = $request->last_name;
        $employee->save();

        return Redirect::route('profile.edit')->with('success', 'Profile updated successfully.');
    }

    /**
     * Update the user's password.
     */
    public function updatePassword(Request $request): RedirectResponse
    {
        $request->validate([
            'current_password' => ['required', 'current_password'],
            'password' => ['required', 'confirmed', 'min:8'],
        ]);

        $user = $request->user();
        $user->password = bcrypt($request->password);
        $user->save();

        return Redirect::route('profile.edit')->with('success', 'Password updated successfully.');
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();
        Auth::logout();
        $user->delete();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }
}
