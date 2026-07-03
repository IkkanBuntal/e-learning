<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Setting;

class SettingController extends Controller
{
    /**
     * Display the specified resource.
     */
    public function show()
    {
        $setting = Setting::current();
        return response()->json([
            'status' => 'success',
            'data' => $setting
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request)
    {
        $validated = $request->validate([
            'app_name' => 'nullable|string|max:255',
            'app_desc' => 'nullable|string',
            'tahun_ajaran' => 'nullable|string|max:20',
            'semester_aktif' => 'nullable|in:Ganjil,Genap',
            'min_kehadiran' => 'nullable|integer|min:0|max:100',
            'kkm' => 'nullable|integer|min:0|max:100',
            
            'email_notif' => 'nullable|boolean',
            'push_notif' => 'nullable|boolean',
            'deadline_reminder' => 'nullable|boolean',
            'grade_notif' => 'nullable|boolean',
            
            'email_from' => 'nullable|email|max:255',
            'smtp_host' => 'nullable|string|max:255',
            'smtp_port' => 'nullable|string|max:10',
            'smtp_user' => 'nullable|string|max:255',
            'smtp_password' => 'nullable|string|max:255',
            
            'max_file_size' => 'nullable|integer|min:1',
            'allowed_formats' => 'nullable|string|max:255',
            
            'auto_backup' => 'nullable|boolean',
            'backup_freq' => 'nullable|string|max:20',
            'backup_retention' => 'nullable|integer|min:1',
        ]);

        $setting = Setting::current();
        
        // Handle file upload separately if there is an app_logo sent as file
        if ($request->hasFile('app_logo')) {
            $file = $request->file('app_logo');
            $path = $file->store('settings', 'public');
            $validated['app_logo'] = $path;
        }

        $setting->update($validated);

        return response()->json([
            'status' => 'success',
            'message' => 'Pengaturan berhasil diperbarui',
            'data' => $setting
        ]);
    }
}
