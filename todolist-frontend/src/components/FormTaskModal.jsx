import React, { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { categoryAPI, taskAPI } from "../services/api";
import { useSnackbar } from "../providers/SnackbarProvider";
import { motion, AnimatePresence } from "framer-motion";
import { AiOutlineClose } from "react-icons/ai";

const AddTaskModal = ({ editingTask, categories, onClose }) => {
  const queryClient = useQueryClient();
  const { showSnackbar } = useSnackbar();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    deadline: "",
    categoryId: ""
  });

  useEffect(() => {
    if (editingTask) {
      setFormData({
        title: editingTask.title || "",
        description: editingTask.description || "",
        deadline: editingTask.deadline ? editingTask.deadline.split("T")[0] : "",
        categoryId: editingTask.categoryId || ""
      });
    } else {
      setFormData({
        title: "",
        description: "",
        deadline: "",
        categoryId: ""
      });
    }
  }, [editingTask]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const addTask = useMutation({
    mutationFn: taskAPI.create,
    onSuccess: () => {
      showSnackbar("Thêm công việc thành công!", "success");
      setFormData({
        title: "",
        description: "",
        deadline: "",
        categoryId: ""
      });
      queryClient.invalidateQueries(["tasks"]);
      onClose();
    },
    onError: (err) => {
      showSnackbar("Thêm công việc thất bại!" || err?.response?.data?.message, "error");
    }
  });

  const updateTask = useMutation({
    mutationFn: taskAPI.update,
    onSuccess: () => {
      showSnackbar("Cập nhật công việc thành công!", "success");
      setFormData({
        title: "",
        description: "",
        deadline: "",
        categoryId: ""
      });
      queryClient.invalidateQueries(["tasks"]);
      onClose();
    },
    onError:(err) => {
      showSnackbar("Cập nhật công việc thất bại!" || err?.response?.data?.message, "error");
    }
  })

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description) {
      showSnackbar("Vui lòng nhập đầy đủ thông tin!", "warning");
      return;
    }

    if (!editingTask)
      addTask.mutate(formData);
    else
      updateTask.mutate({ taskId: editingTask._id, ...formData });
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-black/40 to-gray-800/30 backdrop-blur-sm z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="relative w-full max-w-lg bg-white/95 rounded-3xl shadow-2xl p-8 border border-gray-100 backdrop-blur-md"
          initial={{ y: 60, opacity: 0, scale: 0.9 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 60, opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          {/* Header */}
          <div className="flex justify-between items-center mb-6 border-b pb-3">
            <h2 className="text-2xl font-semibold text-gray-800">
              {!editingTask ? (
                "📝 Thêm công việc mới"
              ) : (
                "📝 Cập nhật công việc"
              )}
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100 transition"
            >
              <AiOutlineClose size={22} className="text-gray-500" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tiêu đề</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Nhập tiêu đề công việc..."
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition placeholder:text-gray-400"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                placeholder="Nhập mô tả chi tiết..."
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition resize-none placeholder:text-gray-400"
              />
            </div>

            {/* Deadline */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ngày hết hạn</label>
              <input
                type="date"
                name="deadline"
                value={formData.deadline}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Danh mục</label>
              <div className="relative w-full">
                <select
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleChange}
                  className="w-full appearance-none rounded-xl border border-gray-300 bg-white px-4 py-3 pr-10 text-gray-800 font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                >
                  <option value="" disabled>
                    Chọn danh mục
                  </option>
                  {categories?.length > 0 ? (
                    categories.map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.title}
                      </option>
                    ))
                  ) : (
                    <option disabled>Chưa có danh mục</option>
                  )}
                </select>

                {/* Icon dropdown */}
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400">
                  <svg
                    className="h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.23 7.21a.75.75 0 011.06.02L10 11.585l3.71-4.355a.75.75 0 111.14.976l-4.25 5a.75.75 0 01-1.14 0l-4.25-5a.75.75 0 01.02-1.06z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-3 pt-5 border-t">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl text-gray-700 bg-gray-100 hover:bg-gray-200 transition font-medium"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition shadow-sm"
              >
                {!editingTask ? (
                  "Thêm công việc"
                ) : (
                  "Cập nhật công việc"
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AddTaskModal;
