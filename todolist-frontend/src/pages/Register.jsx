import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { IoIosPerson, IoIosLock, IoIosEye, IoIosEyeOff } from "react-icons/io";
import { IoHome } from "react-icons/io5";
import { motion } from "framer-motion";

import { authAPI } from "../services/api";
import { useSnackbar } from "../providers/SnackbarProvider";
import Spinner from "../components/Spinner";
import assets from "../assets/assets";
import useTitle from "../hooks/useTitle";
import PageWrapper from "../components/PageWrapper";

const Register = () => {
  useTitle("Đăng ký | TodoList");

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { showSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const register = useMutation({
    mutationFn: authAPI.register,
    onSuccess: () => {
      showSnackbar("Đăng ký tài khoản thành công!", "success");
      navigate("/login");
    },
    onError: (err) => {
      showSnackbar(err?.response?.data?.message || "Đăng ký thất bại!", "error");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!username.trim() || !password.trim()) {
      showSnackbar("Vui lòng nhập đầy đủ thông tin!", "warning");
      return;
    }

    if (password.length < 6) {
      showSnackbar("Mật khẩu phải có ít nhất 6 ký tự!", "error");
      return;
    }

    if (password !== confirmPassword) {
      showSnackbar("Mật khẩu xác nhận không khớp!", "error");
      return;
    }

    register.mutate({ username, password });
  };

  return (
    <PageWrapper>
      <div className="relative min-h-screen flex flex-col justify-center items-center overflow-hidden">
        {/* Background */}
        <div
          className="absolute inset-0 bg-gradient-to-br from-indigo-800 via-purple-700 to-pink-600"
          style={{
            backgroundImage: `url(${
              assets.bg_01 ||
              "https://images.unsplash.com/photo-1496307042754-b4aa456c4a2d?auto=format&fit=crop&w=1920&q=80"
            })`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        ></div>

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>

        {/* Card */}
        <div className="relative z-10 w-[90%] max-w-md bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-2xl p-8">

          {/* 🔹 Nút Home trong form */}
          <Link
            to="/"
            className="absolute top-4 left-4 text-white bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-full p-2 shadow-lg transition-all group"
            title="Trang chủ"
          >
            <IoHome className="text-xl" />
            {/* Tooltip hiển thị khi hover */}
            <span className="absolute left-12 top-1/2 -translate-y-1/2 bg-black/70 text-white text-xs px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              Trang chủ
            </span>
          </Link>

          {/* Logo */}
          <div className="flex justify-center mb-6">
            <div className="p-3 bg-white/30 backdrop-blur-md rounded-full shadow-lg">
              <img
                src={assets.logo}
                alt="Logo"
                className="h-20 w-20 object-contain drop-shadow-lg"
              />
            </div>
          </div>

          {/* Title */}
          <h2 className="text-3xl font-extrabold text-center text-white tracking-wide mb-6">
            ĐĂNG KÝ
          </h2>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username */}
            <div className="relative">
              <IoIosPerson className="absolute left-3 top-3.5 text-gray-300 text-xl" />
              <input
                type="text"
                placeholder="Email"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-white/20 border border-white/30 rounded-lg pl-10 pr-3 py-2.5 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all"
              />
            </div>

            {/* Password */}
            <div className="relative">
              <IoIosLock className="absolute left-3 top-3.5 text-gray-300 text-xl" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Mật khẩu"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/20 border border-white/30 rounded-lg pl-10 pr-10 py-2.5 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all"
              />
              <div
                className="absolute right-3 top-3.5 text-gray-300 cursor-pointer hover:text-pink-400 transition-colors"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <IoIosEyeOff /> : <IoIosEye />}
              </div>
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <IoIosLock className="absolute left-3 top-3.5 text-gray-300 text-xl" />
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Xác nhận mật khẩu"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-white/20 border border-white/30 rounded-lg pl-10 pr-10 py-2.5 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all"
              />
              <div
                className="absolute right-3 top-3.5 text-gray-300 cursor-pointer hover:text-pink-400 transition-colors"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <IoIosEyeOff /> : <IoIosEye />}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={register.isLoading}
              className="w-full bg-gradient-to-r from-pink-500 to-indigo-500 hover:from-pink-600 hover:to-indigo-600 text-white font-semibold py-2.5 rounded-lg shadow-lg flex justify-center items-center transition-all duration-200"
            >
              {register.isLoading ? <Spinner /> : "ĐĂNG KÝ"}
            </button>
          </form>

          {/* Link to login */}
          <p className="text-center text-sm text-gray-200 mt-6">
            Bạn đã có tài khoản?{" "}
            <Link
              to="/login"
              className="text-pink-300 hover:text-white font-semibold transition-all"
            >
              Đăng nhập
            </Link>
          </p>
        </div>
      </div>
    </PageWrapper>
  );
};

export default Register;
