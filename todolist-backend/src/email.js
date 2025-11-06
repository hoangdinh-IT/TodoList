// import nodemailer from "nodemailer";
// import dotenv from "dotenv";
// dotenv.config();

// const transporter = nodemailer.createTransport({
//     host: process.env.EMAIL_HOST,
//     port: Number(process.env.EMAIL_PORT) || 456,
//     secure: process.env.EMAIL_SECURE === "true",
//     auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS,
//     },
// });

// const verifyTransporter = async () => {
//     try {
//         await transporter.verify();
//         console.log("✅ Mail transporter ready");
//     } catch (err) {
//         console.warn("⚠️ Mail transporter verify failed:", err.message);
//     }
// }

// export {
//     transporter,
//     verifyTransporter
// }

// import axios from "axios";
// import dotenv from "dotenv";
// dotenv.config();

// const BREVO_URL = "https://api.brevo.com/v3/smtp/email";
// const API_KEY = process.env.BREVO_API_KEY;
// const SENDER_EMAIL = process.env.SENDER_EMAIL;
// const SENDER_NAME = process.env.SENDER_NAME || "TodoList";

// if (!API_KEY) {
//   console.warn("⚠️ BREVO_API_KEY not set. Emails will fail.");
// }

// const sendBrevoEmail = async ({ toEmail, subject, html }) => {
//   const body = {
//     sender: { name: SENDER_NAME, email: SENDER_EMAIL },
//     to: [{ email: toEmail }],
//     subject,
//     htmlContent: html,
//     textContent: html.replace(/<[^>]+>/g, ""), // fallback
//   };

//   const res = await axios.post(BREVO_URL, body, {
//     headers: {
//       "api-key": API_KEY,
//       "Content-Type": "application/json",
//     },
//     timeout: 15000,
//   });
//   return res.data;
// };

// export {
//     sendBrevoEmail
// }






import sgMail from "@sendgrid/mail";
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const sendEmail = async ({ to, subject, html }) => {
  const msg = {
    to,
    from: {
      email: process.env.SENDER_EMAIL,
      name: process.env.SENDER_NAME || "TodoList",
    },
    subject,
    html,
  };

  await sgMail.send(msg);
};
