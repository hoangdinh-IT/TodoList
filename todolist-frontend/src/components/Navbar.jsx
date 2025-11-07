import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { IoMenu, IoClose } from "react-icons/io5";
import { motion, AnimatePresence } from "framer-motion";
import { useMutation } from "@tanstack/react-query";

import assets from "../assets/assets";
import { useAuth } from "../contexts/AuthContext";
import { useDialog } from "../providers/DialogProvider";
import { useSnackbar } from "../providers/SnackbarProvider";
import CategoryManagementModal from "./CategoryManagementModal";
import StatisticModal from "./StatisticModal";
import ChangePasswordModal from "./ChangePasswordModal";
import { authAPI } from "../services/api";

const Navbar = ({ setIsSidebarOpen }) => {
  const { logout } = useAuth();
  const { showDialog } = useDialog();
  const { showSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const [isCategoryManagementModalOpen, setIsCategoryManagementModalOpen] = useState(false);
  const [isStatisticModalOpen, setIsStatisticModalOpen] = useState(false);
  const [isResetPasswordModalOpen, setIsResetPasswordModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const dropdownRef = useRef();

  const username = localStorage.getItem("user");

  const changePassword = useMutation({
    mutationFn: ({ username, oldPassword, newPassword }) => authAPI.changePassword({ username, oldPassword, newPassword }),
    onSuccess: () => {
      showSnackbar("Thay đổi mật khẩu thành công!", "success");
    },
    onError: (err) => {
      showSnackbar(err?.response?.data?.message || "Thay đổi mật khẩu thất bại!", "error");
    } 
  }) 

  const handleChangePassword = ({ username, oldPassword, newPassword }) => {
    changePassword.mutate({ username, oldPassword, newPassword });
  }

  const handleLogout = () => {
    showDialog({
      title: "XÁC NHẬN ĐĂNG XUẤT",
      message: "Bạn có chắc chắn muốn đăng xuất?",
      confirmText: "Đăng xuất",
      cancelText: "Hủy",
      confirmColor: "error",
      onConfirm: () => {
        logout();
        navigate("/", { replace: true });
      },
    });
  };

  // Close dropdown if click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      {/* Navbar */}
      <header className="flex justify-between items-center px-4 sm:px-8 py-3 bg-white/90 backdrop-blur-md shadow-md border-b border-gray-200 sticky top-0 z-50">
        {/* Sidebar toggle button (mobile) */}
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="md:hidden text-gray-700 p-2 rounded-md hover:bg-gray-200 transition"
        >
          <IoMenu size={24} />
        </button>

        {/* Logo */}
        <div
          className="flex items-center gap-3 select-none cursor-pointer"
          onClick={() => navigate("/")}
        >
          <img
            src={assets.logo}
            alt="Logo"
            className="h-10 w-10 object-contain drop-shadow-sm"
          />
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-800 tracking-tight">
            <span className="text-blue-600 font-bold">Todo</span>List
          </h1>
        </div>

        {/* Desktop Buttons */}
        <div className="hidden md:flex items-center gap-4 relative">
          <button
            onClick={() => setIsCategoryManagementModalOpen(true)}
            className="bg-gradient-to-r from-purple-100 to-purple-200 hover:from-purple-200 hover:to-purple-300 text-purple-700 font-medium px-4 py-2 rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
          >
            Quản lý danh mục
          </button>

          <button
            onClick={() => setIsStatisticModalOpen(true)}
            className="bg-gradient-to-r from-orange-100 to-orange-200 hover:from-orange-200 hover:to-orange-300 text-orange-700 font-medium px-4 py-2 rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
          >
            Thống kê
          </button>


          {/* Avatar Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-10 h-10 rounded-full overflow-hidden bg-blue-600 text-white flex items-center justify-center font-bold text-lg hover:bg-blue-700 transition"
            >
              <img
                src={assets.avatar}
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            </button>

            <AnimatePresence>
              {isDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-lg flex flex-col overflow-hidden z-50"
                >
                  <button
                    onClick={() => {
                      setIsResetPasswordModalOpen(true); // modal thay đổi mật khẩu
                      setIsDropdownOpen(false);
                    }}
                    className="px-4 py-2 text-left hover:bg-gray-100 transition"
                  >
                    Thay đổi mật khẩu
                  </button>
                  <button
                    onClick={() => {
                      setIsDropdownOpen(false);
                      handleLogout();
                    }}
                    className="px-4 py-2 text-left hover:bg-gray-100 text-red-600 transition"
                  >
                    Đăng xuất
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className="md:hidden text-gray-700 p-2 rounded-md hover:bg-gray-200 transition"
        >
          <IoMenu size={24} />
        </button>
      </header>

      {/* Mobile Slide-In Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Overlay */}
            <motion.div
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[999]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Drawer */}
            <motion.div
              className="fixed top-0 right-0 h-full w-60 bg-white shadow-xl p-5 flex flex-col gap-4 z-[1000] rounded-l-2xl"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <div className="flex justify-between items-center">
                <h2 className="font-semibold text-lg">Tùy chọn</h2>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 hover:bg-gray-200 rounded-lg transition"
                >
                  <IoClose size={24} />
                </button>
              </div>

              <button
                onClick={() => {
                  setIsCategoryManagementModalOpen(true);
                  setIsMobileMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 text-purple-700 font-medium"
              >
                Quản lý danh mục
              </button>

              <button
                onClick={() => {
                  setIsStatisticModalOpen(true);
                  setIsMobileMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 text-orange-700 font-medium"
              >
                Thống kê
              </button>

              <button
                onClick={() => {
                  setIsResetPasswordModalOpen(true);
                  setIsMobileMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 text-black font-medium"
              >
                Đổi mật khẩu
              </button>

              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  handleLogout();
                }}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 text-red-600 font-medium"
              >
                Đăng xuất
              </button>

              <div className="mt-auto text-center text-gray-400 text-sm">
                ✨ TodoList Pro 2025 ✨
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Modal quản lý danh mục / thay đổi mật khẩu */}
      {isCategoryManagementModalOpen && (
        <CategoryManagementModal onClose={() => setIsCategoryManagementModalOpen(false)} />
      )}

      {isStatisticModalOpen && (
        <StatisticModal onClose={() => setIsStatisticModalOpen(false)} />
      )}

      {isResetPasswordModalOpen && (
        <ChangePasswordModal 
          onSubmit={({ oldPassword, newPassword }) => handleChangePassword({ username, oldPassword, newPassword })}
          onClose={() => setIsResetPasswordModalOpen(false)} 
        />
      )}
    </>
  );
};

export default Navbar;
