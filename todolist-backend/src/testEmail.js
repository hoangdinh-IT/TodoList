// src/testEmail.js
import dotenv from "dotenv";
dotenv.config();

import { verifyTransporter } from "./email.js";

verifyTransporter();

// const transporter = nodemailer.createTransport({
//     host: process.env.EMAIL_HOST,
//     port: Number(process.env.EMAIL_PORT) || 456,
//     secure: process.env.EMAIL_SECURE === "true",
//     auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS,
//     },
// });

// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.EMAIL_USER, // Gmail của bạn
//     pass: process.env.EMAIL_PASS, // App Password
//   },
// });