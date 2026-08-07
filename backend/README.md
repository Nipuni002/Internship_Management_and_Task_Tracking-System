# 💻 Backend - Internship Management API Service

This is the backend service for the **Internship Management and Task Tracking System**. It is a RESTful API service built using **Spring Boot**, **Spring Security (with JWT)**, and **Spring Data MongoDB**.

---

## 🛠️ Tech Stack & Requirements

* **Language**: Java 17
* **Framework**: Spring Boot 3.3.2
* **Build Tool**: Apache Maven 3.6+
* **Database**: MongoDB (Local or Atlas Cloud Cluster)
* **Security**: Spring Security (Role-Based Access Control) & JSON Web Tokens (JWT)
* **API Documentation**: Springdoc OpenAPI / Swagger UI
* **Utility**: Project Lombok (reduces boilerplate code)

---

## 🚀 Getting Started & Installation

### 1. Prerequisites
Ensure you have **Java JDK 17** installed and configured in your environment path:
```bash
java --version
```
Verify Maven installation:
```bash
mvn --version
```

### 2. Database Setup
The backend uses **MongoDB**. The connection string is configured in [backend/src/main/resources/application.yml](file:///c:/Users/ASUS/OneDrive/Documents/GitHub/Internship_Management_and_Task_Tracking-System/backend/src/main/resources/application.yml).

* **Cloud MongoDB Atlas (Default)**: A pre-configured cloud sandbox database URI is provided in the repository configuration.
* **Local MongoDB**: If you prefer to use a local MongoDB instance running on your machine:
  1. Open [application.yml](file:///c:/Users/ASUS/OneDrive/Documents/GitHub/Internship_Management_and_Task_Tracking-System/backend/src/main/resources/application.yml)
  2. Change `spring.data.mongodb.uri` to:
     ```yaml
     uri: mongodb://localhost:27017/InternshipTask_db
     ```
  3. Ensure your local MongoDB daemon service is running.

### 3. Build & Run
From the `backend` folder, execute the following commands:

* **Clean and compile package**:
  ```bash
  mvn clean package
  ```
* **Run in development mode**:
  ```bash
  mvn spring-boot:run
  ```

The server will spin up on port **8080** by default.

---

## ⚙️ Configuration (`application.yml`)

The backend properties are organized under [application.yml](file:///c:/Users/ASUS/OneDrive/Documents/GitHub/Internship_Management_and_Task_Tracking-System/backend/src/main/resources/application.yml):
* `server.port`: Web server port (set to `8080`).
* `spring.data.mongodb.uri`: Database connection string.
* `app.jwt.secret`: Cryptographic secret key used to sign JWTs (HS256).
* `app.jwt.expiration-ms`: Lifetime duration of the generated login token (default is 24 hours: `86400000` ms).
* `springdoc.swagger-ui.path`: Swagger client access route.

---

## 🔑 Database Seeding & User Roles

Upon start, the database seeder checks for existing accounts. If not found, it populates the database with:
* **Admin Account**: `admin@internship.com` (password: `Password123!`)
* **Intern Account**: `intern@internship.com` (password: `Password123!`)

These roles govern security filters in [RoleProtectedRoute.jsx](file:///c:/Users/ASUS/OneDrive/Documents/GitHub/Internship_Management_and_Task_Tracking-System/frontend/src/routes/RoleProtectedRoute.jsx) on the client side, and endpoints security configuration on the server side.

---

## 📑 API Reference Documentation

Once the server is running, you can explore, test, and execute REST requests interactively via Swagger UI:

* **Interactive Swagger UI**: [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)
* **Raw OpenAPI JSON Spec**: [http://localhost:8080/v3/api-docs](http://localhost:8080/v3/api-docs)

---

## 🧩 Architectural Code Structure

```directory
backend/src/main/java/com/internship/management/
│
├── config/             # Configuration beans (CORS config, PasswordEncoder, Seeder)
├── controller/         # REST Controllers representing HTTP endpoints
├── dto/                # Data Transfer Objects for JSON request/response payloads
├── entity/             # MongoDB model collections (User, Intern, Project, Task, etc.)
├── enums/              # Enumerated types (Role, TaskStatus, InternStatus, LeaveStatus)
├── exception/          # Global exception handler & custom API error entities
├── repository/         # Spring Data MongoDB query interface layer
├── response/           # Customized structured response models
├── security/           # JWT tokens providers, entry points, filters, and user context
└── service/            # Core business log services interface and implementations
```

### Endpoints Group Overview

* 🔐 **Auth (`/api/auth`)**: User signup, login, password recovery, and token validation.
* 👥 **Interns (`/api/interns`)**: Admin access to create, update, delete, search, or view intern profiles.
* 📁 **Projects (`/api/projects`)**: CRUD for project groups, and assigning interns to development tracks.
* 📋 **Tasks (`/api/tasks`)**: Create tasks, define deadlines, and assign assignments.
* 📤 **Submissions (`/api/submissions`)**: Submit task links/repos, grade, review, and evaluate completed work.
* 📝 **Daily Logs (`/api/logs`)**: Record daily progress logs and track performance metrics.
* 📊 **Dashboard (`/api/dashboard`)**: Retrieve key system metrics, count statistics, and analytic records.
