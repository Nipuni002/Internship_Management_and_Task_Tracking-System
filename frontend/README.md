# 🎨 Frontend - Internship Management System Dashboard

This is the user interface for the **Internship Management and Task Tracking System**. It is a modern Single Page Application (SPA) built using **React 19**, **Vite**, and **Tailwind CSS v4**.

---

## 🛠️ Tech Stack & Requirements

* **Framework**: React 19 (JavaScript)
* **Build Tool**: Vite (extremely fast development & HMR)
* **Styling**: Tailwind CSS v4.3.3 (utility-first, responsive layouts)
* **Routing**: React Router DOM v7 (declarative client routing with lazy-loaded code splitting)
* **Charts**: Recharts (fully responsive analytics and statistics)
* **Notifications**: React Hot Toast (toast alerts for success/error prompts)
* **HTTP Client**: Axios (configured with token interceptors)
* **Forms**: React Hook Form (optimized form validation)

---

## 🚀 Getting Started & Installation

### 1. Prerequisites
Ensure you have **Node.js** (version 18 or higher) and **npm** installed:
```bash
node --version
npm --version
```

### 2. Environment Variables Configuration
The application communicates with the backend REST API via the base URL configured in:
* **Development**: [frontend/.env.development](file:///c:/Users/ASUS/OneDrive/Documents/GitHub/Internship_Management_and_Task_Tracking-System/frontend/.env.development)
  ```env
  VITE_API_BASE_URL=http://localhost:8080
  ```
* **Production**: [frontend/.env.production](file:///c:/Users/ASUS/OneDrive/Documents/GitHub/Internship_Management_and_Task_Tracking-System/frontend/.env.production)
  ```env
  VITE_API_BASE_URL=https://api.internship-management.com
  ```

### 3. Installation & Run
From the `frontend` folder, execute:

1. **Install all packages**:
   ```bash
   npm install
   ```
2. **Start the local hot-reloading development server**:
   ```bash
   npm run dev
   ```
   *Open your browser and navigate to **http://localhost:5173***.

3. **Build the production bundle**:
   ```bash
   npm run build
   ```
4. **Preview the production build locally**:
   ```bash
   npm run preview
   ```

---

## 📂 Code Directory Structure

```directory
frontend/src/
│
├── api/          # Axios instances, request & response interceptors
├── assets/       # Static assets (images, svg icons, logos)
├── components/   # Shared reusable UI elements (Loaders, ErrorBoundary, Tables)
├── contexts/     # Application Context providers (AuthContext, ThemeContext, NotificationContext)
├── hooks/        # Custom React hooks (useAuth, useTheme, etc.)
├── layouts/      # Layout wrapper templates (AuthLayout, DashboardLayout with Sidebars)
├── pages/        # Main page view components
│   ├── admin/    # Admin views (dashboard, interns management, projects, evaluations, attendance, leave)
│   ├── intern/   # Intern views (dashboard, tasks, daily logs, submissions, leave applications)
│   └── auth/     # Authentication pages (login, registration, password recovery)
├── routes/       # React Router setup, protected routes, and role guards
├── services/     # API request wrapper logic (authService, taskService, logService)
├── styles/       # Styling declarations & global CSS variables
├── utils/        # General JavaScript helper utils (date formats, helper utilities)
├── App.jsx       # Root component wrapping all providers and RouterProvider
└── main.jsx      # Vite bundler client-side entry point
```

---

## 🔒 Security & Client-Side Routing

Routing is managed via React Router in [frontend/src/routes/index.jsx](file:///c:/Users/ASUS/OneDrive/Documents/GitHub/Internship_Management_and_Task_Tracking-System/frontend/src/routes/index.jsx) and features two security barriers:
1. **`ProtectedRoute`**: Verifies if the user is authenticated (valid JWT stored in localStorage). If not, redirects to `/login`.
2. **`RoleProtectedRoute`**: Restricts view components to allowed roles (e.g. `ROLE_ADMIN` vs `ROLE_INTERN`). Unauthorized access is routed to `/access-denied`.

---

## 🎨 Theme & Styling System

* **Tailwind CSS v4**: Built with `@tailwindcss/vite` compiler plugin, removing the need for a separate `tailwind.config.js` file. Theme details are configured via CSS variables.
* **Themes**: Supports **Light Mode** and **Sleek Dark Mode**. The selected state is persisted in local storage and managed via `ThemeContext`.
* **Animations**: Features micro-animations, loading spinners, hover gradients, and responsive layouts designed for mobile, tablet, and desktop viewports.
