import jwt from "jsonwebtoken";
import crypto from "crypto";
import User from "../models/user.model.js";
import OtpModel from "../models/otp.model.js";
import { JWT_SECRET } from "../config.js";
import { transporter } from "../email.js";

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
    if (!user) {
      return res.status(404).json({ message: "Người dùng không tồn tại" });
    }

    // Optional: check rate-limit per email (implement separately), or delete previous OTPs
    await OtpModel.deleteMany({ email });

    const otp = Math.floor(100000 + Math.random() * 900000); // 6-digit
    const otpHash = hashOtp(otp);
    const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes

    await OtpModel.create({ email, otpHash, expiresAt });

    // send email
    const mailOptions = {
      from: `"TodoList" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "🔑 Mã OTP khôi phục mật khẩu",
      html: `
        <div style="font-family: 'Helvetica Neue', Arial, sans-serif; background:#f9f9f9; padding: 20px;">
          <div style="max-width: 480px; margin: auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
            
            <!-- Header -->
            <div style="background: #6C63FF; padding: 20px; text-align: center; color: white;">
              <h2 style="margin:0; font-size: 22px;">TodoList</h2>
            </div>

            <!-- Body -->
            <div style="padding: 25px; color: #333; text-align: center;">
              <p style="font-size: 16px; margin-bottom: 20px;">Bạn đã yêu cầu đổi mật khẩu. Vui lòng sử dụng mã OTP dưới đây:</p>
              
              <div style="display: inline-block; font-size: 28px; font-weight: 600; letter-spacing: 4px; padding: 12px 20px; background: #f0f0f0; border-radius: 8px; color: #6C63FF;">
                ${otp}
              </div>

              <p style="font-size: 14px; color: #666; margin-top: 20px;">Mã OTP có hiệu lực trong 5 phút.<br/>Nếu bạn không yêu cầu, vui lòng bỏ qua email này.</p>
            </div>

            <!-- Footer -->
            <div style="background: #f9f9f9; padding: 12px; text-align: center; font-size: 12px; color: #aaa;">
              © 2025 TodoList. Bảo lưu mọi quyền.
            </div>

          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    return res.json({ success: true, message: "OTP đã được gửi về email" });
  } catch (err) {
    console.error("sendOtp err:", err);
    return res.status(500).json({ message: "Lỗi server", error: err.message });
  }
};

const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const record = await OtpModel.findOne({ email }).sort({ createdAt: -1 });
    if (!record) return res.status(400).json({ message: "OTP không tồn tại hoặc đã hết hạn" });

    if (record.expiresAt < Date.now()) {
      await OtpModel.deleteMany({ email });
      return res.status(400).json({ message: "OTP đã hết hạn" });
    }

    const otpHash = hashOtp(otp);
    if (otpHash !== record.otpHash) {
      return res.status(400).json();
    }

    // return success — frontend can proceed to reset password
    return res.json({ success: true, message: "OTP hợp lệ" });
  } catch (err) {
    console.error("verifyOtp err:", err);
    return res.status(500).json({ message: "Lỗi server", error: err.message });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    const record = await OtpModel.findOne({ email }).sort({ createdAt: -1 });
    if (!record) return res.status(400).json({ message: "OTP không tồn tại hoặc đã hết hạn" });

    if (record.expiresAt < Date.now()) {
      await OtpModel.deleteMany({ email });
      return res.status(400).json({ message: "OTP đã hết hạn" });
    }

    const otpHash = hashOtp(otp);
    if (otpHash !== record.otpHash) {
      return res.status(400).json({ message: "OTP không đúng" });
    }

    // Find user and update password
    const user = await User.findOne({ username: email });
    if (!user) {
      return res.status(404).json({ message: "Người dùng không tồn tại" });
    }

    user.password = newPassword; // userSchema pre-save sẽ hash
    await user.save();

    // delete otp records
    await OtpModel.deleteMany({ email });

    return res.json({ success: true, message: "Đổi mật khẩu thành công" });
  } catch (err) {
    console.error("resetPassword err:", err);
    return res.status(500).json({ message: "Lỗi server", error: err.message });
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