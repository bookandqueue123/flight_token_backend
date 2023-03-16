const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

var Grid = require("gridfs-stream");
const { isValidObjectId } = require("mongoose");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const crypto = require("crypto");
const HttpError = require("../models/http-error");

const User = require("../models/users");
const VerificationToken = require("../models/verificationToken");
const ResetToken = require("../models/resetToken");
dotenv.config();
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require("twilio")(accountSid, authToken);

const connection = mongoose.connection;

const {
  transporter,
  verifyEmailTemplate,
  forgotEmailTemplate,
  passwordSetTemplate,
  verifiedTemplate,
  generateOTP,
} = require("../util/email");

let gfs;

let bucket;
connection.once("open", () => {
  bucket = new mongoose.mongo.GridFSBucket(connection, {
    bucketName: "resources", // Override the default bucket name (fs)
    chunkSizeBytes: 1048576, // Override the default chunk size (255KB)
  });
});

// Register New USER
const signup = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const message = errors.errors[0].msg;
    return res.status(400).json({ message: message });
  }

  const {
    username,
    email,
    password,
    fullname,
    nationality,
    passport_number,
    id_number,
    phone_number
  } = req.body;
  if (!req.file) return res.status(422).json({ message: "No Image Provided" });
  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    return res.status(500).json({ message: " Signing Up Failed" });
  }

  if (existingUser) {
    return res.status(422).json({ message: "User Already Exist" });
  }

  const user = User({
    username,
    email,
    password,
    fullname,
    nationality,
    passport_number,
    id_number,
    image: req.file.id,
    phone_number
  });

  user
    .save()
    .then((user) => {
      const randomBytes = generateOTP();

      const token = VerificationToken({
        userId: user._id,
        token: randomBytes,
      });

      token.save().then(async () => {
        const mailOptions = verifyEmailTemplate(user, randomBytes);

        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            return res
              .status(500)
              .json({ message: "Error sending email", error });
          } else {
            return res.status(201).json({
              message: `${user.fullname} a verification code has been sent to ${user.email}`,
            });
          }
        });
      });
    })
    .catch((e) => {
      return res.status(500).json({
        message: "Couldn't create User, Please Try Again",

        error: e,
      });
    });
};

//Login

const login = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const message = errors.errors[0].msg;
    return res.status(400).json({ message: message });
  }
  const { email, password } = req.body;
  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Login failed , please try again " });
  }

  if (!existingUser) {
    return res
      .status(404)
      .json({ message: "Invalid Credentials, could not log you in" });
  }

  let isValidPassword = false;
  try {
    isValidPassword = await existingUser.comparePassword(password);
  } catch (err) {
    return res.status(500).json({
      message: "Something went wrong, could not log you in. Please try again",
    });
  }

  if (!isValidPassword) {
    return res
      .status(403)
      .json({ message: "Invalid Credentials, could not log you in" });
  }
  if (!existingUser.isVerified) {
    return res
      .status(403)
      .json({ message: "Please Verify your email then Login" });
  }

  if (existingUser.status === "pending") {
    return res
      .status(403)
      .json({ message: "Please complete your registration then Login" });
  }

  let token;
  try {
    token = jwt.sign(
      {
        userId: existingUser.id,
        role: existingUser.role,
        username: existingUser.username,
      },
      process.env.JWT_KEY
    );
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Logging Failed, Please try again" });
  }

  return res.status(202).json({
    message: `Login Sucessful`,
    userObject: { userId: existingUser.id, role: existingUser.role },
    token: token,
  });
};

// Verification of Email
const verifyEmail = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const message = errors.errors[0].msg;
    return res.status(400).json({ message: message });
  }
  const { email, otp } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: "User not found" });

  if (user.isVerified) res.json({ message: "User has already been verified" });
  let token;
  try {
    token = await VerificationToken.findOne({ userId: user._id });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Something went wrong. Please Try again" });
  }

  if (!token)
    return res.status(403).json({
      message: "Either your token has expired or it invalid",
    });

  const isMatched = await token.compareToken(otp);
  if (!isMatched) return res.json({ message: "Please provide a valid token" });

  user.isVerified = true;
  user.status = "pending";

  await VerificationToken.findByIdAndDelete(token._id);
  await user.save();

  const mailOptions = verifiedTemplate(user);
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.status(500).json({ message: "Error sending email", error });
    }
  });
  res.status(200).json({
    message: `${user.fullname}, your email has been sucessfully verified. `,
  });
};
const uploadPassport = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const message = errors.errors[0].msg;
    return res.status(400).json({ message: message });
  }
  const { email} = req.body;
  if (!req.file) return res.status(422).json({ message: "No Image Provided" });

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: "User not found" });
  if (!user.isVerified)
    return res.status(404).json({ message: "Please go and verify your email" });
    
  if (req.fileValidationError) {
    return res.status(422).json({ message: req.fileValidationError });
  }
  
 user.passportImage = req.file.id;
  
  user.save();

  res.status(201).json({ message: "File Uploaded Sucessfully" });
};



const setPin = async (req,res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const message = errors.errors[0].msg;
    return res.status(400).json({ message: message });
  }
  const { email, pin } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: "User not found" });
  if (!user.isVerified)
    return res.status(404).json({ message: "Please go and verify your email" });
    
    let hashedPin;
  try {
    hashedPin = await bcrypt.hash(pin, 12);
  } catch (err) {
    return next(Http.HttpError1("Something went wrong, Please try again", 500));
  }
  user.pin = hashedPin;
  user.status = "confirmed";
  user.save();

  res.status(201).json({ message: "Pin sucessfully set, Please Login" });
}

// const generatePhoneOTP = (req, res, next) => {
//   const errors = validationResult(req);

//   if (!errors.isEmpty()) {
//     const message = errors.errors[0].msg;
//     return res.status(400).json({ message: message });
//   }
//   // client.verify.v2.services.create({ friendlyName: 'phoneVerification' , codeLength: 4})
//   // .then(service => console.log(service.sid))
//   const { phone_number } = req.body;

//   client.verify.v2
//     .services(`${process.env.TWILIO_SERVICE}`)
//     .verifications.create({
//       to: `${phone_number}`,
//       channel: "sms",
//     })
//     .then((message) => {
//       // console.log(message)
//       return next(
//         HttpError(
//           `A verification code has been sent to ${phone_number}, code expires after 10minutes`,
//           200
//         )
//       );
//     })
//     .catch((error) => {
//       console.error(error);

//       return next(HttpError(`Something went wrong , Please try again`, 500));
//     });
// };

// const verifyPhoneOTP = (req, res, next) => {
//   const errors = validationResult(req);

//   if (!errors.isEmpty()) {
//     const message = errors.errors[0].msg;
//     return res.status(400).json({ message: message });
//   }

//   const { phone_number, code } = req.body;
//   client.verify.v2
//     .services(`${process.env.TWILIO_SERVICE}`)
//     .verificationChecks.create({ to: `${phone_number}`, code: `${code}` })
//     .then((verification_check) => {
//       if (verification_check.status === "approved")
//         return next(HttpError(`Your phone number has been verified`, 200));

//       return next(
//         HttpError(
//           `Could not verify your phone number, your code might be invalid or expired `,
//           422
//         )
//       );
//     })
//     .catch((error) => {
//       console.error(error);

//       return next(
//         HttpError(
//           `Something went wrong could not verify your phone number, please try again`,
//           500
//         )
//       );
//     });
// };

















const resendEmailToken = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const message = errors.errors[0].msg;
    return res.status(400).json({ message: message });
  }
  let user;
  try {
    user = await User.findOne({ email: req.body.email });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Something went wrong, Please try again" });
  }

  if (!user) return res.status(404).json({ message: "User not found" });
  if (user.isVerified)
    return res.status(203).json({
      message: "Your email has already been verified",
    });

  const randomBytes = generateOTP();

  const token = VerificationToken({
    userId: user._id,
    token: randomBytes,
  });

  token
    .save()
    .then(async () => {
      const mailOptions = verifyEmailTemplate(user, randomBytes);

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          return res
            .status(500)
            .json({ message: "Error sending email", error });
        } else {
          return res.status(201).json({
            message: `${user.fullname} a verification code has been sent to ${user.email}`,
          });
        }
      });
    })
    .catch((e) => {
      return res.status(500).json({
        message: "Something went wrong, Please Try Again",

        error: e,
      });
    });
};

const forgotPassword = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const message = errors.errors[0].msg;
    return res.status(400).json({ message: message });
  }
  const email = req.body.email;
  let user;
  let token = crypto.randomBytes(16).toString("hex");

  try {
    user = await User.findOne({ email });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Something went wrong, Please try again" });
  }
  if (!user) {
    return res.status(404).json({ message: "User does not exist" });
  }

  const oldToken = await ResetToken.findOne({ userId: user.id });
  if (oldToken) await oldToken.deleteOne();

  const resetToken = ResetToken({ userId: user.id, token: token });

  resetToken
    .save()
    .then(() => {
      const resetLink = `http://localhost:3000/reset-password?userId=${user.id}&token=${token}`;
      const mailOptions = forgotEmailTemplate(user, resetLink);

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          return res
            .status(500)
            .json({ message: "Error sending email", error });
        } else {
          return res.status(201).json({
            message: `A password reset email has been sent to ${user.email}`,
          });
        }
      });
    })

    .catch((e) => {
      return res.status(500).json({ message: "Couldn't save User ", error: e });
    });
};

const resetPassword = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const message = errors.errors[0].msg;
    return res.status(404).json({ message: message });
  }
  let user;

  const newPassword = req.body.password;

  try {
    user = await User.findOne(req.user._id);
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Something went wrong, Please try again" });
  }
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // let hashedPassword;
  // try {
  //   hashedPassword = await bcrypt.hash(newPassword, 12);
  // } catch (err) {
  //   return res
  //     .status(422)
  //     .json({ message: "Couldn't create User, Please Try Again", e: err });
  // }

  // user.password = hashedPassword;

  const samePass = await user.comparePassword(newPassword);
  if (samePass)
    return res.status(403).json({
      message: `New Password must be different`,
    });

  user.password = newPassword.trim();

  user
    .save()
    .then((user) => {
      ResetToken.findOneAndDelete({ userId: user.id }).then(() => {
        const mailOptions = passwordSetTemplate(user);
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            return res
              .status(500)
              .json({ message: "Error sending email", error });
          } else {
            return res.status(200).json({
              message: `${user.first_name} ${user.last_name} your password has been resetted sucessfully`,
            });
          }
        });
      });
    })
    .catch((e) => {
      return res
        .status(500)
        .json({ message: "Couldn't Reset password", error: e });
    });
};

const getLoggedUser = (req, res) => {
  const userId = req.userData.userId;
  User.findById(userId, " email first_name last_name phone_number company  dob")
    .then((user) => {
      if (!user) return res.status(404).json({ message: "No user found" });
      return res.status(200).json(user);
    })
    .catch(() => {
      return res
        .status(500)
        .json({ message: "Someting went wrong!.. please try again." });
    });
};

const editProfile = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const message = errors.errors[0].msg;
    return res.status(400).json({ message: message });
  }
  const { first_name, last_name, email, phone_number, organization, dob } =
    req.body;

  let editedUser;
  try {
    editedUser = await User.findByIdAndUpdate(
      req.userData.userId,
      {
        $set: {
          first_name,
          last_name,
          email,
          phone_number,
          company: organization,
          dob,
        },
      },
      { new: true }
    );
  } catch (err) {
    return res
      .status(500)
      .json({ message: " Something went Please try again" });
  }

  if (!editedUser) {
    return res.status(404).json({ message: "User does not exist" });
  }

  return res
    .status(201)
    .json({ message: " Your profile has been sucessfully edited" });
};

module.exports = {
  signup,
  verifyEmail,
  login,
  forgotPassword,
  resetPassword,
  editProfile,
  resendEmailToken,
  getLoggedUser,
  uploadPassport,
  setPin}
//   generatePhoneOTP,
//   verifyPhoneOTP,
// };
