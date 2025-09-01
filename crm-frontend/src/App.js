import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
} from "react-router-dom";
import { Provider, useSelector, useDispatch } from "react-redux";
import { store } from "./store/store";
import { logout } from "./features/auth/authSlice";
import Navbar from "./components/Navbar";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import LeadsPage from "./features/leads/LeadsPage";
import LeadDetailPage from "./features/leads/LeadDetailPage";
import CustomersPage from "./features/customers/CustomersPage";
import CustomerDetailPage from "./features/customers/CustomerDetailPage";
import TasksPage from "./features/tasks/TasksPage";
import RegisterPage from "./pages/RegisterPage";
import AdminRoute from "./components/AdminRoute";
import UserManagementPage from "./features/user/UserManagementPage";
import UserDetailPage from "./features/user/UserDetailPage";

// A protected route component that redirects unauthenticated users
const ProtectedRoute = ({ children }) => {
  const { user } = useSelector((state) => state.auth);
  return user ? children : <Navigate to="/login" />;
};

const App = () => {
  return (
    <Provider store={store}>
      <Router>
        <div className="min-h-screen bg-gray-100 font-sans text-gray-900 flex flex-col">
          <Navbar />
          <main className="flex-grow max-w-7xl mx-auto w-full">
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/leads"
                element={
                  <ProtectedRoute>
                    <LeadsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/leads/:id"
                element={
                  <ProtectedRoute>
                    <LeadDetailPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/customers"
                element={
                  <ProtectedRoute>
                    <CustomersPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/customers/:id"
                element={
                  <ProtectedRoute>
                    <CustomerDetailPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/tasks"
                element={
                  <ProtectedRoute>
                    <TasksPage />
                  </ProtectedRoute>
                }
              />
              <Route path="/" element={<Navigate to="/dashboard" />} />
              <Route
                path="/register"
                element={
                  <AdminRoute>
                    <RegisterPage />
                  </AdminRoute>
                }
              />

              <Route
                path="/users"
                element={
                  <AdminRoute>
                    <UserManagementPage />
                  </AdminRoute>
                }
              />

              <Route
                path="/users/:id"
                element={
                  <AdminRoute>
                    <UserDetailPage />
                  </AdminRoute>
                }
              />
            </Routes>
          </main>
        </div>
      </Router>
    </Provider>
  );
};

export default App;
