const express = require("express");
const { check } = require("express-validator");
const fileUpload = require("../middleware/file-upload");

const userController = require("../controller/auth-controller");
const { isResetTokenValid } = require("../middleware/user");
const auth = require("../middleware/auth");

const router = express.Router();

router.post(
  "/signup",
  fileUpload.uploadImage,
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
    check("fullname").not().isEmpty().withMessage("Fullname is required"),
    check("phone_number")
      .not()
      .isEmpty()
      .withMessage("phone number is required")
      .isMobilePhone()
      .withMessage("Valid Phone Number is required"),
    check("nationality").not().isEmpty().withMessage("Nationality is required"),
    check("id_number").not().isEmpty().withMessage("ID Number is required"),
    check("passport_number")
      .not()
      .isEmpty()
      .withMessage("Passport Number is required")
      .matches(/^[A-Z]{1}[0-9]{7}$/)
      .withMessage("Enter a valid passport number")

      ,
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
  fileUpload.uploadPassport,
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
    check("pin").not().isEmpty().withMessage("pin is required"),

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