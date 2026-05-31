const nodemailer = require("nodemailer");

const transPorter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "hirementorai@gmail.com",
    pass: "mwzc aluu bnww mqlk",
  },
});

async function senData(to, subject, html) {
  const mailFormat = {
    from: "hirementorai@gmail.com",
    to: to,
    subject: subject,
    html: html,
  };
  await transPorter.sendMail(mailFormat, (err, info) => {
    if (err) {
      console.log(err);
    } else {
      console.log("mail sent");
    }
  });
}
module.exports = senData;
