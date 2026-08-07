# 🎓 Internship Management and Task Tracking System

Welcome to the **Internship Management and Task Tracking System**, a premium, production-ready web application designed to streamline the internship lifecycle. It enables administrators to manage interns, assignments, tasks, and reviews, while interns can track their daily logs, attendance, leaves, projects, task progress, and evaluations in real time.

---

## 🏗️ Architecture Overview

The system is built as a split monorepo comprising a modern **React SPA frontend** and a robust **Spring Boot backend REST API** backed by **MongoDB**.

```mermaid
graph TD
    subgraph Client ["Client Tier (Frontend)"]
        A["React 19 SPA"] -->|HTTP / JSON| B["Axios API Client"]
        A -->|Styling| C["Tailwind CSS v4"]
        A -->|State / Context| D["Auth / Theme / Notification"]
    end

    subgraph Service ["Service Tier (Backend)"]
        E["Spring Boot REST Controller"] -->|JSON Mapper| F["Security & JWT Filter"]
        F -->|Business Logic| G["Services & DTOs"]
        G -->|Data Access| H["Spring Data MongoDB Repositories"]
    end

    subgraph Database ["Data Store"]
        I[("MongoDB Database (Atlas / Local)")]
    end

    B -->|REST API Calls (Port 8080)| E
    H -->|Query & Save| I
```

---

## 📁 Repository Structure

```directory
├── backend/                  # Spring Boot backend source files
│   ├── pom.xml               # Maven configuration & dependency manager
│   └── src/                  # Main and test source code
│       ├── main/
│       │   ├── java/         # Spring Boot controller, service, security & config files
│       │   └── resources/    # application.yml configuration
│       └── test/             # JUnit & Mockito tests
│
├── frontend/                 # Vite + React frontend source files
│   ├── package.json          # Node dependencies & package scripts
│   ├── vite.config.js        # Vite compiler & plugin config
│   ├── src/                  # React source codebase (components, hooks, pages, routes)
│   └── .env.development      # Local development environment configs
│
└── README.md                 # This root setup document
```

---

## 🛠️ Technology Stack

| Component | Technology | Description |
| :--- | :--- | :--- |
| **Frontend Core** | React 19, Vite, Javascript | High-performance client-side rendering with HMR. |
| **Frontend Styling** | Tailwind CSS v4.3.3 | Utility-first responsive modern design layouts. |
| **Routing** | React Router DOM v7 | Single-page application client routing with code-splitting. |
| **State & Context** | React Context API | Theme toggle (Dark/Light), Authentication context, Toast notifications. |
| **Charts** | Recharts | Visual charts for analytics dashboard view. |
| **Backend Core** | Java 17, Spring Boot 3.3.2 | Enterprise-grade Java framework for REST APIs. |
| **Security** | Spring Security 6 & JWT | Authentication & role-based route access controls. |
| **Database** | MongoDB, Spring Data MongoDB | Flexible schema-less document storage database. |
| **Validation & Docs** | Springdoc OpenAPI / Swagger | Interactive Swagger API endpoints listing. |

---

## 🚀 Quick Start Guide

Follow these steps to run both the backend and frontend services locally in development mode.

### Prerequisites
Make sure you have the following installed on your machine:
* **Java SDK 17**
* **Apache Maven 3.6+**
* **Node.js 18+** & **npm**
* **MongoDB** (Local instance or Cloud Atlas account)

---

### Step 1: Run the Backend Service

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Open [backend/src/main/resources/application.yml](file:///c:/Users/ASUS/OneDrive/Documents/GitHub/Internship_Management_and_Task_Tracking-System/backend/src/main/resources/application.yml) and verify or modify the MongoDB URI connection. By default, it connects to a remote sandbox cluster. For local MongoDB, set:
   ```yaml
   spring:
     data:
       mongodb:
         uri: mongodb://localhost:27017/InternshipTask_db
   ```
3. Run the Spring Boot application using Maven:
   ```bash
   mvn spring-boot:run
   ```
   *The backend server will run at **http://localhost:8080***.

---

### Step 2: Run the Frontend App

1. Open a new terminal window/tab and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install npm dependencies:
   ```bash
   npm install
   ```
3. Start the Vite local development server:
   ```bash
   npm run dev
   ```
   *The frontend dashboard will run at **http://localhost:5173***.

---

## 🔑 Default Login Credentials

Upon starting the backend, [DatabaseSeeder.java](file:///c:/Users/ASUS/OneDrive/Documents/GitHub/Internship_Management_and_Task_Tracking-System/backend/src/main/java/com/internship/management/config/DatabaseSeeder.java) automatically runs and seeds the database with the following default accounts for testing:

| Role | Username / Email | Password | Details |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@internship.com` | `Password123!` | Has access to create projects, tasks, review submissions, and manage interns. |
| **Intern** | `intern@internship.com` | `Password123!` | Has access to view assigned projects, submit daily logs, request leaves, and review feedback. |

---

## 📖 Component Manuals

For detailed configuration instructions and documentation specific to each service tier, review the child documentation files:
- 💻 **Backend Manual**: [backend/README.md](file:///c:/Users/ASUS/OneDrive/Documents/GitHub/Internship_Management_and_Task_Tracking-System/backend/README.md)
- 🎨 **Frontend Manual**: [frontend/README.md](file:///c:/Users/ASUS/OneDrive/Documents/GitHub/Internship_Management_and_Task_Tracking-System/frontend/README.md)