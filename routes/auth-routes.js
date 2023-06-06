const express = require("express");
const { check } = require("express-validator");
const fileUpload = require("../middleware/file-upload");
const userController = require("../controller/auth-controller");
const auth = require("../middleware/auth");
const multer = require("multer");
const storage = multer.diskStorage({});
const upload = multer({ storage , fileFilter: function(req, file, callback) {
  if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
    return callback(new Error('Only image files are allowed!'));
  }
  callback(null, true);
}})

const router = express.Router();

router.post(
  "/signup",
  upload.single("image"),
  [
    check("username").not().isEmpty().withMessage("Username is required"),

    check("email")
      .normalizeEmail()
      .isEmail()

      .withMessage("Enter a valid Email"),
    check("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long")

      .matches(/^(?=.*[\W_])(?=.*[a-z])(?=.*[A-Z])(?!.*\s).*$/)
      .withMessage(
        "Password must contain at least one uppercase letter, one lowercase letter, and one special character"
      )

      .matches(/^[A-Z]/)
      .withMessage("Password must start with an uppercase letter"),
    check("fullname")
      .not()
      .isEmpty()
      .withMessage("Fullname is required")
      .matches(/^[a-zA-Z\s]+$/)
      .withMessage("Fullname should contain only letters and spaces"),
    check("phone_number")
      .not()
      .isEmpty()
      .withMessage("phone number is required")
      .isMobilePhone()
      .withMessage("Valid Phone Number is required"),
    check("nationality").not().isEmpty().withMessage("Nationality is required"),
    check("id_number")
      .not()
      .isEmpty()
      .withMessage("ID Number is required")
      .matches(/^[0-9]+$/)
      .withMessage("ID Number should contain only numbers"),
    check("passport_number")
      .not()
      .isEmpty()
      .withMessage("Passport Number is required")
      .matches(/^[A-Z]{1}[0-9]{7}$/)
      .withMessage("Enter a valid passport number"),
  ],
  userController.signup
);

router.post(
  "/email-verification",
  [
    check("otp").not().isEmpty().withMessage("otp is required"),

    check("email")
      .normalizeEmail()
      .isEmail()

      .withMessage("Valid email is required"),
  ],
  userController.verifyEmail
);

router.post(
  "/upload-passport",
  upload.single("passport"),
  [
    check("email")
      .normalizeEmail()
      .isEmail()

      .withMessage("Valid email is required"),
  ],
  userController.uploadPassport
);
router.post(
  "/set-pin",
  [
    check("pin")
      .not()
      .isEmpty()
      .withMessage("pin is required")
      .matches(/^[a-zA-Z0-9]+$/)
      .withMessage("PIN cannot contain special characters"),
    check("email")
      .normalizeEmail()
      .isEmail()

      .withMessage("Valid email is required"),
  ],
  userController.setPin
);
router.post(
  "/resend-email-token",
  [
    check("email")
      .normalizeEmail()
      .isEmail()

      .withMessage("Valid email is required"),
  ],
  userController.resendEmailToken
);

router.post("/login", userController.login);

//displays the users current profile

// router.get("/profile/edit", async(req,res) =>{
//   try{


//   }catch(err){
//     res.status().json({"unable to update"})
//   }

// });

router.post("/profile/edit", userController.editProfile);

module.exports = router;

// router.post(
//   "/generate-phone-otp",
//   [
//     check("phone_number")
//       .not()
//       .isEmpty()
//       .withMessage("phone number is required")
//       .isMobilePhone()
//       .withMessage("Valid Phone Number is required"),
//   ],

//   userController.generatePhoneOTP
// );
// router.post(
//   "/verify-phone-otp",
//   [
//     check("phone_number")
//       .not()
//       .isEmpty()
//       .withMessage("phone number is required")
//       .isMobilePhone()
//       .withMessage("Valid Phone Number is required"),
//     check("code")
//       .not()
//       .isEmpty()
//       .withMessage("your verification code is required"),
//   ],

//   userController.verifyPhoneOTP

// .normalizeEmail()
// .isEmail().withMessage("Enter a valid Email")
// .custom((value) => {
//   const domain = value.split('@')[1];
//   if (!['gmail.com', 'yahoo.com'].includes(domain)) {
//     throw new Error('Only Gmail and Yahoo emails are allowed');
//   }
//   return true;
