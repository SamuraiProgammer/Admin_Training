import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { logout } from "../store/slices/userSlices";
import axios from "axios";
import { useEffect, useRef, useState } from "react";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const menuRef = useRef(null); // Reference for the mobile menu
  const buttonRef = useRef(null); // Reference for the hamburger menu button

  const currentUser = useSelector((state) => state.userDetails?.currentUser);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    delete axios.defaults.headers.common.Authorization;
    dispatch(logout());
    navigate("/");
  };

  // Close menu if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target) && !buttonRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
    <nav className="w-full bg-yellow-500 shadow-md px-6 py-3 flex items-center justify-between sticky top-0 z-50">
      {/* LEFT */}
      <div
        className="flex items-center gap-2 cursor-pointer"
        onClick={() => navigate("/home")}
      >
        <div className="w-10 h-10 bg-black text-white flex items-center justify-center rounded-full text-lg font-bold">
          A
        </div>
        <h1 className="text-lg font-semibold text-white">Admin Panel</h1>
      </div>

      {/* CENTER (Desktop) */}
      <div className="hidden md:flex items-center gap-6">
        <button
          onClick={() => navigate("/home")}
          className={`text-sm cursor-pointer font-medium text-white ${
            location.pathname === "/home" ? "text-black" : "text-gray-900"
          } transition-all duration-300`}
        >
          Courses
        </button>

        <button
          onClick={() => navigate("/offers")}
          className={`text-sm cursor-pointer font-medium text-white ${
            location.pathname.startsWith("/offers")
              ? "text-black"
              : "text-gray-900"
          } transition-all duration-300`}
        >
          Offers
        </button>

        <button
          onClick={() => navigate("/student-list")}
          className={`text-sm cursor-pointer font-medium text-white ${
            location.pathname === "/student-list"
              ? "text-black"
              : "text-gray-900"
          } transition-all duration-300`}
        >
          Student List
        </button>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-4 max-md:hidden">
        <span className="text-xs bg-gray-200 text-yellow-700 px-3 py-1 rounded-full">
          Admin
        </span>

        {currentUser && (
          <button
            onClick={handleLogout}
            className="bg-black text-white px-4 py-1.5 rounded-lg hover:bg-yellow-600 transition-all duration-300"
          >
            Logout
          </button>
        )}
      </div>

      {/* Mobile Menu */}
      <div className="md:hidden flex items-center">
        <button
          ref={buttonRef} // Attach ref to the hamburger menu button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="text-white cursor-pointer p-2 rounded-md focus:outline-none"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>
    </nav>

    {/* Mobile Menu Dropdown */}
    {isMenuOpen && (
      <div ref={menuRef} className="md:hidden absolute top-16 left-0 w-full bg-yellow-500 shadow-md py-3 flex flex-col items-center gap-4">
        <button
          onClick={() => navigate("/home")}
          className={`text-sm cursor-pointer font-medium text-white ${
            location.pathname === "/home" ? "text-black" : "text-gray-900"
          }`}
        >
          Courses
        </button>

        <button
          onClick={() => navigate("/offers")}
          className={`text-sm cursor-pointer font-medium text-white ${
            location.pathname.startsWith("/offers")
              ? "text-black"
              : "text-gray-900"
          }`}
        >
          Offers
        </button>

        <button
          onClick={() => navigate("/student-list")}
          className={`text-sm cursor-pointer font-medium text-white ${
            location.pathname === "/student-list"
              ? "text-black"
              : "text-gray-900"
          }`}
        >
          Student List
        </button>

        {currentUser && (
          <button
            onClick={handleLogout}
            className="bg-black cursor-pointer text-white px-4 py-2 rounded-lg mt-4 hover:bg-yellow-600 transition-all duration-300"
          >
            Logout
          </button>
        )}
      </div>
    )}
    </>
  );
}