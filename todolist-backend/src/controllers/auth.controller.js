import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config.js";

const register = async (req, res) => {
    try {
        const  { username, password } = req.body;
        const existingUser = await User.findOne({ username });

        if (existingUser) {
            return res.status(400).json({ message: "Người dùng đã tồn tại!" });
        }

        const newUser = await User.create({ username, password });

        return res.status(201).json({
            _id: newUser._id,
            username: newUser.username
        })
    } catch (err) {
        res.status(500).json({ message: "Lỗi server!", error: err.message });
    }
}

const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });

        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user._id,
                username: user.username,
                token: jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "30d" }),
            });
        } else {
            res.status(401).json();
        }
    } catch (err) {
        throw err;
    }
}

const changePassword = async (req, res) => {
  try {
    const { username, oldPassword, newPassword } = req.body;

    // Tìm user theo username
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: "Người dùng không tồn tại!" });
    }

    // Kiểm tra mật khẩu cũ
    const isMatch = await user.matchPassword(oldPassword);
    if (!isMatch) {
      return res.status(400).json({ message: "Mật khẩu cũ không đúng!" });
    }

    // Cập nhật mật khẩu mới (Mongoose pre-save hook sẽ hash nếu có)
    user.password = newPassword;
    await user.save();

    return res.status(200).json({ message: "Đổi mật khẩu thành công!" });
  } catch (err) {
    console.error("❌ Lỗi changePassword:", err.message);
    return res.status(500).json({ message: "Lỗi server!", error: err.message });
  }
};

export {
    register,
    login,
    changePassword
};