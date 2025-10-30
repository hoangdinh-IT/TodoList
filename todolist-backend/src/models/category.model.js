import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
    title: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    order: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model("Category", categorySchema);