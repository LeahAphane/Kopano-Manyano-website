<?php
try {
    $pdo = mysqli_connect("localhost", "root", "", "kmgc_db");
    echo "Connected successfully!";
} catch (Exception $e) {
    echo "Connection failed: " . mysqli_error($pdo);
}
?>