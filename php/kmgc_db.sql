-- Create database
CREATE DATABASE IF NOT EXISTS kmgc_db CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE kmgc_db;

-- =========================
-- USERS TABLE
-- =========================
CREATE TABLE IF NOT EXISTS users (
    id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    remember_token VARCHAR(64),
    firebase_uid VARCHAR(255),
    is_admin INT(11) DEFAULT 0,
    INDEX (username),
    INDEX (email),
    INDEX (firebase_uid)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =========================
-- EVENTS TABLE
-- =========================
CREATE TABLE IF NOT EXISTS events (
    event_id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    event_date DATE NOT NULL,
    location VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =========================
-- DONATIONS TABLE
-- =========================
CREATE TABLE IF NOT EXISTS donations (
    donation_id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    donation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    INDEX (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =========================
-- VOLUNTEERS TABLE
-- =========================
CREATE TABLE IF NOT EXISTS volunteers (
    volunteer_id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone_number CHAR(10) NOT NULL,
    preferred_role_id INT(11),
    submission_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    INDEX (email),
    INDEX (preferred_role_id),
    FOREIGN KEY (preferred_role_id) REFERENCES roles(role_id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =========================
-- ROLES TABLE
-- =========================
CREATE TABLE IF NOT EXISTS roles (
    role_id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
    role_name VARCHAR(50) NOT NULL,
    role_description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    INDEX (role_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =========================
-- SAMPLE DATA (OPTIONAL)
-- =========================
INSERT INTO roles (role_name, role_description) VALUES
('Event Organizer', 'Responsible for managing events'),
('Volunteer', 'Helps organize and run activities'),
('Donor Relations', 'Handles donor communication');

INSERT INTO users (username, email, password, is_admin)
VALUES ('admin', 'admin@example.com', '$2y$10$W3B9iF/avDGl/9jvPt5b5uWRxZbqYq8uQJmPwHbFHT9nAE07nyuQG', 1);
-- password = "admin123"
