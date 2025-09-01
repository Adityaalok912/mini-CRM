import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../features/auth/authSlice";
import { Menu, X } from "lucide-react"; // ✅ lightweight icons

const Navbar = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
  };

  if (!user) return null;

  const navLinks = (
    <>
      <Link
        to="/dashboard"
        className="block px-3 py-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100"
        onClick={() => setIsOpen(false)}
      >
        Dashboard
      </Link>
      <Link
        to="/leads"
        className="block px-3 py-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100"
        onClick={() => setIsOpen(false)}
      >
        Leads
      </Link>
      <Link
        to="/customers"
        className="block px-3 py-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100"
        onClick={() => setIsOpen(false)}
      >
        Customers
      </Link>
      <Link
        to="/tasks"
        className="block px-3 py-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100"
        onClick={() => setIsOpen(false)}
      >
        Tasks
      </Link>
      {user?.role === "admin" && (
        <Link
          to="/register"
          className="block px-3 py-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100"
          onClick={() => setIsOpen(false)}
        >
          Register
        </Link>
      )}
    </>
  );

  return (
    <header className="bg-white shadow-sm sticky top-0 z-10">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="flex items-center">
            <span className="text-2xl font-extrabold text-blue-600 mr-8">
              CRM
            </span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex md:space-x-6">{navLinks}</div>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-gray-700 hidden sm:block">
              Welcome, {user.name}
            </span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 text-white rounded-lg shadow-sm hover:bg-red-600 transition-colors text-sm"
            >
              Logout
            </button>

            {/* Mobile Hamburger */}
            <button
              className="md:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden bg-white border-t border-gray-200 pb-3 space-y-1">
            {navLinks}
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
