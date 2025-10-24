KMGC WEBSITE
The Kmgc website is a community focused ebsite developed for the Kopano Manyano God the founder. It enables users to register, login, make donations and volunteer for activitites and community inactivities.
This websites supports both users and administration in managing donations and volunteer participation efficiently.


KMGC Program 1 is a PHP-based web application linked to a MySQL database (kmgc_db) that allows users to:

Sign up and create an account

Log in and access a personal dashboard

Make donations and track donation history

Admin users can manage users and view donations

This system uses PDO for secure database interactions and password hashing for user security.

Features

User Authentication: Signup, login, logout

User Dashboard: View personal donations

Donation Management: Users can submit donations; admin can view all donations

Secure Database Integration: Prepared statements to prevent SQL injection

Session Management: Maintains logged-in state

Database Structure

The MySQL database kmgc_db contains the following tables:

Users
Column	Type	Description
id	INT	Primary key, auto-increment
username	VARCHAR(50)	User’s display name
email	VARCHAR(100)	User’s email
password	VARCHAR(255)	Hashed password
created_at	TIMESTAMP	Account creation timestamp
is_admin	INT	Admin flag (0 = user, 1 = admin)
Donations
Column	Type	Description
donation_id	INT	Primary key, auto-increment
full_name	VARCHAR(100)	Donor’s full name
email	VARCHAR(100)	Donor’s email
amount	DECIMAL(10,2)	Donation amount
donation_date	TIMESTAMP	Donation submission timestamp

Installation

Clone the repository or download the project files.

Set up XAMPP/WAMP/LAMP and start Apache and MySQL.

Import the database:

Open phpMyAdmin → Create database kmgc_db

Run the SQL script included (kmgc_db.sql) to create tables and sample data

Update database credentials in db.php if necessary:

$host = 'localhost';
$dbname = 'kmgc_db';
$username = 'root';
$password = '';


Place the project folder in your web server root (htdocs for XAMPP).

Usage
Signup

Open signup_form.php in your browser

Enter username, email, and password → Submit

Login

Open login_form.php

Enter email and password → Redirects to dashboard.php

Donations

Open donation_form.php

Enter full name, email, donation amount → Submit

Dashboard

Displays all donations submitted by the logged-in user

Logout using the provided link

File Structure
/Project Root
│
├─ db.php                  # Database connection
├─ signup.php              # User signup functions
├─ login.php               # User login/logout functions
├─ donations.php           # Donation functions
├─ signup_form.php         # Signup form
├─ login_form.php          # Login form
├─ donation_form.php       # Donation form
├─ dashboard.php           # User dashboard
├─ logout.php              # Logout script
└─ kmgc_db.sql             # Database creation script

Contributing

Fork the repository and create a branch for your feature.

Submit pull requests with clear descriptions.

Ensure all new code is secure and follows existing conventions.

License

This project is open-source and free to use for educational purposes.
