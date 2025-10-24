<?php

if (!defined('TESTING')) {
    define('TESTING', true);
}
use PHPUnit\Framework\TestCase;

class LoginTest extends TestCase
{
    protected function setUp(): void
    {
        if (session_status() === PHP_SESSION_ACTIVE) {
            session_unset();
            session_destroy();
        }
        session_start();
    }

    protected function tearDown(): void
    {
        session_unset();
        session_destroy();
    }

    public function testLoginWithValidCredentials()
    {
        $_POST['email'] = 'test@example.com';
        $_POST['password'] = 'password123';

        ob_start();
        include __DIR__ . '/../php/login_process.php';
        $output = ob_get_clean();

        $this->assertStringContainsString('success', $output);
    }

    public function testLoginWithInvalidCredentials()
    {
        $_POST['email'] = 'wrong@example.com';
        $_POST['password'] = 'wrongpassword';

        ob_start();
        include __DIR__ . '/../php/login_process.php';
        $output = ob_get_clean();

        $this->assertStringContainsString('error', $output);
    }
}