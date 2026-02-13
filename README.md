# Mini Contact Center Dashboard

## Description
Mini Contact Center Dashboard is a full-stack admin tool that allows agents to view, search, create, update, and manage customer contacts and their interactions.
The project demonstrates a clean production-style architecture using:

* Laravel REST API (PHP 8+)
* Laravel REST API (PHP 8+)
* MySQL database
* Token authentication with Laravel Sanctum

The goal of this project is to showcase full-stack development skills including API design, state management, authentication, responsive UI, and overall code organization.


# Requirements to Run the Project

Before running the project, make sure you have the following installed:

* PHP 8.1+
* Composer
* Node.js (v18+ recommended)
* MySQL or MariaDB
* MySQL or MariaDB
* Git

# Project Setup Instructions

### Clone the repository:
git clone <repo-url>
cd contact-center

# Backend Setup (Laravel)
### Navigate to backend root (project root):
composer install

### Create environment file:
cp .env.example .env

### Update .env database settings:
DB_DATABASE=contact_center
DB_USERNAME=root
DB_PASSWORD=

### Create database manually in MySQL:
contact_center

### Generate app key:
php artisan key:generate

### Run migrations and seed database:
php artisan migrate --seed

### Install Sanctum tables:
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"
php artisan migrate

### Start backend server:
php artisan serve

### Backend will run on:
http://127.0.0.1:8000

## Test Login Credentials

### Use seeded test agent:
Email: agent@example.com
Password: password

# Frontend Setup (React)
cd frontend
npm install
npm run dev

### Frontend will run on:
http://localhost:5173