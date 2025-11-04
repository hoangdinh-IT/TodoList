import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import morgan from "morgan";
import { MONGO_URI, PORT } from "./config.js";
import authRoutes from "./routes/auth.route.js";
import taskRoutes from "./routes/task.route.js";
import categoryRoutes from "./routes/category.route.js";

const app = express();

const allowedOrigins = [
  'https://todolist-rkait.vercel.app',  // URL FE Vercel của bạn
  'http://localhost:5173'               // Local dev (Vite default port)
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(express.json());

app.use(morgan("dev"));

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/categories", categoryRoutes);

app.get("/", (req, res) => {
    res.send("Server đã chạy thành công!");
})

mongoose
    .connect(MONGO_URI)
    .then(() => {
        app.listen(PORT, () => console.log(` Server running on port ${PORT}`));
    })
    .catch((err) => console.error(err));