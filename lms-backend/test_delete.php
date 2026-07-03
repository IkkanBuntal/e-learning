<?php
// 1. Login
$ch = curl_init('http://localhost:8000/api/login');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode(['email'=>'admin@sekolah.sch.id', 'password'=>'password']));
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json', 'Accept: application/json']);
$response = curl_exec($ch);
$data = json_decode($response, true);
$token = $data['data']['token'];
curl_close($ch);

// 2. Delete user 2 (assuming 2 is not admin)
$ch2 = curl_init('http://localhost:8000/api/users/2');
curl_setopt($ch2, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch2, CURLOPT_CUSTOMREQUEST, 'DELETE');
curl_setopt($ch2, CURLOPT_HTTPHEADER, [
    'Authorization: Bearer ' . $token,
    'Accept: application/json'
]);
$delResponse = curl_exec($ch2);
$httpcode = curl_getinfo($ch2, CURLINFO_HTTP_CODE);
curl_close($ch2);

echo "HTTP $httpcode\n";
echo $delResponse . "\n";

