<?php

if (!function_exists('json_decrypt')) {
    function json_decrypt($encryptedData)
    {
        try {
            $decrypted = decrypt($encryptedData);
            return json_decode($decrypted, true);
        } catch (\Exception $e) {
            return ['error' => 'Decryption failed'];
        }
    }
}