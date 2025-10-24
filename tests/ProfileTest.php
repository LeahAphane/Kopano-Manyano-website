<?php
use PHPUnit\Framework\TestCase;

class ProfileTest extends TestCase
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

    public function testEditProfile()
    {
        $_POST['name'] = 'John Doe';
        $_POST['email'] = 'john@example.com';
        $_SESSION['user_id'] = 1;
        
        ob_start();
        include __DIR__ . '/../php/edit_profile.php';
        $output = ob_get_clean();
        
        $this->assertStringContainsString('success', $output);
    }

    public function testProfileAccessWithoutLogin()
    {
        unset($_SESSION['user_id']);
        
        ob_start();
        include __DIR__ . '/../php/Profile.php';
        $output = ob_get_clean();
        
        $this->assertStringContainsString('redirect', $output);
    }
}