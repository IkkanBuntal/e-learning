<?php

namespace App\Providers;

use App\Models\User;
use App\Observers\UserObserver;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     *
     * Observers are registered here per Laravel 13 docs:
     * https://laravel.com/docs/13.x/eloquent#observers
     */
    public function boot(): void
    {
        // Fix route model binding untuk Kelas
        // Laravel singular-kan route param menjadi 'kela', tapi model adalah 'Kelas'
        \Illuminate\Support\Facades\Route::model('kela', \App\Models\Kelas::class);

        // Log semua aktivitas CRUD User ke ActivityLog (tampil di Aktivitas Terkini)
        User::observe(UserObserver::class);
    }
}
