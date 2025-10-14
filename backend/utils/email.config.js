const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransporter({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: "krishna.j23@iiits.in",
    pass: "ixcj ppjr iupe awxy",
  },
});

module.exports = { transporter };
