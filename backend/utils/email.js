const { createTransporter } = require("./email.config.js");
const {
  Verification_Email_Template,
  Welcome_Email_Template,
} = require("./EmailTemplate.js");

const sendVerificationEmail = async (email, verificationCode) => {
  try {
    const transporter = createTransporter();
    const response = await transporter.sendMail({
      from: `"NewsNet" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Verify your Email",
      text: "Verify your Email",
      html: Verification_Email_Template.replace(
        "{verificationCode}",
        verificationCode
      ),
    });
    console.log("Email sent successfully", response.messageId);
    return true;
  } catch (error) {
    console.error("Email error:", error.message);
    console.log(`🔐 VERIFICATION CODE for ${email}: ${verificationCode}`);
    return false;
  }
};

const sendWelcomeEmail = async (email, name) => {
  try {
    const transporter = createTransporter();
    const response = await transporter.sendMail({
      from: `"NewsNet" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Welcome to NewsNet!",
      text: "Welcome Email",
      html: Welcome_Email_Template.replace("{name}", name),
    });
    console.log("Welcome email sent successfully", response.messageId);
    return true;
  } catch (error) {
    console.error("Welcome email error:", error.message);
    console.log(`🎉 Welcome message for ${name} (${email})`);
    return false;
  }
};

module.exports = { sendVerificationEmail, sendWelcomeEmail };
