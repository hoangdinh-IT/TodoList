// import React, { useState } from "react";

// const Sidebar = ({ setIsState }) => {
//   const [active, setActive] = useState("pending");

//   const buttons = [
//     { label: "Công việc đang chờ", value: "pending", color: "yellow" },
//     { label: "Công việc hoàn thành", value: "completed", color: "green" },
//     { label: "Tất cả công việc", value: "all", color: "blue" },
//   ];

//   const handleClick = (value) => {
//     setActive(value);
//     setIsState(value);
//   };

//   const getColors = (color, isActive) => {
//     switch (color) {
//       case "yellow":
//         return isActive
//           ? "bg-gradient-to-r from-yellow-500 to-yellow-600 text-white shadow-md"
//           : "text-gray-700 hover:bg-yellow-50 hover:text-yellow-600";
//       case "green":
//         return isActive
//           ? "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-md"
//           : "text-gray-700 hover:bg-green-50 hover:text-green-600";
//       case "blue":
//         return isActive
//           ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md"
//           : "text-gray-700 hover:bg-blue-100 hover:text-blue-700";
//       default:
//         return "";
//     }
//   };

//   return (
//     <div className="w-72 bg-white border-r border-gray-200 shadow-lg flex flex-col p-6 rounded-r-2xl">
//       <h2 className="text-xl font-bold mb-6 text-center text-gray-800 tracking-wide">
//         Quản lí công việc
//       </h2>

//       <div className="flex flex-col gap-3">
//         {buttons.map((btn) => {
//           const isActive = active === btn.value;
//           return (
//             <button
//               key={btn.value}
//               onClick={() => handleClick(btn.value)}
//               className={`px-4 py-3 rounded-xl text-left font-medium text-base transition-all duration-300 ease-in-out ${getColors(btn.color, isActive)}`}
//             >
//               {btn.label}
//             </button>
//           );
//         })}
//       </div>

//       <div className="mt-auto pt-6 border-t border-gray-100 text-center text-sm text-gray-400">
//         <p>✨ TodoList Pro 2025 ✨</p>
//       </div>
//     </div>
//   );
// };

// export default Sidebar;





import React, { useState } from "react";
import { IoClose } from "react-icons/io5";

const Sidebar = ({ setIsState, isSidebarOpen, setIsSidebarOpen }) => {
  const [active, setActive] = useState("pending");

  const buttons = [
    { label: "Công việc đang chờ", value: "pending", color: "yellow" },
    { label: "Công việc hoàn thành", value: "completed", color: "green" },
    { label: "Tất cả công việc", value: "all", color: "blue" },
  ];

  const handleClick = (value) => {
    setActive(value);
    setIsState(value);
    setIsSidebarOpen(false); // auto close on mobile
  };

  const getColors = (color, isActive) => {
    switch (color) {
      case "yellow":
        return isActive
          ? "bg-gradient-to-r from-yellow-500 to-yellow-600 text-white shadow-md"
          : "text-gray-700 hover:bg-yellow-50 hover:text-yellow-600";
      case "green":
        return isActive
          ? "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-md"
          : "text-gray-700 hover:bg-green-50 hover:text-green-600";
      case "blue":
        return isActive
          ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md"
          : "text-gray-700 hover:bg-blue-100 hover:text-blue-700";
      default:
        return "";
    }
  };

  return (
    <>
      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      <div
        className={`
          fixed top-0 left-0 h-full w-72 bg-white border-r border-gray-200 shadow-lg flex flex-col p-6 rounded-r-2xl z-50
          transform transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 md:relative
        `}
      >
        {/* Close button mobile */}
        <div className="flex justify-end md:hidden mb-4">
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="text-gray-500 hover:text-gray-700 transition"
          >
            <IoClose size={24} />
          </button>
        </div>

        <h2 className="text-xl font-bold mb-6 text-center text-gray-800 tracking-wide">
          Quản lí công việc
        </h2>

        <div className="flex flex-col gap-3">
          {buttons.map((btn) => {
            const isActive = active === btn.value;
            return (
              <button
                key={btn.value}
                onClick={() => handleClick(btn.value)}
                className={`px-4 py-3 rounded-xl text-left font-medium text-base transition-all duration-300 ease-in-out ${getColors(
                  btn.color,
                  isActive
                )}`}
              >
                {btn.label}
              </button>
            );
          })}
        </div>

        <div className="mt-auto pt-6 border-t border-gray-100 text-center text-sm text-gray-400">
          <p>✨ TodoList Pro 2025 ✨</p>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
