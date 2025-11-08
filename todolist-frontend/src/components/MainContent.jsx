import React, { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { IoCheckmarkDoneCircle, IoTimeOutline } from "react-icons/io5";
import { AiOutlinePlus } from "react-icons/ai";
import { FaTasks } from "react-icons/fa";
import { FiSearch, FiFilter } from "react-icons/fi";

import { taskAPI, categoryAPI } from "../services/api";
import Spinner from "./Spinner";
import TaskList from "./TaskList";
import FormTaskModal from "./FormTaskModal";
import { useSnackbar } from "../providers/SnackbarProvider";
import { useDialog } from "../providers/DialogProvider";

const MainContent = ({ isState }) => {
  const queryClient = useQueryClient();
  const { showSnackbar } = useSnackbar();
  const { showDialog } = useDialog();

  const [tasks, setTasks] = useState([]);
  const [isFormTaskModal, setIsFormTaskModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCategory, setFilteredCategory] = useState("all");

  const { data: dataTasks, isLoading: loadingTasks } = useQuery({
    queryKey: ["tasks"],
    queryFn: taskAPI.getAll,
  });

  const { data: categories, isLoading: loadingCategories } = useQuery({
    queryKey: ["categories"],
    queryFn: categoryAPI.getAll,
  });

  // ✅ Lọc công việc theo trạng thái, thể loại, từ khóa
  useEffect(() => {
    if (!dataTasks) return;

    let filtered = [];

    // Lọc theo trạng thái (all / pending / completed)
    if (isState === "pending") {
      filtered = dataTasks.filter((task) => !task.completed);
    } else if (isState === "completed") {
      filtered = dataTasks.filter((task) => task.completed);
    } else {
      filtered = [...dataTasks];
    }

    // Lọc theo thể loại
    if (filteredCategory !== "all") {
      filtered = filtered.filter((task) =>
        task.categoryId === filteredCategory
      );
    }

    // Tìm kiếm theo tiêu đề
    if (searchTerm.trim()) {
      filtered = filtered.filter((task) =>
        task.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sắp xếp theo deadline
    const sorted = filtered.sort((a, b) => {
      const dateA = a.deadline ? new Date(a.deadline).getTime() : Infinity;
      const dateB = b.deadline ? new Date(b.deadline).getTime() : Infinity;
      return dateA - dateB;
    });

    // Sắp xếp theo priority (cao > trung bình > thấp)
    const priorityOrder = { high: 1, medium: 2, low: 3 };
    const sortedByPriority = sorted.sort(
      (a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]
    );
    
    setTasks(sortedByPriority);
  }, [dataTasks, isState, searchTerm, filteredCategory]);

  // === Handlers ===
  const handleAdd = () => {
    setIsFormTaskModal(true);
    setEditingTask(null);
  };

  const handleEdit = (task) => {
    setIsFormTaskModal(true);
    setEditingTask(task);
  };

  const handleClose = () => {
    setIsFormTaskModal(false);
    setEditingTask(null);
  };

  const updateCompletedTask = useMutation({
    mutationFn: ({ taskId, completed }) =>
      taskAPI.updateCompleted(taskId, completed),
    onSuccess: (data) => {
      const message = data.completed
        ? `🎉 Công việc "${data.title}" đã được hoàn thành!`
        : `↩️ Công việc "${data.title}" đã được hoàn tác!`;

      showSnackbar(message, "success");
      queryClient.invalidateQueries(["tasks"]);
    },
    onError: (err) => {
      showSnackbar(
        err?.response?.data?.message || "Đánh dấu công việc thất bại!",
        "error"
      );
    },
  });

  const handleCompletedTask = (taskId, completed) => {
    const isCompleted = tasks.find((t) => t._id === taskId).completed;
    const dialogProps = isCompleted
      ? {
          title: "XÁC NHẬN HOÀN TÁC CÔNG VIỆC",
          message:
            "Bạn có chắc chắn muốn hoàn tác công việc đã hoàn thành này không?",
        }
      : {
          title: "XÁC NHẬN HOÀN THÀNH CÔNG VIỆC",
          message: "Bạn có chắc chắn đã hoàn thành công việc này không?",
        };

    showDialog({
      ...dialogProps,
      confirmText: "Xác nhận",
      cancelText: "Hủy",
      confirmColor: "success",
      onConfirm: () => updateCompletedTask.mutate({ taskId, completed }),
    });
  };

  const deleteTask = useMutation({
    mutationFn: taskAPI.delete,
    onSuccess: () => {
      showSnackbar("🗑️ Xoá công việc thành công!", "success");
      queryClient.invalidateQueries(["tasks"]);
    },
    onError: (err) => {
      showSnackbar(
        err?.response?.data?.message || "Xoá công việc thất bại!",
        "error"
      );
    },
  });

  const handleDelete = (taskId) => {
    showDialog({
      title: "XÁC NHẬN XOÁ CÔNG VIỆC",
      message: "Bạn có chắc chắn muốn xoá công việc này không?",
      confirmText: "Xoá",
      cancelText: "Hủy",
      confirmColor: "error",
      onConfirm: () => deleteTask.mutate(taskId),
    });
  };

  if (loadingTasks || loadingCategories) return <Spinner />;

  return (
    <div className="flex-1 p-4 sm:p-8 bg-gradient-to-b from-gray-50 to-white overflow-y-auto">
      {/* === Header === */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <div className="flex-1 text-center">
          <h1 className="text-3xl font-bold text-gray-800 tracking-wide flex justify-center items-center gap-2">
            {isState === "all" && (
              <>
                <FaTasks className="text-blue-500 text-3xl" />
                <span>Tất cả công việc</span>
              </>
            )}
            {isState === "pending" && (
              <>
                <IoTimeOutline className="text-yellow-500 text-3xl" />
                <span>Công việc đang chờ</span>
              </>
            )}
            {isState === "completed" && (
              <>
                <IoCheckmarkDoneCircle className="text-green-500 text-3xl" />
                <span>Công việc hoàn thành</span>
              </>
            )}
          </h1>

          <p className="text-gray-500 text-sm mt-1">
            Tổng cộng:{" "}
            <span className="font-semibold text-gray-800">{tasks.length}</span>{" "}
            công việc
          </p>
        </div>

        {/* === Action area === */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={handleAdd}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-100 to-blue-200
              hover:from-blue-200 hover:to-blue-300 text-blue-700 font-medium
              px-5 py-2.5 rounded-full shadow-sm transition-all duration-300
              hover:shadow-md hover:scale-105 active:scale-95"
          >
            <AiOutlinePlus className="text-lg" />
            <span>Thêm công việc</span>
          </button>
        </div>
      </div>

      {/* === Filter + Search === */}
      <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
        {/* Search */}
        <div className="relative w-full sm:w-72">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
          <input
            type="text"
            placeholder="Tìm kiếm công việc..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300
              bg-white shadow-sm text-sm focus:outline-none focus:ring-2 
              focus:ring-blue-400 focus:border-blue-400 transition-all duration-200"
          />
        </div>
        
        {/* Filter by category */}
        <div className="relative w-full sm:w-64">
          <FiFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
          <select
            value={filteredCategory}
            onChange={(e) => setFilteredCategory(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300
              bg-white shadow-sm text-sm focus:outline-none focus:ring-2 
              focus:ring-blue-400 focus:border-blue-400 transition-all duration-200"
          >
            <option value="all">Tất cả thể loại</option>
            {categories?.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* === Task List === */}
      <TaskList
        tasks={tasks}
        categories={categories}
        onToggleComplete={handleCompletedTask}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {isFormTaskModal && (
        <FormTaskModal
          editingTask={editingTask}
          categories={categories}
          onClose={handleClose}
        />
      )}
    </div>
  );
};

export default MainContent;
