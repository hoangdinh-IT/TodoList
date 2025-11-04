// import React from "react";
// import { AiOutlineEdit, AiOutlineDelete } from "react-icons/ai";
// import { format } from "date-fns";
// import { taskAPI } from "../services/api";

// const TaskList = ({ tasks, categories, onToggleComplete, onEdit, onDelete }) => {
//   const getCategory = (task) => {
//     if (!task?.categoryId) return "Không có";
//     const category = categories.find((cat) => cat._id === task.categoryId);
//     return category ? category.title : "Không có";
//   };

//   return tasks.length === 0 ? (
//     <div className="text-center text-gray-500 italic py-10 bg-white rounded-xl shadow-inner border border-gray-100 w-full">
//       Không có công việc nào!
//     </div>
//   ) : (
//     <div className="bg-white rounded-3xl shadow-lg p-6">
//       {/* Header row */}
//       <div className="grid grid-cols-[1fr_150px_150px_120px] px-4 py-2 text-sm font-semibold text-gray-500 mb-2">
//         <span className="text-left px-7">Công việc</span>
//         <span className="text-center">Ngày hết hạn</span>
//         <span className="text-center">Thể loại</span>
//         <span className="text-center">Thao tác</span>
//       </div>

//       <ul className="flex flex-col gap-4">
//         {tasks.map((task) => (
//           <div key={task._id} className="flex items-center gap-3">
//             {/* Nút radio nằm ngoài khung */}
//             <input
//               type="checkbox"
//               checked={task.completed}
//               onChange={() => onToggleComplete(task._id, !task.completed)}
//               className="h-5 w-5 accent-green-500 cursor-pointer"
//               title={task.completed ? "Đánh dấu chưa hoàn thành" : "Đánh dấu hoàn thành"}
//             />

//             {/* Phần nội dung task (có khung nền) */}
//             <li
//               className="grid grid-cols-[1fr_150px_150px_120px] items-start w-full px-4 py-3 rounded-2xl bg-gray-50 hover:bg-gray-100 shadow-sm hover:shadow-md transition-all duration-200"
//             >
//               {/* Cột 1: Tên công việc + mô tả */}
//               <div className="min-w-0">
//                 <div
//                   className={`font-medium break-words whitespace-normal ${
//                     task.completed ? "text-gray-500 line-through" : "text-gray-800"
//                   }`}
//                 >
//                   {task.title}
//                 </div>
//                 {task.description && (
//                   <div className="text-sm text-gray-500 mt-1 break-words whitespace-normal overflow-hidden text-ellipsis">
//                     {task.description}
//                   </div>
//                 )}
//               </div>

//               {/* Cột 2: Deadline */}
//               <div className="text-center text-gray-700 font-medium">
//                 {task.deadline ? (
//                   format(new Date(task.deadline), "dd/MM/yyyy")
//                 ) : (
//                   <span className="italic text-gray-400">Không có</span>
//                 )}
//               </div>

//               {/* Cột 3: Category */}
//               <div className="flex justify-center">
//                 <span className="px-3 py-1 rounded-full text-xs font-semibold shadow-sm bg-pink-100 text-pink-700">
//                   {getCategory(task)}
//                 </span>
//               </div>

//               {/* Cột 4: Hành động */}
//               <div className="flex justify-center gap-3">
//                 <button
//                   onClick={() => onEdit(task)}
//                   className="text-blue-500 hover:text-blue-600 transition"
//                 >
//                   <AiOutlineEdit size={22} />
//                 </button>
//                 <button
//                   onClick={() => onDelete(task._id)}
//                   className="text-red-500 hover:text-red-600 transition"
//                 >
//                   <AiOutlineDelete size={22} />
//                 </button>
//               </div>
//             </li>
//           </div>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default TaskList;






import React from "react";
import { AiOutlineEdit, AiOutlineDelete } from "react-icons/ai";
import { format } from "date-fns";

const TaskList = ({ tasks, categories, onToggleComplete, onEdit, onDelete }) => {
  const getCategory = (task) => {
    if (!task?.categoryId) return "Không có";
    const category = categories.find((cat) => cat._id === task.categoryId);
    return category ? category.title : "Không có";
  };

  return tasks.length === 0 ? (
    <div className="text-center text-gray-500 italic py-10 bg-white rounded-xl shadow-inner border border-gray-100 w-full">
      Không có công việc nào!
    </div>
  ) : (
    <div className="bg-white rounded-3xl shadow-lg p-4 sm:p-6">
      {/* Header row */}
      <div className="hidden md:grid grid-cols-[1fr_150px_150px_120px] px-4 py-2 text-sm font-semibold text-gray-500 mb-2">
        <span className="text-left px-7">Công việc</span>
        <span className="text-center">Ngày hết hạn</span>
        <span className="text-center">Thể loại</span>
        <span className="text-center">Thao tác</span>
      </div>

      <ul className="flex flex-col gap-4">
        {tasks.map((task) => (
          <div key={task._id} className="flex items-start gap-3 sm:items-center">
            {/* Checkbox */}
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => onToggleComplete(task._id, !task.completed)}
              className="h-5 w-5 accent-green-500 cursor-pointer mt-2 sm:mt-0"
              title={task.completed ? "Đánh dấu chưa hoàn thành" : "Đánh dấu hoàn thành"}
            />

            {/* Task content */}
            <li className="flex flex-col md:grid md:grid-cols-[1fr_150px_150px_120px] w-full px-4 py-3 rounded-2xl bg-gray-50 hover:bg-gray-100 shadow-sm hover:shadow-md transition-all duration-200">
              {/* Tên + mô tả */}
              <div className="min-w-0">
                <div
                  className={`font-medium break-words whitespace-normal ${
                    task.completed ? "text-gray-500 line-through" : "text-gray-800"
                  }`}
                >
                  {task.title}
                </div>
                {task.description && (
                  <div className="text-sm text-gray-500 mt-1 break-words whitespace-normal overflow-hidden text-ellipsis">
                    {task.description}
                  </div>
                )}
              </div>

              {/* Deadline */}
              <div className="text-center text-gray-700 font-medium mt-2 md:mt-0">
                {task.deadline ? (
                  format(new Date(task.deadline), "dd/MM/yyyy")
                ) : (
                  <span className="italic text-gray-400">Không có</span>
                )}
              </div>

              {/* Category */}
              <div className="flex justify-center mt-2 md:mt-0">
                <span className="px-3 py-1 rounded-full text-xs font-semibold shadow-sm bg-pink-100 text-pink-700">
                  {getCategory(task)}
                </span>
              </div>

              {/* Actions */}
              <div className="flex justify-center gap-3 mt-2 md:mt-0">
                <button
                  onClick={() => onEdit(task)}
                  className="text-blue-500 hover:text-blue-600 transition"
                >
                  <AiOutlineEdit size={22} />
                </button>
                <button
                  onClick={() => onDelete(task._id)}
                  className="text-red-500 hover:text-red-600 transition"
                >
                  <AiOutlineDelete size={22} />
                </button>
              </div>
            </li>
          </div>
        ))}
      </ul>
    </div>
  );
};

export default TaskList;
