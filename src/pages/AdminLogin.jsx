import React, { useState } from "react";
import Login from "../assets/Logo.svg";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { API_URL } from "../constant/APIConstant";
import { useNavigate } from "react-router-dom";
import { userDetails } from "../store/slices/userSlices";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";

function AdminLogin() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const completeLogin = (user) => {
    axios.defaults.headers.common.Authorization = `Bearer ${user.token}`;
    dispatch(userDetails(user));
    setEmail("");
    setPassword("");
    console.log("Login successful, user data:", user);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setError("");

    try {
      const res = await axios.post(`${API_URL}/auth/login`, {
        email,
        password,
      });

      console.log("LOGIN RESPONSE:", res.data); // 🔥 debug

      if (res?.data?.success) {
        completeLogin(res.data.data);
        toast.success("Login successful!");
        navigate("/home");
      } else {
        toast.error(res?.data?.message || "Login Failed");
      }
    } catch (err) {
      console.log("LOGIN ERROR:", err);
      toast.error(err?.response?.data?.message || "Login Failed!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-6">
      <div className="w-full max-w-6xl flex bg-white rounded-3xl shadow-xl overflow-hidden">
        {/* LEFT: IMAGE */}
        <div className="w-1/2 hidden md:flex items-center justify-center bg-gray-50 p-10">
          <img
            src={Login}
            alt="Login Illustration"
            className="w-[80%] max-w-md"
          />
        </div>

        {/* RIGHT: FORM */}
        <div className="w-full md:w-1/2 p-10">
          <h2 className="text-3xl font-semibold text-gray-800 mb-2">
            Admin Login
          </h2>
          <p className="text-gray-500 mb-8">
            Manage students and courses efficiently
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* EMAIL */}
            <div>
              <label className="block text-sm font-medium mb-1">Username</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full h-12 px-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-black transition"
                required
              />
            </div>

            {/* PASSWORD */}
            <div className="relative">
              <label className="block text-sm font-medium mb-1">Password</label>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full h-12 px-4 border rounded-xl pr-12 focus:outline-none focus:ring-2 focus:ring-black transition"
                required
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-9 cursor-pointer text-gray-500"
              >
                {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
              </span>
            </div>

            {/* ERROR */}
            {error && <p className="text-red-500 text-sm">{error}</p>}

            {/* BUTTON */}
            <button
              type="submit"
              className="w-full h-12 bg-black text-white rounded-xl font-medium hover:bg-gray-800 transition"
            >
              Log in
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;
