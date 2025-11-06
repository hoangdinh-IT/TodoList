import { useState } from "react";
import { motion } from "framer-motion";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import { useSnackbar } from "../providers/SnackbarProvider";
import assets from "../assets/assets";
import Spinner from "../components/Spinner";
import { authAPI } from "../services/api";

const ForgotPassword = () => {
  const [username, setUsername] = useState("");
  const [otp, setOtp] = useState("");
  const [otpAttempts, setOtpAttempts] = useState(0);
  const [newPassword, setNewPassword] = useState("");
  const [activeStep, setActiveStep] = useState(1); // 1=Username, 2=OTP, 3=Password
  const [loadingStep, setLoadingStep] = useState(0); // Spinner cho từng bước

  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();

  const sendOtp = useMutation({
    mutationFn: (username) => authAPI.sendOtp(username),
    onSuccess: () => {
      setLoadingStep(1);
      setTimeout(() => {
        setLoadingStep(0);
        setActiveStep(2);
        showSnackbar("Email xác nhận thành công! Vui lòng nhập mã OTP", "success");
      }, 1000);
    },
    onError: (err) => {
      showSnackbar(err?.response?.data?.message || "Email xác nhận thất bại!", "error");
    }
  });

  const handleEmailConfirm = () => {
    if (!username.trim()) return showSnackbar("Vui lòng nhập email!", "warning");

    sendOtp.mutate(username);
  };

  const verityOtp = useMutation({
    mutationFn: ({ username, otp }) => authAPI.verifyOtp({ username, otp }),
    onSuccess: () => {
      setLoadingStep(2);
      setTimeout(() => {
        setLoadingStep(0);
        setActiveStep(3); // chuyển sang mật khẩu
        showSnackbar("OTP xác nhận thành công! Vui lòng nhập mật khẩu mới", "success");
      }, 1000);
    },
    onError: () => {
      const attempts = otpAttempts + 1;
      setOtpAttempts(attempts);

      if (attempts >= 3) {
        showSnackbar("Bạn đã nhập OTP quá 3 lần! Vui lòng đăng nhập lại.", "error");
        // reset form
        setUsername("");
        setOtp("");
        setActiveStep(1);
        setOtpAttempts(0);
        navigate("/login");
      } else {
        showSnackbar(`OTP không đúng! Bạn còn ${3 - attempts} lần thử`, "warning");
      }
    }
  })

  const handleOtpConfirm = () => {
    if (!otp.trim()) return showSnackbar("Vui lòng nhập OTP!", "warning");

    verityOtp.mutate({ username, otp });
  };

  const resetPassword = useMutation({
    mutationFn: ({ username, otp, newPassword }) => authAPI.resetPassword({ username, otp, newPassword }),
    onSuccess: () => {
      setLoadingStep(3);
      setTimeout(() => {
        setLoadingStep(0);
        showSnackbar("Đặt lại mật khẩu thành công! Vui lòng đăng nhập lại!", "success");
        setActiveStep(1);
        setUsername("");
        setOtp("");
        setNewPassword("");
        navigate("/login");
      }, 1000);
    },
    onError: (err) => {
      showSnackbar(err?.response?.data?.message || "Đặt lại mật khẩu thất bại!", "error");
    }
  })

  const handlePasswordConfirm = () => {
    if (!newPassword.trim())
      return showSnackbar("Vui lòng nhập mật khẩu mới!", "warning");

    resetPassword.mutate({ username, otp, newPassword });
  };

  return (
    <div className="relative min-h-screen flex justify-center items-center px-4 sm:px-6 py-6 overflow-auto">
      {/* Background */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-indigo-800 via-purple-700 to-pink-600"
        style={{
          backgroundImage: `url(${assets.bg_forgotpassword ||
            "https://images.unsplash.com/photo-1496307042754-b4aa456c4a2d?auto=format&fit=crop&w=1920&q=80"})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      ></div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>

      {/* Card */}
      <motion.div
        className="relative z-10 w-full max-w-md bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-2xl p-6 sm:p-8 space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
      >
        <h2 className="text-2xl sm:text-3xl font-extrabold text-center text-white tracking-wide mb-6">
          Quên mật khẩu
        </h2>

        {/* Email */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (activeStep === 1) handleEmailConfirm();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="email"
            placeholder="Email"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={activeStep !== 1}
            className={`flex-1 px-4 py-2 rounded-lg border border-white/30 focus:outline-none focus:ring-2 placeholder-gray-300 ${
              activeStep === 1
                ? "bg-white/20 text-white focus:ring-pink-400"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            } transition`}
          />
          <button
            type="submit"
            disabled={activeStep !== 1}
            className={`px-3 py-2 rounded-lg font-semibold text-white ${
              activeStep === 1
                ? "bg-green-500 hover:bg-green-600"
                : "bg-gray-400 cursor-not-allowed"
            } transition flex items-center justify-center`}
          >
            {loadingStep === 1 ? <Spinner /> : "Xác nhận"}
          </button>
        </form>

        {/* OTP */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (activeStep === 2) handleOtpConfirm();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            placeholder="OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            disabled={activeStep !== 2}
            className={`flex-1 px-4 py-2 rounded-lg border border-white/30 focus:outline-none focus:ring-2 ${
              activeStep === 2
                ? "bg-white/20 text-white focus:ring-pink-400"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            } transition`}
          />
          <button
            type="submit"
            disabled={activeStep !== 2}
            className={`px-3 py-2 rounded-lg font-semibold text-white ${
              activeStep === 2
                ? "bg-green-500 hover:bg-green-600"
                : "bg-gray-400 cursor-not-allowed"
            } transition flex items-center justify-center`}
          >
            {loadingStep === 2 ? <Spinner /> : "Xác nhận"}
          </button>
        </form>

        {/* Password */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (activeStep === 3) handlePasswordConfirm();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="password"
            placeholder="Mật khẩu mới"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            disabled={activeStep !== 3}
            className={`flex-1 px-4 py-2 rounded-lg border border-white/30 focus:outline-none focus:ring-2 ${
              activeStep === 3
                ? "bg-white/20 text-white focus:ring-pink-400"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            } transition`}
          />
          <button
            type="submit"
            disabled={activeStep !== 3}
            className={`px-3 py-2 rounded-lg font-semibold text-white ${
              activeStep === 3
                ? "bg-green-500 hover:bg-green-600"
                : "bg-gray-400 cursor-not-allowed"
            } transition flex items-center justify-center`}
          >
            {loadingStep === 3 ? <Spinner /> : "Xác nhận"}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
