CRM System (Customer Relationship Management)

This is a full-stack CRM application built with the MERN stack (MongoDB, Express, React, Node.js).
It provides lead management, customer management, tasks, user roles (Admin/Agent), authentication with access & refresh tokens, and dashboards for insights.

🚀 Features

Authentication & Authorization

JWT-based authentication

Access & Refresh tokens

Role-based access (Admin vs Agent)

User Management (Admin only)

List all users

Edit user details

Delete users

Role control (Admin / Agent)

Lead Management

CRUD operations for leads

Assign agents to leads

Convert leads into customers

Filter & search leads by status/name

Leads statistics (last 14 days)

Customer Management

Manage converted leads as customers

Customer details page

Task Management

Assign tasks to agents

Paginated task list

Overdue tasks on Dashboard

Dashboard

Lead statistics chart (last 14 days)

Customer/lead counts

Overdue tasks table

User-specific vs Admin overview

Activity Tracking

User actions stored and fetched via activityRoutes

📂 Project Structure
Backend (Node.js + Express + MongoDB)
backend/
│── controllers/        # Business logic for routes
│   ├── authController.js
│   ├── userController.js
│   ├── leadController.js
│   ├── taskController.js
│   ├── activityController.js
│
│── middleware/         # Custom middlewares
│   ├── authMiddleware.js  # Protect routes, role-based access
│
│── models/             # Mongoose models
│   ├── User.js
│   ├── Lead.js
│   ├── Customer.js
│   ├── Task.js
│
│── routes/             # Express routers
│   ├── authRoutes.js
│   ├── userRoutes.js
│   ├── leadRoutes.js        # CRUD + stats + convert lead :contentReference[oaicite:0]{index=0}
│   ├── taskRoutes.js
│   ├── activityRoutes.js    # Logs activities :contentReference[oaicite:1]{index=1}
│
│── server.js           # Entry point
│── config/             # DB & JWT config
│

Frontend (React + Redux Toolkit + TailwindCSS)
frontend/
│── src/
│   ├── store/
│   │   ├── store.js          # Redux store
│   │
│   ├── utils/
│   │   ├── api.js            # Axios instance with interceptors
│   │
│   ├── features/             # Redux slices + components for each entity
│   │   ├── auth/
│   │   │   ├── authSlice.js
│   │   │
│   │   ├── users/
│   │   │   ├── userSlice.js
│   │   │   ├── UserManagementPage.js
│   │   │   ├── UserDetailPage.js
│   │   │
│   │   ├── leads/
│   │   │   ├── leadsSlice.js
│   │   │   ├── LeadsPage.js
│   │   │   ├── LeadDetailPage.js
│   │   │   ├── LeadForm.js
│   │   │
│   │   ├── customers/
│   │   │   ├── customersSlice.js
│   │   │   ├── CustomersPage.js
│   │   │   ├── CustomerDetailPage.js
│   │   │
│   │   ├── tasks/
│   │   │   ├── tasksSlice.js
│   │   │   ├── TasksPage.js
│   │   │
│   │   ├── dashboard/
│   │   │   ├── DashboardPage.js
│   │
│   ├── components/
│   │   ├─ Navbar.js
|   |   ├─ .....
│   │
│   ├── App.js                # Main routes with ProtectedRoute
│   ├── index.js              # Entry point
│   ├──seed.js
│── public/
│   ├── index.html
│   ├── favicon.ico

⚙️ Installation & Setup
1️⃣ Clone repository
git clone https://github.com/Adityaalok912/mini-CRM.git
cd mini-CRM

2️⃣ Backend Setup
cd backend
npm install


Create a .env file:

PORT=5000
MONGO_URI=your_mongo_connection_string
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_jwt_refresh_secret


Run server:

npm run server

- to create dummy entries in the database -
  
npm run seed


3️⃣ Frontend Setup
cd frontend
npm install
npm run start

4️⃣ Open in browser
http://localhost:3000

🔐 Authentication Flow

On login, user receives accesstoken (short expiry) + refreshtoken (long expiry)

API calls use accesstoken

When expired, api.js interceptor uses refreshtoken to get a new accesstoken without logging out

If refresh fails → user is logged out

👨‍💻 Roles

Admin

Full access

Can manage users

See all leads/customers/tasks

Agent

Can only manage their assigned leads/customers/tasks

No access to user management
