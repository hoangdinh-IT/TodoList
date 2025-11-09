import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useQuery } from "@tanstack/react-query";
import { IoClose } from "react-icons/io5";

import { taskAPI } from "../services/api";

// Màu sắc: xanh cho hoàn thành, vàng cho chưa hoàn thành
const COLORS = ["#22c55e", "#facc15"]; 

const StatisticsModal = ({ onClose }) => {
  const { data: tasks = [] } = useQuery({
    queryKey: ["tasks"],
    queryFn: taskAPI.getAll,
  });

  const total = tasks.length;
  const completed = tasks.filter((t) => t.completed).length;
  const pending = total - completed;

  const data = [
    { name: "Hoàn thành", value: completed },
    { name: "Chưa hoàn thành", value: pending },
  ];

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/40 flex justify-center items-center z-[999] backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-white rounded-3xl shadow-xl w-[800px] max-w-[95vw] max-h-[90vh] overflow-y-auto p-8 relative border border-gray-100"
          initial={{ scale: 0.95, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 30 }}
          transition={{ type: "spring", stiffness: 120, damping: 15 }}
        >
          {/* Nút đóng */}
          <button
            className="absolute top-6 right-6 text-gray-400 hover:text-gray-600"
            onClick={onClose}
          >
            <IoClose className="text-3xl" />
          </button>

          {/* Tiêu đề */}
          <h2 className="text-3xl font-bold text-center mb-8">📊 Thống kê công việc</h2>

          {/* Tổng số liệu */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 text-center">
            <div className="p-6 bg-blue-100 rounded-xl shadow-sm flex flex-col items-center">
              <h3 className="text-gray-700 font-medium mb-2">Tổng công việc</h3>
              <p className="text-3xl font-bold text-blue-600">{total}</p>
            </div>
            <div className="p-6 bg-green-100 rounded-xl shadow-sm flex flex-col items-center">
              <h3 className="text-gray-700 font-medium mb-2">Hoàn thành</h3>
              <p className="text-3xl font-bold text-green-600">{completed}</p>
            </div>
            <div className="p-6 bg-yellow-100 rounded-xl shadow-sm flex flex-col items-center">
              <h3 className="text-gray-700 font-medium mb-2">Chưa hoàn thành</h3>
              <p className="text-3xl font-bold text-yellow-600">{pending}</p>
            </div>
          </div>

          {/* Biểu đồ */}
          <div className="h-[400px]">
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={150}
                  fill="#8884d8"
                  dataKey="value"
                  // label={({ name, percent }) =>
                  //   `${name} ${(percent * 100).toFixed(0)}%`
                  // }
                >
                  {data.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default StatisticsModal;

