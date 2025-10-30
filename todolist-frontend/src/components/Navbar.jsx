import { useState } from "react";
import assets from "../assets/assets";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import CategoryModal from "./CategoryManagementModal";

const Navbar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [isCategoryModal, setIsCategoryModal] = useState(false);

  const handleLogout = async () => {
    logout();
    navigate("/", { replace: true });
  };

  return (
    <>
      <header className="flex justify-between items-center px-8 py-3 bg-white/90 backdrop-blur-md shadow-md border-b border-gray-200 sticky top-0 z-50">
        {/* Logo */}
        <div className="flex items-center gap-3 select-none">
          <img src={assets.logo} alt="Logo" className="h-12 w-12 object-contain drop-shadow-sm" />
          <h1 className="text-2xl font-semibold text-gray-800 tracking-tight">
            <span className="text-blue-600 font-bold">Todo</span>List
          </h1>
        </div>

        {/* Nút quản lý danh mục + đăng xuất */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsCategoryModal(true)}
            className="bg-gradient-to-r from-purple-100 to-purple-200 hover:from-purple-200 hover:to-purple-300 text-purple-700 font-medium px-4 py-2 rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
          >
            Quản lý danh mục
          </button>

          <button
            onClick={handleLogout}
            className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-5 py-2 rounded-xl font-medium shadow-sm hover:shadow-md transition-all duration-200"
          >
            Đăng xuất
          </button>
        </div>
      </header>

      {/* Modal */}
      {/* <CategoryModal 
        isCategoryModal={isCategoryModal} 
        onClose={() => setIsCategoryModal(false)} 
      /> */}
      {isCategoryModal && (
        <CategoryModal 
          onClose={() => setIsCategoryModal(false)} 
        />
      )}
    </>
  );
};

export default Navbar;
