import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoClose } from "react-icons/io5";
import { useSnackbar } from "../providers/SnackbarProvider";

const ChangePasswordModal = ({ onSubmit, onClose }) => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const { showSnackbar } = useSnackbar();

  const handleSubmit = () => {
    if (newPassword.length < 6 || confirmPassword.length < 6) {
      showSnackbar("Mật khẩu phải có ít nhất 6 ký tự!", "error");
      return;
    }

    if (newPassword !== confirmPassword) {
      showSnackbar("Mật khẩu mới và xác nhận mật khẩu mới không khớp!", "error");
      return;
    }

    if (!oldPassword.trim() || !newPassword.trim() || !confirmPassword.trim()) {
      showSnackbar("Vui lòng nhập đầy đủ thông tin!", "warning");
      return;
    }

    onSubmit({ oldPassword, newPassword });
    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/40 flex justify-center items-center z-[999] backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-white rounded-3xl shadow-xl w-96 max-h-[80vh] overflow-y-auto p-6 relative border border-gray-100"
          initial={{ scale: 0.95, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 30 }}
          transition={{ type: "spring", stiffness: 120, damping: 15 }}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition"
          >
            <IoClose size={24} />
          </button>

          <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
            Thay đổi mật khẩu
          </h2>

          {/* Wrap inputs in a form */}
          <form
            className="flex flex-col gap-4"
            onSubmit={(e) => {
              e.preventDefault(); // tránh reload page
              handleSubmit();
            }}
          >
            <div className="flex flex-col">
              <label className="text-gray-600 mb-1">Mật khẩu cũ</label>
              <input
                type="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                placeholder="Nhập mật khẩu cũ"
                className="border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-gray-600 mb-1">Mật khẩu mới</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Nhập mật khẩu mới"
                className="border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-gray-600 mb-1">Xác nhận mật khẩu mới</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Nhập lại mật khẩu mới"
                className="border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              />
            </div>

            <button
              type="submit" // nút submit form
              className="mt-2 bg-blue-600 text-white font-medium px-4 py-2 rounded-xl shadow hover:bg-blue-700 transition"
            >
              Cập nhật mật khẩu
            </button>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ChangePasswordModal;
