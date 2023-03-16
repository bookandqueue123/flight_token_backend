const nodemailer = require("nodemailer");
const dotenv = require("dotenv");

dotenv.config();

http://localhost:8000/flight-token/flightWhite.png


exports.generateOTP = () => {
  let otp = ''

  for(let i = 0; i <=3; i++) {
    const randVal = Math.round(Math.random() * 9)
    otp = otp + randVal
  }

 return otp
}

exports.transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "riliwanademola72@gmail.com",
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    // do not fail on invalid certs
    rejectUnauthorized: false
},
});

exports.verifyEmailTemplate = (user, token) => ({
  from: "Flight Token <riliwanademola72@gmail.com>",
  to: user.email,
  subject: "Email Verification",
  html: `<html>
  <head>
    <title>Email Template</title>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="x-apple-disable-message-reformatting" />
    <link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;800&display=swap" rel="stylesheet">
    <style>
      @import url("https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;800&display=swap");

      body {
        font-family: "Poppins";
      }
    </style>
  </head>
  <body style="margin: 0; padding: 0">
  <div
  style="
    font-family: 'Poppins';
    
    text-align: center;
  "
>
<img
style="width: 150px ;
height: auto"

  src="https://imgbly.com/ib/z6mDl36rJZ.png"
  alt="flight token"
/>
  <p style="margin-top: 20px;font-family: 'Poppins';">Dear, ${user.username}</p>
  <p style="margin-top: 20px;font-family: 'Poppins';">
    Your verification code is ${token}
  </p>
  
</div>

  </body>
</html>

          `,
});

exports.forgotEmailTemplate = (user, resetLink) => ({
  from: "FintechCEO <riliwanademola72@gmail.com>",
  to: user.email,
  subject: "Password Reset",
  html: `<html>
  <head>
    <title>Email Template</title>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="x-apple-disable-message-reformatting" />
   
  </head>
  <body style="margin: 0; padding: 0">
  <div
  style="
    font-family: 'Poppins';
    
    text-align: center;
  "
>
    <img
    style="width: 150px"

      src="https://ceoforum.netlify.app/assets/img/logo.png"
      alt="fintech ceo's forum"
    />
    <p style="margin-top: 20px">You requested a Password Reset</p>
    <p style="margin-top: 20px">Please click on the link and follow the process.</p>
    <div style="margin-top: 70px">
      <a
        style="
        margin: 0 auto;
        background-color: #2d4f93;
        font-size: 15px;
        text-decoration: none;
        padding: 15px 30px;
        color: white;
        display: inline-block;
        border-radius: 100px;
        font-weight: 600;
        font-family: 'Poppins';
        "
        href="${resetLink}"
        >Reset Password</a
      >
    </div>
    </div>
  </body>
</html>

        `,
});

exports.passwordSetTemplate = (user) => ({
  from: "FintechCEO <riliwanademola72@gmail.com>",
  to: user.email,
  subject: "Password Reset Sucessfully",
  html: `<html>
  <head>
    <title>Email Template</title>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="x-apple-disable-message-reformatting" />
   
  </head>
  <body style="margin: 0; padding: 0">
  <div
  style="
    font-family: 'Poppins';
    
    text-align: center;
  "
>
    <img
    style="width: 150px"

      src="https://ceoforum.netlify.app/assets/img/logo.png"
      alt="fintech ceo's forum"
    />
    <p style="margin-top: 20px">You Password has been reset sucessfully</p>
    <p style="margin-top: 20px">Now you can login with your new password</p>

    </div>
  </body>
</html>

        `,
});


exports.verifiedTemplate = (user) => ({
  from: "Flight Token<riliwanademola72@gmail.com>",
  to: user.email,
  subject: "Email verified sucessfully",
  html: `<html>
  <head>
    <title>Email Template</title>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="x-apple-disable-message-reformatting" />
   
  </head>
  <body style="margin: 0; padding: 0">
  <div
  style="
    font-family: 'Poppins';
    
    text-align: center;
  "
>
    <img
    style="width: 150px ;
    height: auto"

      src="https://imgbly.com/ib/z6mDl36rJZ.png"
      alt="flight token"
    />
    <p style="margin-top: 20px"> ${user.username}, your email has been verified.</p>
    <p style="margin-top: 20px">Thank you for connecting with us.</p>

    </div>
  </body>
</html>

        `,
});
