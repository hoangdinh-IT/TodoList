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

export {
    sendEmail
}