import Task from "../models/task.model.js";
import Category from "../models/category.model.js";

const createTask = async (req, res) => {
    try {
        const { title, description, deadline, priority, categoryId } = req.body;

        const task = await Task.create({
            title,
            description,
            deadline,
            priority,
            categoryId,
            userId: req.user._id,
        });
        res.status(201).json(task);
    } catch (err) {
        console.error("Error in createTask: ", err);
        res.status(500).json({ message: "Lỗi khi tạo mới task!" });
    }
}

const getTasks = async (req, res) => {
    try {
        console.log(req.user._id);
        const tasks = await Task.find({ userId: req.user._id });
        return res.json(tasks);
    } catch (err) {
        console.error("Error in getTasks: ", err);
        res.status(500).json({ message: "Lỗi khi lấy danh sách task!" });
    }
}

const getTask = async (req, res) => {
    try {
        const { taskId } = req.params;

        const task = await Task.findOne({ _id: taskId, userId: req.user._id });

        if (!task) {
            return res.status(404).json({ message: "Task không tồn tại!" });
        }

        return res.json(task);
    } catch (err) {
        console.error("Error in getTask: ", err);
        res.status(500).json({ message: "Lỗi khi lấy task!" });
    }
}

const updateTask = async (req, res) => {
    try {
        const { taskId } = req.params;
        const { title, description, deadline, priority, categoryId } = req.body;

        const task = await Task.findById(taskId);   
        
        if (!task) {
            return res.status(404).json({ message: "Task không tồn tại!" });
        }

        if (task.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Not allowed" });
        }

        task.title = title ?? task.title;
        task.description = description ?? task.description;
        task.deadline = deadline ?? task.deadline;
        task.priority = priority ?? task.priority;
        task.categoryId = categoryId ?? task.categoryId;

        const updated = await task.save();
        return res.json(updated);
    } catch (err) {
        console.error("Error in updateTask: ", err);
        res.status(500).json({ message: "Lỗi khi cập nhật task!" });
    }
}

const deleteTask = async (req, res) => {
    try {
        const { taskId } = req.params;
        const task = await Task.findById(taskId);    

        if (!task) {
            return res.status(404).json({ message: "Task không tồn tại!" });
        }

        if (task.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Not allowed" });
        }

        await task.deleteOne({ _id: taskId });
        return res.json({ message: "Task đã được xoá thành công!" });
    } catch (err) {
        console.error("Error in deleteTask: ", err);
        res.status(500).json({ message: "Lỗi khi xoá task!" });
    }
}

const updateCompletedTask = async (req, res) => {
    try {
        const { taskId } = req.params;
        const task = await Task.findById(taskId);

        if (!task) {
            return res.status(404).json({ message: "Task không tồn tại!" });
        }

        if (task.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Not allowed" });
        }

        task.completed = req.body.completed ?? task.completed;

        const updated = await task.save();
        return res.json(updated);
    } catch (err) {
        console.error("Error in updateCompletedTask: ", err);
        res.status(500).json({ message: "Lỗi khi cập nhật hoàn thành task!" });
    }
}

// const getTasksByCategory = async (req, res) => {
//     try {
//         const { categoryId } = req.query;
//         const category = await Category.findById(categoryId);

//         if (!category) {
//             return res.status(404).json({ message: "Danh mục không tồn tại!" });
//         }

//         if (category.userId.toString() !== req.user._id.toString()) {
//             return res.status(403).json({ message: "Not allowed" });
//         }

//         const tasks = await Task.find({ userId: req.user._id, categoryId });
//         return res.json(tasks);
//     } catch (err) {
//         console.error("Error in getTasksByCategory: ", err);
//         res.status(500).json({ message: "Lỗi khi lấy task bằng danh mục!" });
//     }
// }

export {
    createTask,
    getTasks,
    getTask,
    updateTask,
    deleteTask,
    updateCompletedTask,
    // getTasksByCategory,
}