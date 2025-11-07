import jwt from "jsonwebtoken";
import crypto from "crypto";
import User from "../models/user.model.js";
import OtpModel from "../models/otp.model.js";
import { JWT_SECRET } from "../config.js";
import { sendEmail, emailTemplate } from "../email.js";

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

const hashOtp = (otp) => {
  return crypto.createHash("sha256").update(String(otp)).digest("hex");
};

const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ username: email });
    if (!user) return res.status(404).json({ message: "Người dùng không tồn tại!" });

    const recentCount = await OtpModel.countDocuments({
      email,
      createdAt: { $gt: new Date(Date.now() - 15 * 60 * 1000) }
    });

    await OtpModel.deleteMany({ email });

    const otp = Math.floor(100000 + Math.random() * 900000);
    const otpHash = hashOtp(otp);
    await OtpModel.create({ email, otpHash });

    const html = emailTemplate(otp);

    await sendEmail({
      to: email,
      subject: "🔑 Mã OTP khôi phục mật khẩu",
      html,
    });

    return res.json({ success: true, message: "OTP đã được gửi về email" });
  } catch (err) {
    console.error("sendOtp err:", err?.response?.data || err?.message || err);
    return res.status(500).json({ message: "Lỗi server khi gửi OTP" });
  }
};

const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const record = await OtpModel.findOne({ email }).sort({ createdAt: -1 });
    if (!record) return res.status(400).json({ message: "OTP không tồn tại hoặc đã hết hạn" });

    const otpHash = hashOtp(otp);
    if (otpHash !== record.otpHash) {
      record.attempts = (record.attempts || 0) + 1;
      await record.save();
      return res.status(400).json({ message: "OTP không đúng" });
    }

    await OtpModel.deleteMany({ email });
    return res.json({ success: true, message: "OTP hợp lệ" });
  } catch (err) {
    console.error("verifyOtp err:", err);
    return res.status(500).json({ message: "Lỗi server", error: err?.message || String(err) });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    const user = await User.findOne({ username: email });
    if (!user) return res.status(404).json({ message: "Người dùng không tồn tại" });

    user.password = newPassword; 
    await user.save();

    await OtpModel.deleteMany({ email });

    return res.json({ success: true, message: "Đổi mật khẩu thành công" });
  } catch (err) {
    console.error("resetPassword err:", err);
    return res.status(500).json({ message: "Lỗi server", error: err?.message || String(err) });
  }
};

export {
    register,
    login,
    changePassword,
    sendOtp,
    verifyOtp,
    resetPassword,
};