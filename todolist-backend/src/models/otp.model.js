import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
    email: { type: String, required: true, lowercase: true, index: true },
    otpHash: { type: String, required: true },
    createdAt: { type: Date, default: Date.now, expires: 300 }, // TTL 5 phút
    attempts: { type: Number, default: 0 },
});

export default mongoose.model("Otp", otpSchema);