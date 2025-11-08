import React from "react";
import { AiOutlineEdit, AiOutlineDelete } from "react-icons/ai";
import { format } from "date-fns";
import { motion } from "framer-motion";

const TaskList = ({ tasks, categories, onToggleComplete, onEdit, onDelete }) => {
  const getCategory = (task) => {
    if (!task?.categoryId) return "Không có";
    const category = categories.find((cat) => cat._id === task.categoryId);
    return category ? category.title : "Không có";
  };

  if (tasks.length === 0) {
    return (
      <div className="text-center text-gray-500 italic py-10 bg-white rounded-3xl shadow-inner border border-gray-100 w-full">
        Không có công việc nào!
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl shadow-lg p-4 sm:p-6 border border-gray-100">
      {/* Header */}
      <div className="hidden md:grid grid-cols-[1fr_120px_120px_120px_120px] px-6 py-2 text-sm font-semibold text-gray-500 mb-3">
        <span className="text-left">Công việc</span>
        <span className="text-center">Ngày hết hạn</span>
        <span className="text-center">Thể loại</span>
        <span className="text-center">Ưu tiên</span>
        <span className="text-center">Thao tác</span>
      </div>

      {/* Task list */}
      <ul className="flex flex-col gap-3">
        {tasks.map((task, index) => (
          <motion.li
            key={task._id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`flex flex-col md:grid md:grid-cols-[1fr_120px_120px_120px_120px] items-center w-full px-6 py-4 rounded-2xl border transition-all duration-300
              ${
                task.completed
                  ? "bg-gray-50 border-gray-200"
                  : "bg-gradient-to-r from-blue-50 via-white to-blue-50 border-gray-100 hover:shadow-md hover:scale-[1.01]"
              }`}
          >
            {/* Checkbox + Title */}
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => onToggleComplete(task._id, !task.completed)}
                className="mt-1 h-5 w-5 accent-blue-500 cursor-pointer transition-transform hover:scale-110"
                title={task.completed ? "Đánh dấu chưa hoàn thành" : "Đánh dấu hoàn thành"}
              />
              <div className="flex flex-col">
                <span
                  className={`font-medium text-base ${
                    task.completed
                      ? "text-gray-400 line-through"
                      : "text-gray-800"
                  }`}
                >
                  {task.title}
                </span>
                {task.description && (
                  <span className="text-sm text-gray-500 mt-0.5 break-words whitespace-normal">
                    {task.description}
                  </span>
                )}
              </div>
            </div>

            {/* Deadline */}
            <div className="text-center text-gray-700 font-medium mt-3 md:mt-0">
              {task.deadline ? (
                <span className="px-3 py-1 rounded-full text-sm">
                  {format(new Date(task.deadline), "dd/MM/yyyy")}
                </span>
              ) : (
                <span className="italic text-gray-400">Không có</span>
              )}
            </div>

            {/* Category */}
            <div className="flex justify-center mt-2 md:mt-0">
              <span className="px-3 py-1 text-sm font-medium">
                {getCategory(task)}
              </span>
            </div>

            {/* Priority */}
            <div className="flex justify-center mt-2 md:mt-0">
              <span
                className={`px-3 py-1 rounded-full text-sm font-semibold border ${
                  task.priority === "high"
                    ? "bg-red-50 text-red-700 border-red-200"
                    : task.priority === "medium"
                    ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                    : "bg-green-50 text-green-700 border-green-200"
                }`}
              >
                {task.priority === "high"
                  ? "Cao"
                  : task.priority === "medium"
                  ? "Trung bình"
                  : "Thấp"}
              </span>
            </div>

            {/* Actions */}
            <div className="flex justify-center gap-3 mt-3 md:mt-0">
              <button
                onClick={() => onEdit(task)}
                className="p-2 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 hover:scale-110 transition-all"
                title="Chỉnh sửa"
              >
                <AiOutlineEdit size={18} />
              </button>
              <button
                onClick={() => onDelete(task._id)}
                className="p-2 rounded-full bg-red-50 text-red-600 hover:bg-red-100 hover:scale-110 transition-all"
                title="Xóa"
              >
                <AiOutlineDelete size={18} />
              </button>
            </div>
          </motion.li>
        ))}
      </ul>
    </div>
  );
};

export default TaskList;
