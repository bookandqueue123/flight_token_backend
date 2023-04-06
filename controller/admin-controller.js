const User = require("../models/users");

const HttpError = require("../models/http-error");


const getUsers = async (req, res, next) => {
  if (req.userData.role === "user")
    return next(HttpError("You are unauthorized for this operation", 403));
  User.find(
    { status: "confirmed" },
    " usernam email phone_number fullname nationality passport_number id_number isVerified status"
  )
    .then((users) => {
      return res.status(200).json({ users });
    })
    .catch((e) => {
      return res.status(500).json({ message: "Cannot find users" });
    });
};

module.exports = {
  getUsers,
};
