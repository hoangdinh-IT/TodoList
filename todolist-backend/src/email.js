import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT) || 456,
    secure: process.env.EMAIL_SECURE === "true",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

const verifyTransporter = async () => {
    try {
        await transporter.verify();
        console.log("✅ Mail transporter ready");
    } catch (err) {
        console.warn("⚠️ Mail transporter verify failed:", err.message);
    }
}

export {
    transporter,
    verifyTransporter
}