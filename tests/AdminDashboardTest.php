<?php
// Define TESTING before autoload so included pages can adapt behavior
if (!defined('TESTING')) {
    define('TESTING', true);
}

require_once __DIR__ . '/../vendor/autoload.php';

use PHPUnit\Framework\TestCase;

class AdminDashboardTest extends TestCase
{
    protected function setUp(): void
    {
        // Ensure any previous session is cleaned up so session_start() inside page works
        if (session_status() === PHP_SESSION_ACTIVE) {
            session_unset();
            session_destroy();
        }

        // Start a fresh session
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }

        // Start from a clean $_SESSION
        $_SESSION = [];

        // Remove headers that might have been registered
        if (function_exists('header_remove')) {
            header_remove();
        }

        // Clear any test redirect marker
        if (isset($GLOBALS['TEST_REDIRECT'])) {
            unset($GLOBALS['TEST_REDIRECT']);
        }
    }

    protected function tearDown(): void
    {
        // Ensure session is cleaned up after each test
        if (session_status() === PHP_SESSION_ACTIVE) {
            session_unset();
            session_destroy();
        }

        // Remove test redirect marker
        if (isset($GLOBALS['TEST_REDIRECT'])) {
            unset($GLOBALS['TEST_REDIRECT']);
        }
    }

    public function testRedirectsIfNotAdmin()
    {
        // Make sure admin flag is not present
        unset($_SESSION['admin']);

        // Include the dashboard. Because TESTING is defined, admin_dashboard.php will not exit.
        include __DIR__ . '/../php/admin_dashboard.php';

        // First, prefer the explicit test marker set by the page
        $redirect = $GLOBALS['TEST_REDIRECT'] ?? null;
        if ($redirect !== null) {
            $this->assertStringContainsString('login.php', $redirect);
            return;
        }

        // Fallback: check headers_list (if header() succeeded)
        $headers = headers_list();
        $this->assertNotEmpty($headers, 'No headers were sent');

        $redirectFound = false;
        foreach ($headers as $header) {
            if (stripos($header, 'Location:') !== false && stripos($header, 'login.php') !== false) {
                $redirectFound = true;
                break;
            }
        }

        $this->assertTrue($redirectFound, 'Non-admin should be redirected to login');
    }

    public function testAllowsAccessIfAdmin()
    {
        // Put admin flag in session BEFORE including the page
        $_SESSION['admin'] = true;

        // Capture output for inspection
        ob_start();
        include __DIR__ . '/../php/admin_dashboard.php';
        $output = ob_get_clean();

        $this->assertStringContainsString('Admin Dashboard', $output);
        $this->assertStringContainsString('Manage Kopano Manyano', $output);
    }

    public function testSessionIsActive()
    {
        // Ensure admin set so the page doesn't redirect away
        $_SESSION['admin'] = true;

        include __DIR__ . '/../php/admin_dashboard.php';

        $this->assertSame(PHP_SESSION_ACTIVE, session_status(), 'Session should be active after including the dashboard');
    }

    public function testAdminFlagCanBeSet()
    {
        $_SESSION = [];
        $_SESSION['admin'] = true;
        $this->assertTrue(isset($_SESSION['admin']) && $_SESSION['admin'] === true);
    }
}