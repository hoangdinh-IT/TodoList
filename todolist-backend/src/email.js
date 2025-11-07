import sgMail from "@sendgrid/mail";
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendEmail = async ({ to, subject, html }) => {
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

const emailTemplate = (otp) => `
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
    `;

export {
    sendEmail,
    emailTemplate
}