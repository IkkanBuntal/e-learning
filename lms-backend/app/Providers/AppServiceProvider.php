<?php

namespace App\Providers;

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
     */
    public function boot(): void
    {
        // Fix route model binding untuk Kelas
        // Laravel singular-kan route param menjadi 'kela', tapi model adalah 'Kelas'
        \Illuminate\Support\Facades\Route::model('kela', \App\Models\Kelas::class);
    }
}
