<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class HRUserService
{
    /**
     * Get all HR users (excluding super admin if any)
     */
    public function getAllHRUsers($perPage = 10)
    {
        return User::where('role', 'hr')
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);
    }

    /**
     * Create a new HR user.
     */
    public function createHRUser(array $data): User
    {
        return DB::transaction(function () use ($data) {
            return User::create([
                'username' => $data['username'],
                'password' => Hash::make($data['password']),
                'email' => $data['email'] ?? null,
                'role' => 'hr',
                'must_change_password' => true,
                'status' => $data['status'],
                'name' => $data['first_name'] . ' ' . $data['last_name'], // optional field
            ]);
        });
    }

    /**
     * Update an HR user.
     */
    public function updateHRUser(User $user, array $data): User
    {
        return DB::transaction(function () use ($user, $data) {
            $user->username = $data['username'];
            $user->email = $data['email'] ?? null;
            $user->status = $data['status'];
            $user->name = $data['first_name'] . ' ' . $data['last_name'];
            $user->save();

            return $user;
        });
    }

    /**
     * Reset password for an HR user.
     */
    public function resetPassword(User $user, string $newPassword): void
    {
        $user->password = Hash::make($newPassword);
        $user->must_change_password = true;
        $user->save();
    }

    /**
     * Delete an HR user (with safeguards).
     */
    public function deleteHRUser(User $user, ?User $currentUser): void
    {
        if ($currentUser && $currentUser->id === $user->id) {
            throw new \Exception('You cannot delete your own account.');
        }
        if ($user->role !== 'hr') {
            throw new \Exception('Only HR users can be deleted.');
        }
        $user->delete();
    }
}
