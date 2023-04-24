const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Schema = mongoose.Schema;
const passportSchema = new Schema({
  number: {
    type: String,
  },
});

module.exports = mongoose.model("PassportNumber", passportSchema);
