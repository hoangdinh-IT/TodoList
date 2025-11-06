import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
    email: { type: String, required: true, lowercase: true, index: true },
    otpHash: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    expiresAt: { type: Date, required: true, expires: 300 },
});

export default mongoose.model("Otp", otpSchema);