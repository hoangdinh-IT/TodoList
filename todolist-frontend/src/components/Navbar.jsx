import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoMenu } from "react-icons/io5";

import assets from "../assets/assets";
import { useAuth } from "../contexts/AuthContext";
import CategoryManagementModal from "./CategoryManagementModal";
import { useDialog } from "../providers/DialogProvider";

const Navbar = ({ setIsSidebarOpen }) => {
  const { logout } = useAuth();
  const { showDialog } = useDialog();
  const navigate = useNavigate();

  const [isCategoryModal, setIsCategoryModal] = useState(false);

  const handleLogout = async () => {
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

  return (
    <>
      <header className="flex justify-between items-center px-4 sm:px-8 py-3 bg-white/90 backdrop-blur-md shadow-md border-b border-gray-200 sticky top-0 z-50">
        {/* Mobile menu button */}
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="md:hidden text-gray-700 p-2 rounded-md hover:bg-gray-200 transition"
        >
          <IoMenu size={24} />
        </button>

        {/* Logo */}
        <div className="flex items-center gap-3 select-none">
          <img
            src={assets.logo}
            alt="Logo"
            className="h-10 w-10 object-contain drop-shadow-sm"
          />
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-800 tracking-tight">
            <span className="text-blue-600 font-bold">Todo</span>List
          </h1>
        </div>

        {/* Buttons */}
        <div className="hidden md:flex items-center gap-4">
          <button
            onClick={() => setIsCategoryModal(true)}
            className="bg-gradient-to-r from-purple-100 to-purple-200 hover:from-purple-200 hover:to-purple-300 text-purple-700 font-medium px-4 py-2 rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
          >
            Quản lý thể loại
          </button>

          <button
            onClick={handleLogout}
            className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-5 py-2 rounded-xl font-medium shadow-sm hover:shadow-md transition-all duration-200"
          >
            Đăng xuất
          </button>
        </div>
      </header>

      {isCategoryModal && <CategoryManagementModal onClose={() => setIsCategoryModal(false)} />}
    </>
  );
};

export default Navbar;
