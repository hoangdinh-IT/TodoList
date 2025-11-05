import { useState } from "react";
import { motion } from "framer-motion";
import { useSnackbar } from "../providers/SnackbarProvider";
import assets from "../assets/assets";
import Spinner from "../components/Spinner";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [activeStep, setActiveStep] = useState(1); // 1=Email, 2=OTP, 3=Password
  const [loadingStep, setLoadingStep] = useState(0); // Spinner cho từng bước
  const { showSnackbar } = useSnackbar();

  const handleEmailConfirm = () => {
    if (!email.trim()) return showSnackbar("Vui lòng nhập email!", "warning");

    setLoadingStep(1);
    setTimeout(() => {
      setLoadingStep(0);
      setActiveStep(2); // chuyển sang OTP
      showSnackbar("Email xác nhận thành công! Vui lòng nhập mã OTP", "success");
    }, 1000);
  };

  const handleOtpConfirm = () => {
    if (!otp.trim()) return showSnackbar("Vui lòng nhập OTP!", "warning");

    setLoadingStep(2);
    setTimeout(() => {
      setLoadingStep(0);
      setActiveStep(3); // chuyển sang mật khẩu
      showSnackbar("OTP xác nhận thành công! Vui lòng nhập mật khẩu mới", "success");
    }, 1000);
  };

  const handlePasswordConfirm = () => {
    if (!newPassword.trim())
      return showSnackbar("Vui lòng nhập mật khẩu mới!", "warning");

    setLoadingStep(3);
    setTimeout(() => {
      setLoadingStep(0);
      showSnackbar("Đặt lại mật khẩu thành công!", "success");
      // Reset form
      setActiveStep(1);
      setEmail("");
      setOtp("");
      setNewPassword("");
    }, 1000);
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
        <div className="flex items-center gap-2">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={activeStep !== 1}
            className={`flex-1 px-4 py-2 rounded-lg border border-white/30 focus:outline-none focus:ring-2 placeholder-gray-300 ${
              activeStep === 1
                ? "bg-white/20 text-white focus:ring-pink-400"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            } transition`}
          />
          <button
            onClick={handleEmailConfirm}
            disabled={activeStep !== 1}
            className={`px-3 py-2 rounded-lg font-semibold text-white ${
              activeStep === 1
                ? "bg-green-500 hover:bg-green-600"
                : "bg-gray-400 cursor-not-allowed"
            } transition flex items-center justify-center`}
          >
            {loadingStep === 1 ? <Spinner /> : "Xác nhận"}
          </button>
        </div>

        {/* OTP */}
        <div className="flex items-center gap-2">
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
            onClick={handleOtpConfirm}
            disabled={activeStep !== 2}
            className={`px-3 py-2 rounded-lg font-semibold text-white ${
              activeStep === 2
                ? "bg-green-500 hover:bg-green-600"
                : "bg-gray-400 cursor-not-allowed"
            } transition flex items-center justify-center`}
          >
            {loadingStep === 2 ? <Spinner /> : "Xác nhận"}
          </button>
        </div>

        {/* Mật khẩu */}
        <div className="flex items-center gap-2">
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
            onClick={handlePasswordConfirm}
            disabled={activeStep !== 3}
            className={`px-3 py-2 rounded-lg font-semibold text-white ${
              activeStep === 3
                ? "bg-green-500 hover:bg-green-600"
                : "bg-gray-400 cursor-not-allowed"
            } transition flex items-center justify-center`}
          >
            {loadingStep === 3 ? <Spinner /> : "Xác nhận"}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
