import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { userDetails,logout } from "../store/slices/userSlices";
import axios from "axios";


export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const currentUser = useSelector(
    (state) => state.userDetails?.currentUser
  );

  const handleLogout = () => {
    delete axios.defaults.headers.common.Authorization;
    dispatch(logout()); // must exist in your slice
    navigate("/");
  };

  return (
    <nav className="w-full bg-white shadow-md px-6 py-3 flex items-center justify-between sticky top-0 z-50">
      
      {/* LEFT */}
      <div
        className="flex items-center gap-2 cursor-pointer"
        onClick={() => navigate("/home")}
      >
        <div className="w-8 h-8 bg-black text-white flex items-center justify-center rounded">
          A
        </div>
        <h1 className="text-lg font-semibold">Admin Panel</h1>
      </div>

      {/* CENTER */}
      <div className="flex items-center gap-6">
        <button
          onClick={() => navigate("/home")}
          className={`text-sm font-medium ${
            location.pathname === "/home" ? "text-black" : "text-gray-500"
          }`}
        >
          Courses
        </button>

        <button
          onClick={() => navigate("/offers")}
          className={`text-sm font-medium ${
            location.pathname.startsWith("/offers")
              ? "text-black"
              : "text-gray-500"
          }`}
        >
          Offers
        </button>

        <button
          onClick={() => navigate("/student-list")}
          className={`text-sm font-medium ${
            location.pathname === "/student-list"
              ? "text-black"
              : "text-gray-500"
          }`}
        >
          Student List
        </button>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-4">
        <span className="text-xs bg-gray-200 px-3 py-1 rounded-full">
          Admin
        </span>

        {currentUser && (
          <button
            onClick={handleLogout}
            className="bg-black text-white px-4 py-1.5 rounded hover:opacity-80"
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}
