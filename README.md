Payroll Frontend (Vite + React)
===============================

This is a starter frontend for the Payroll Management System.

How to run:
1. Ensure the backend is running at http://localhost:8080
2. Install dependencies:
   npm install
3. Run the dev server:
   npm run dev
4. Open http://localhost:3000

What is implemented:
- Login page that authenticates against /api/v1/auth/login and stores JWT.
- Auth context with role-based routing to Admin (/admin) and Employee (/employee) dashboards.
- Axios instance pre-configured to attach JWT to requests.
- Basic dashboard placeholders for Admin and Employee.

Next steps I can implement:
- Employee CRUD screens (Admin)
- Departments & Jobs management
- Payroll Runs UI (create/process/lock)
- Leave request flow (apply/approve)
- Salary slip viewer & exports (PDF/CSV)
