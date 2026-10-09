# Student Management System

A full-stack web application for managing student records, built with React, FastAPI, PostgreSQL, Docker, and Nginx.

## Overview

The Student Management System provides a simple interface to add, view, and delete student records. The React frontend communicates with a FastAPI backend through an Nginx reverse proxy, while PostgreSQL stores student information persistently.

## Features

* Add student records with name and course.
* View all registered students.
* Delete student records by ID.
* Validate student input.
* Store records in PostgreSQL.
* Persist database records across Docker container restarts.
* Access interactive API documentation using Swagger UI.
* Run the application using Docker Compose.

## Technology Stack

| Technology     | Purpose                      |
| -------------- | ---------------------------- |
| React          | Frontend user interface      |
| Vite           | Frontend build tool          |
| Python         | Backend programming language |
| FastAPI        | REST API development         |
| PostgreSQL     | Relational database          |
| Docker         | Containerization             |
| Docker Compose | Multi-container management   |
| Nginx          | Web server and reverse proxy |

## Project Architecture

```text
User
  |
  v
React Frontend
  |
  v
Nginx Reverse Proxy
  |
  v
FastAPI Backend
  |
  v
PostgreSQL Database
```

The application uses separate Docker services for the frontend, backend, and database.

## Project Structure

```text
student-management/
├── backend/
│   ├── main.py
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   ├── package.json
│   ├── package-lock.json
│   ├── vite.config.js
│   └── Dockerfile
├── nginx/
│   └── nginx.conf
├── docker-compose.yml
└── README.md
```

## Prerequisites

Install the following software before running the application:

* Docker Desktop
* Git
* A web browser

Ensure Docker Desktop is running.

## Run the Application

Clone the repository:

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd student-management
```

Build and start the application:

```bash
docker compose up -d --build
```

Check the running containers:

```bash
docker compose ps
```

Open the application:

* **Student Portal:** http://localhost:8080
* **Swagger API Documentation:** http://localhost:8080/api/docs
* **OpenAPI Definition:** http://localhost:8080/api/openapi.json

## API Endpoints

| Method | Endpoint                     | Description           |
| ------ | ---------------------------- | --------------------- |
| GET    | `/api/`                      | Check API status      |
| GET    | `/api/students`              | Retrieve all students |
| POST   | `/api/students`              | Add a student         |
| DELETE | `/api/students/{student_id}` | Delete a student      |

### Example: Add a Student

Request:

```http
POST /api/students
Content-Type: application/json
```

Request body:

```json
{
  "name": "Sumalatha",
  "course": "Computer Science"
}
```

Example response:

```json
{
  "id": 1,
  "name": "Sumalatha",
  "course": "Computer Science"
}
```

The returned ID is assigned by the database and may differ depending on existing records.

## Database Persistence

PostgreSQL uses a Docker named volume called `postgres_data` to preserve student records.

Restart the services:

```bash
docker compose restart
```

The existing records should remain available after the containers restart.

**Important:** Avoid `docker compose down -v` when you want to preserve your local database, because removing the named volume can delete its stored data.

## Testing

The following manual checks have been performed:

* Adding a student through the website.
* Deleting a student through the website.
* Retrieving student records through the API.
* Confirming that records remain available after restarting Docker containers.
* Opening the interactive Swagger documentation.

## Future Enhancements

* Update existing student records.
* Add student search and filtering.
* Add authentication and role-based access.
* Add automated API and frontend tests.
* Deploy the application to a cloud platform.
* Configure CI/CD for automated builds and deployments.

## Author

**M. Sumalatha**

B.Tech – Computer Science and Engineering

Interested in software development, cloud technologies, and DevOps.

## License

This project is intended for educational and portfolio purposes. Add a license file if you decide to distribute the project under a specific open-source license.
