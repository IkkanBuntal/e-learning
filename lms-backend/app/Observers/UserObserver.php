<?php

namespace App\Observers;

use App\Models\ActivityLog;
use App\Models\User;

/**
 * UserObserver — logs every create / update / delete on the User model
 * to ActivityLog so the "Aktivitas Terkini" dashboard section reflects
 * user management actions automatically.
 *
 * Registered in AppServiceProvider::boot() via User::observe(UserObserver::class).
 * (Laravel 13 docs: https://laravel.com/docs/13.x/eloquent#observers)
 */
class UserObserver
{
    /**
     * Handle the User "created" event.
     */
    public function created(User $user): void
    {
        $role = optional($user->role)->nama ?? 'user';
        ActivityLog::log(
            'create',
            'User',
            $user->nama,
            "Menambahkan {$role} baru: {$user->nama}"
        );
    }

    /**
     * Handle the User "updated" event.
     */
    public function updated(User $user): void
    {
        $role = optional($user->role)->nama ?? 'user';
        ActivityLog::log(
            'update',
            'User',
            $user->nama,
            "Mengubah data {$role}: {$user->nama}"
        );
    }

    /**
     * Handle the User "deleted" event.
     */
    public function deleted(User $user): void
    {
        $role = optional($user->role)->nama ?? 'user';
        ActivityLog::log(
            'delete',
            'User',
            $user->nama,
            "Menghapus {$role}: {$user->nama}"
        );
    }
}
