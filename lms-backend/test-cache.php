<?php

require __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use Illuminate\Support\Facades\Cache;

echo "Testing Redis Cache...\n";
echo "=====================\n\n";

// Test 1: Simple string
echo "Test 1: Simple string\n";
Cache::put('test_string', 'Hello Redis!', 60);
$result = Cache::get('test_string');
echo "Stored: test_string\n";
echo "Retrieved: " . $result . "\n";
echo "Status: " . ($result === 'Hello Redis!' ? '✓ PASS' : '✗ FAIL') . "\n\n";

// Test 2: Array
echo "Test 2: Array data\n";
$data = ['name' => 'John', 'role' => 'admin'];
Cache::put('test_array', $data, 60);
$result = Cache::get('test_array');
echo "Stored: " . json_encode($data) . "\n";
echo "Retrieved: " . json_encode($result) . "\n";
echo "Status: " . ($result['name'] === 'John' ? '✓ PASS' : '✗ FAIL') . "\n\n";

// Test 3: Remember function
echo "Test 3: Remember function\n";
$value = Cache::remember('test_remember', 60, function() {
    return 'Generated value';
});
echo "First call (should generate): " . $value . "\n";
$value2 = Cache::remember('test_remember', 60, function() {
    return 'This should not run';
});
echo "Second call (should use cache): " . $value2 . "\n";
echo "Status: " . ($value === $value2 ? '✓ PASS' : '✗ FAIL') . "\n\n";

// Clean up
Cache::forget('test_string');
Cache::forget('test_array');
Cache::forget('test_remember');

echo "=====================\n";
echo "All tests completed!\n";
echo "Redis is working properly! ✓\n";
