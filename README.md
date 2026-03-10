# DOIT - Modern Productivity & Task Management System

![Laravel](https://img.shields.io/badge/Laravel-12.x-FF2D20?style=for-the-badge&logo=laravel)
![Next.js](https://img.shields.io/badge/Next.js-16.x-000000?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.x-38B2AC?style=for-the-badge&logo=tailwind-css)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-4169E1?style=for-the-badge&logo=postgresql)
![Docker](https://img.shields.io/badge/Docker-Enabled-2496ED?style=for-the-badge&logo=docker)

**DOIT** is a full-stack, containerized productivity application designed to help users manage their goals, projects, and daily tasks with ease. It features a robust Laravel API and a sleek, responsive Next.js frontend.

---

## 🚀 Key Features

- **Secure Authentication**: User registration and login powered by Laravel Sanctum.
- **Goal Tracking**: Set and manage long-term objectives.
- **Project Management**: Organize tasks into specific projects linked to your goals.
- **Task Lifecycle**: CRUD operations for tasks with real-time status updates.
- **Daily Activity Tracking**:
  - `DailyLog` system that automatically tracks completed tasks.
  - Visual activity chart (contribution graph style) to monitor progress over time.
- **Automated Archiving**: Custom Artisan command (`app:close-day`) to archive daily tasks and maintain workspace hygiene.
- **Responsive Design**: Modern UI built with Tailwind CSS and Lucide icons.

---

## 🛠 Tech Stack

### Backend

- **Framework**: [Laravel 12](https://laravel.com/)
- **Language**: PHP 8.2
- **Database**: PostgreSQL 15
- **Auth**: Laravel Sanctum (Token-based)
- **Tools**: PHPUnit, Laravel Tinker, Artisan

### Frontend

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Library**: React 19
- **Styling**: Tailwind CSS 4
- **Data Fetching**: Axios & SWR
- **Charts**: Recharts & React Activity Calendar
- **Icons**: Lucide React

### Infrastructure

- **Containerization**: Docker & Docker Compose
- **Web Server**: PHP Built-in server / Node.js Dev Server

---

## 📦 Installation & Setup

### Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running.
- `git` installed.

### Steps

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/your-username/doit.git
    cd doit
    ```

2.  **Configure Environment Variables:**
    Copy the `.env.template` to `.env` and fill in the values:

    ```bash
    cp .env.template .env
    ```

    _Note: Ensure the backend and frontend ports match your local environment preferences._

3.  **Launch the Application:**
    Use Docker Compose to build and start all services (Backend, Frontend, Database):

    ```bash
    docker-compose up --build
    ```

4.  **Access the services:**
    - **Frontend:** `http://localhost:3000`
    - **API (Backend):** `http://localhost:8000`
    - **Database:** `localhost:5432`

---

## 📂 Project Structure

```text
DOIT/
├── backend/            # Laravel API Application
│   ├── app/            # Models, Controllers, Observers
│   ├── database/       # Migrations & Seeders
│   ├── routes/         # API Route definitions
│   └── tests/          # Feature & Unit tests
├── frontend/           # Next.js Client Application
│   ├── app/            # App Router (Pages & Layouts)
│   ├── components/     # Reusable UI Components
│   ├── services/       # API integration layer
│   └── hooks/          # Custom React hooks
└── docker-compose.yaml # Orchestration for all services
```

---

## ⚙️ Development Commands

### Backend (via Docker)

To run commands inside the backend container:

```bash
docker-compose exec backend php artisan migrate
docker-compose exec backend php artisan app:close-day
docker-compose exec backend ./vendor/bin/phpunit
```

### Frontend

To install new packages or run linting:

```bash
cd frontend
npm install
npm run lint
```

---

Created as part of the PSI Project.
