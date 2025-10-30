import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { IoIosPerson, IoIosLock, IoIosEye, IoIosEyeOff } from "react-icons/io";
import { IoHome } from "react-icons/io5";

import { authAPI } from "../services/api";
import { useSnackbar } from "../providers/SnackbarProvider";
import { useAuth } from "../context/AuthContext";
import Spinner from "../components/Spinner";
import assets from "../assets/assets";
import useTitle from "../hooks/useTitle";

const Login = () => {
  useTitle("Đăng nhập | TodoList");

  const [username, setUsername] = useState("hoangdinh.040104@gmail.com");
  const [password, setPassword] = useState("123456");
  const [showPassword, setShowPassword] = useState(false);

  const { showSnackbar } = useSnackbar();
  const { login } = useAuth();
  const navigate = useNavigate();

  const loginMutation = useMutation({
    mutationFn: authAPI.login,
    onSuccess: (data) => {
      login(data.username, data.token);
      showSnackbar("Đăng nhập thành công!", "success");
      navigate("/dashboard");
    },
    onError: (err) => {
      showSnackbar(err.response?.data?.message || "Đăng nhập thất bại!", "error");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      showSnackbar("Vui lòng nhập đầy đủ thông tin!", "warning");
      return;
    }
    loginMutation.mutate({ username, password });
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-center items-center overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-indigo-800 via-purple-700 to-pink-600"
        style={{
          backgroundImage: `url(${assets.bg_01 ||
            "https://images.unsplash.com/photo-1496307042754-b4aa456c4a2d?auto=format&fit=crop&w=1920&q=80"})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      ></div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>

      {/* Card */}
      <div className="relative z-10 w-[90%] max-w-md bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-2xl p-8">
        
        {/* 🔹 Home button inside card */}
        <Link
          to="/"
          className="absolute top-4 left-4 text-white bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-full p-2 shadow-lg transition-all"
          title="Trang chủ"
        >
          <IoHome className="text-2xl" />
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

        <h2 className="text-3xl font-extrabold text-center text-white tracking-wide mb-6">
          ĐĂNG NHẬP
        </h2>

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

          {/* Button */}
          <button
            type="submit"
            disabled={loginMutation.isLoading}
            className="w-full bg-gradient-to-r from-pink-500 to-indigo-500 hover:from-pink-600 hover:to-indigo-600 text-white font-semibold py-2.5 rounded-lg shadow-lg flex justify-center items-center transition-all duration-200"
          >
            {loginMutation.isLoading ? <Spinner /> : "ĐĂNG NHẬP"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-200 mt-6">
          Bạn chưa có tài khoản?{" "}
          <Link
            to="/register"
            className="text-pink-300 hover:text-white font-semibold transition-all"
          >
            Đăng ký
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;