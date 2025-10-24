<?php
ini_set('display_errors', 0);
ini_set('log_errors', 1);
ini_set('error_log', __DIR__ . '/error.log');

use Kreait\Firebase\Factory;

try {
    $autoloadPath = __DIR__ . '/vendor/autoload.php';
    if (!file_exists($autoloadPath)) {
        throw new Exception('Composer dependencies missing. Run "composer install" in /My Website/php/');
    }
    require_once $autoloadPath;

    $serviceAccountPath = __DIR__ . '/../config/kmgc-8a098-firebase-adminsdk.json';
    if (!file_exists($serviceAccountPath)) {
        throw new Exception('Firebase service account file missing at: ' . $serviceAccountPath);
    }

    $factory = (new Factory)->withServiceAccount($serviceAccountPath);
    $firebase = $factory->create();
    $auth = $firebase->getAuth();
} catch (Exception $e) {
    error_log('Firebase config error: ' . $e->getMessage());
    throw new Exception('Firebase configuration error');
}
?>