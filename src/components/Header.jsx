// src/components/Header.tsx
import React from "react";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="bg-blue-600 text-white p-4 shadow-md">
      <nav className="container mx-auto flex justify-between items-center">
        <h1 className="font-bold text-xl"><Link to={'/'}>Supplier Management</Link></h1>
        <ul className="flex space-x-6">
          <li>
            <Link
              to="/suppliers"
              className="hover:text-gray-200 transition"
            >
              Supplier Table
            </Link>
          </li>
          <li>
            <Link
              to="/supplier-form"
              className="hover:text-gray-200 transition"
            >
              Supplier Form
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
