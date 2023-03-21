const express = require("express");
const { check } = require("express-validator");
const passport = require("passport");
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

passport.authenticate("login", async(err, user, info) => {
    try {
        if (err || !user) {
            const error = new Error("No User Found");
            console.log(err);
            return next(error);
        }
        req.login(user, { session: false }, async(error) => {
            if (error) return next(error);
            const body = {
                _id: user._id,
                name: user.name,
                email: user.email,
                gender: user.gender,
            };
            const token = jwt.sign({ user: body }, "top_secret");
            return res.json({ token });
        });
    } catch (error) {
        return next(error);
    }
})(req, res, next);

router.get("/get-user", auth, userController.getLoggedUser); 

router.patch("/edit-profile", auth, userController.editProfile); 

exports.router = router;