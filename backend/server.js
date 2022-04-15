const express = require("express");
const dotenv = require("dotenv");
const mg = require("mailgun-js");

dotenv.config();

const mailgun = () => {
  mg({
    apiKey: process.env.MAILGUN_API_KEY,
    domain: process.env.MAILGUN_DOMAIN,
  });
};

const app = express();
app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

app.post("/api/email", (req, res) => {
  const { email, subject, message } = req.body;
  mailgun()
    .message()
    .send(
      {
        from: "SEJM <sejm@mg.yourdomain.com>",
        to: `${email}`,
        subject: `${subject}`,
        html: `<p>${message}</p>`,
      },
      (err, body) => {
        if (err) {
          console.log(err);
          res.status(500).send({ message: "Error in sending the email" });
        } else {
          console.log(body);
          res.send({ message: "Email sent succesfully" });
        }
      }
    );
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Server Listening at port ${port}`);
});
