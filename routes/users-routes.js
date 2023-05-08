const express = require("express");
const { check } = require("express-validator");

//FOR THE USERS PROFILE

const userController = require("../controller/users-controller");
const { isResetTokenValid } = require("../middleware/user");
const auth = require("../middleware/auth");
const User = require("../models/users");
const router = express.Router();


//Displays information tailored according to the logged in user
router.get('/profile', (req, res, next) => {
    res.json({
        user: req.user,
        token: req.query.secret_token
    })
});

router.get("/get-user", auth, userController.getLoggedUser); 

router.patch("/edit-profile", auth, userController.editProfile); 

module.exports = router;