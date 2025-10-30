import { useEffect } from "react";
import { Link } from "react-router-dom";
import assets from "../assets/assets";
import useTitle from "../hooks/useTitle";

const HomePage = () => {
  useTitle("Trang chủ | TodoList");

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center text-center px-6"
      style={{
        backgroundImage: `url('${assets.bg_2}')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >

      {/* Overlay làm mờ nền */}
      <div className="absolute inset-0 bg-black bg-opacity-40"></div>

      {/* Nội dung chính */}
      <div className="relative z-10 max-w-2xl text-white">
        <img
          src={assets.logo}
          alt="Logo"
          className="mx-auto mb-8 h-20 w-auto drop-shadow-lg"
        />
        <h1 className="text-4xl sm:text-5xl font-extrabold mb-4">
          Welcome to <span className="text-amber-300">TodoList</span>
        </h1>
        <p className="text-lg sm:text-xl text-gray-200 mb-8">
          Quản lý công việc của bạn dễ dàng, nhanh chóng và hiệu quả hơn bao giờ hết.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link
            to="/login"
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg"
          >
            Đăng Nhập
          </Link>

          <Link
            to="/register"
            className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-all duration-300 shadow-lg"
          >
            Đăng Ký Ngay
          </Link>
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 mt-10 text-sm text-gray-300">
        © {new Date().getFullYear()} TodoList App. All rights reserved.
      </div>
    </div>
  );
};

export default HomePage;
