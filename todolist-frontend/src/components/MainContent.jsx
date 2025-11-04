import React, { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { IoCheckmarkDoneCircle, IoTimeOutline } from "react-icons/io5";
import { AiOutlinePlus } from "react-icons/ai";
import { FaTasks } from "react-icons/fa";

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

  const { data: dataTasks, isLoading: loadingTasks } = useQuery({
    queryKey: ["tasks"],
    queryFn: taskAPI.getAll,
  });

  const { data: categories, isLoading: loadingCategories } = useQuery({
    queryKey: ["categories"],
    queryFn: categoryAPI.getAll,
  });

  useEffect(() => {
    if (!dataTasks) return;

    let filtered = [];

    if (isState === "pending") {
      filtered = dataTasks.filter(task => !task.completed);
    } else if (isState === "completed") {
      filtered = dataTasks.filter(task => task.completed);
    } else {
      filtered = [...dataTasks];
    }

    const sorted = filtered.sort((a, b) => {
      const dateA = a.deadline ? new Date(a.deadline).getTime() : Infinity;
      const dateB = b.deadline ? new Date(b.deadline).getTime() : Infinity;
      return dateA - dateB;
    });

    setTasks(sorted);
  }, [dataTasks, isState]);

  const handleAdd = () => {
    setIsFormTaskModal(true);
    setEditingTask(null);
  }

  const handleEdit = (task) => {
    setIsFormTaskModal(true);
    setEditingTask(task);
  }

  const handleClose = () => {
    setIsFormTaskModal(false);
    setEditingTask(null);
  }

  const updateCompletedTask = useMutation({
    mutationFn: ({ taskId, completed }) => taskAPI.updateCompleted(taskId, completed),
    onSuccess: (data) => {
      const message = data.completed
        ? `🎉 Công việc "${data.title}" đã được đánh dấu hoàn thành!`
        : `↩️ Công việc "${data.title}" đã được hoàn tác!`;

      showSnackbar(message, "success");
      queryClient.invalidateQueries(["tasks"]);
    },
    onError: (err) => {
      showSnackbar(err?.response?.data?.message || "Đánh dấu công việc thất bại!", "error");
    }
  })

  const handleCompletedTask = (taskId, completed) => {
    const isCompleted = tasks.find((t) => t._id === taskId).completed;
    if (!isCompleted)
      showDialog({
        title: "XÁC NHẬN HOÀN THÀNH CÔNG VIỆC",
        message: "Bạn có chắc chắn đã hoàn thành công việc này không?",
        confirmText: "Xác nhận",
        cancelText: "Hủy",
        confirmColor: "success",
        onConfirm: () => updateCompletedTask.mutate({ taskId, completed })
      });
    else 
      showDialog({
        title: "XÁC NHẬN CHƯA HOÀN THÀNH CÔNG VIỆC",
        message: "Bạn có chắc chắn muốn hoàn tác công việc đã hoàn thành này không?",
        confirmText: "Xác nhận",
        cancelText: "Hủy",
        confirmColor: "success",
        onConfirm: () => updateCompletedTask.mutate({ taskId, completed })
      });
  }

  const deleteTask = useMutation({
    mutationFn: taskAPI.delete,
    onSuccess: () => {
      showSnackbar("Xoá công việc thành công!", "success");
      queryClient.invalidateQueries(["tasks"]);
    },
    onError: (err) => {
      showSnackbar(err?.response?.data?.message || "Xoá công việc thất bại!", "error");
    }
  });

  const handleDelete = (taskId) => {
    showDialog({
      title: "XÁC NHẬN XOÁ CÔNG VIỆC",
      message: "Bạn có chắc chắn muốn xoá công việc này không?",
      confirmText: "Xoá",
      cancelText: "Hủy",
      confirmColor: "error",
      onConfirm: () => deleteTask.mutate(taskId)
    });
  }

  if (loadingTasks || loadingCategories) return <Spinner />;

  return (
    <div className="flex-1 p-4 sm:p-8 bg-gray-50 overflow-y-auto relative">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
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

          <p className="text-gray-500 text-sm mt-2">
            Tổng cộng:{" "}
            <span className="font-semibold text-gray-800">{tasks.length}</span>{" "}
            công việc
          </p>
        </div>

        {/* Add Task Button */}
        <button
          onClick={handleAdd}
          className="
            flex items-center gap-2
            bg-gradient-to-r from-blue-100 to-blue-200
            hover:from-blue-200 hover:to-blue-300
            text-blue-700 font-medium
            px-5 py-2.5 rounded-full shadow-sm
            transition-all duration-300
            hover:shadow-md hover:scale-105 active:scale-95
          "
        >
          <AiOutlinePlus className="text-lg" />
          <span>Thêm công việc</span>
        </button>
      </div>

      <TaskList 
        tasks={tasks} 
        categories={categories}
        onToggleComplete={(taskId, completed) => handleCompletedTask(taskId, completed)}
        onEdit={(task) => handleEdit(task)}
        onDelete={(taskId) => handleDelete(taskId)}
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
