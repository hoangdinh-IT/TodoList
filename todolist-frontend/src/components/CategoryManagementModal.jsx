import React, { useState, useEffect, useRef } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { AiOutlineClose, AiOutlinePlus, AiOutlineEdit, AiOutlineDelete } from "react-icons/ai";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

import { categoryAPI } from "../services/api.js";
import Spinner from "./Spinner.jsx";
import { useSnackbar } from "../providers/SnackbarProvider.jsx";
import { useDialog } from "../providers/DialogProvider.jsx";

const CategoryManagementModal = ({ onClose }) => {
  const queryClient = useQueryClient();
  const { showSnackbar } = useSnackbar();
  const { showDialog } = useDialog();
  const inputRef = useRef(null);

  const [categories, setCategories] = useState([]);
  const [isOpenFormCategory, setIsOpenFormCategory] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [editingCategoryId, setEditingCategoryId] = useState(null);

  const { data, isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: categoryAPI.getAll,
  });

  useEffect(() => {
    if (data) setCategories(data);
  }, [data]);

  const resetForm = () => {
    setIsOpenFormCategory(false);
    setNewCategory("");
    setEditingCategoryId(null);
  };

  const handleChange = (e) => setNewCategory(e.target.value);

  const handleEdit = (category) => {
    setEditingCategoryId(category._id);
    setNewCategory(category.title);
    setIsOpenFormCategory(true);
  };

  const addCategory = useMutation({
    mutationFn: categoryAPI.create,
    onSuccess: () => {
      showSnackbar("Thêm thể loại thành công!", "success");
      resetForm();
      queryClient.invalidateQueries(["categories"]);
    },
    onError: (err) => {
      showSnackbar(err?.response?.data?.message || "Thêm thể loại thất bại!", "error");
    },
  });

  const updateCategory = useMutation({
    mutationFn: categoryAPI.update,
    onSuccess: () => {
      showSnackbar("Cập nhật thể loại thành công!", "success");
      resetForm();
      queryClient.invalidateQueries(["categories"]);
    },
    onError: (err) => {
      showSnackbar(err?.response?.data?.message || "Cập nhật thể loại thất bại!", "error");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newCategory.trim()) {
      showSnackbar("Vui lòng nhập đầy đủ thông tin!", "warning");
      return;
    }

    if (!editingCategoryId)
      addCategory.mutate({ title: newCategory });
    else
      updateCategory.mutate({ categoryId: editingCategoryId, title: newCategory });
  };

  const deleteCategory = useMutation({
    mutationFn: categoryAPI.delete,
    onSuccess: () => {
      showSnackbar("Xoá thể loại thành công!", "success");
      queryClient.invalidateQueries(["categories"]);
    },
    onError: (err) => {
      showSnackbar(err?.response?.data?.message || "Xoá thể loại thất bại!", "error");
    },
  });

  const handleDelete = (categoryId) => {
    showDialog({
      title: "XÁC NHẬN XOÁ THỂ LOẠI",
      message: "Khi bạn xoá thể loại này, tất cả công việc thuộc thể loại cũng sẽ bị xoá vĩnh viễn. Bạn có chắc chắn muốn tiếp tục?",
      confirmText: "Xoá",
      cancelText: "Hủy",
      confirmColor: "error",
      onConfirm: () => deleteCategory.mutate(categoryId),
    });
};

  // 🔹 Khi người dùng kéo & thả item
  const handleDragEnd = async (result) => {
    if (!result.destination) return; // Không thay đổi vị trí

    const newOrder = Array.from(categories);
    const [movedItem] = newOrder.splice(result.source.index, 1);
    newOrder.splice(result.destination.index, 0, movedItem);
    setCategories(newOrder);

    try {
      await categoryAPI.updateOrder(
        newOrder.map((cat, index) => ({ id: cat._id, order: index }))
      );
      queryClient.invalidateQueries(["categories"]);
    } catch (err) {
      showSnackbar("Cập nhật thứ tự thất bại!", "error");
    }
  };

  useEffect(() => {
    if (isOpenFormCategory && inputRef.current) inputRef.current.focus();
  }, [isOpenFormCategory]);

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-white rounded-3xl shadow-xl w-96 max-h-[80vh] overflow-y-auto p-6 relative border border-gray-100"
          initial={{ scale: 0.95, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 30 }}
          transition={{ type: "spring", stiffness: 120, damping: 15 }}
        >
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-800 tracking-wide">
              Quản lý thể loại
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <AiOutlineClose size={24} />
            </button>
          </div>

          {/* Nút thêm + Hủy */}
          <div className="flex gap-3 mb-5">
            <button
              onClick={() => setIsOpenFormCategory(true)}
              className={`flex items-center gap-2 px-5 py-2 rounded-2xl bg-gradient-to-r from-blue-100 to-blue-200 text-blue-700 font-medium shadow-sm hover:shadow-md transition-all duration-200
                ${isOpenFormCategory ? "opacity-50 cursor-not-allowed" : ""}`}
              disabled={isOpenFormCategory}
            >
              <AiOutlinePlus /> Thêm thể loại
            </button>

            {isOpenFormCategory && (
              <button
                onClick={resetForm}
                className="px-4 py-2 rounded-2xl bg-gray-100 text-gray-600 hover:bg-gray-200 transition"
              >
                Hủy
              </button>
            )}
          </div>

          {/* Danh sách thể loại */}
          {isLoading ? (
            <Spinner />
          ) : (
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="categories">
                {(provided) => (
                  <ul
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="flex flex-col gap-3"
                  >
                    {isOpenFormCategory && (
                      <li className="px-4 py-2 rounded-2xl bg-gray-50 flex items-center gap-2 shadow-sm hover:shadow-md transition">
                        <input
                          ref={inputRef}
                          type="text"
                          value={newCategory}
                          onChange={handleChange}
                          placeholder="Nhập tên thể loại..."
                          onKeyDown={(e) =>
                            e.key === "Enter" && handleSubmit(e)
                          }
                          className="w-full border border-gray-300 rounded-2xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                        />
                        <button
                          onClick={handleSubmit}
                          className="px-4 py-2 rounded-2xl bg-green-600 text-white hover:bg-green-700 transition"
                        >
                          Lưu
                        </button>
                      </li>
                    )}
                    {categories.length === 0 ? (
                      <li className="text-center text-gray-500 italic py-4 bg-gray-50 rounded-2xl shadow-sm">
                        Chưa có thể loại nào!
                      </li>
                    ) : (
                      categories.map((cat, index) => (
                        <Draggable key={cat._id} draggableId={cat._id} index={index}>
                          {(provided) => (
                            <li
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="px-4 py-2 rounded-2xl bg-gray-50 hover:bg-gray-100 text-gray-700 shadow-sm hover:shadow-md transition-all duration-200 flex justify-between items-center"
                            >
                              <span>{cat.title}</span>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleEdit(cat)}
                                  className="text-blue-500 hover:text-blue-600 transition"
                                >
                                  <AiOutlineEdit size={18} />
                                </button>
                                <button
                                  onClick={() => handleDelete(cat._id)}
                                  className="text-red-500 hover:text-red-600 transition"
                                >
                                  <AiOutlineDelete size={18} />
                                </button>
                              </div>
                            </li>
                          )}
                        </Draggable>
                      ))
                    )}
                    {provided.placeholder}
                  </ul>
                )}
              </Droppable>
            </DragDropContext>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CategoryManagementModal;