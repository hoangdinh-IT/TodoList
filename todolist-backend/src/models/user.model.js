import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  }, 
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  // Nếu password chưa thay đổi thì bỏ qua
  if (!this.isModified("password")) return next();

  try {
    // Tạo salt và hash password
    const salt = await bcrypt.genSalt(10); // độ phức tạp: 10 vòng
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Thêm phương thức kiểm tra password khi login
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model("User", userSchema);