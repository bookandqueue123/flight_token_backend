const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
    minLength: 6,
  },
  phone_number: {
    type: String,
    required: true,
  },
  fullname: {
    type: String,
    required: true,
  },
  image: {
    type: Schema.Types.ObjectId,

  },
  nationality: {
    type: String,
    required: true,
  },

  passport_number: {
    type: String,
    required: true,
  },

  id_number: {
    type: String,
    required: true,
  },
  passportImage: {
    type: Schema.Types.ObjectId,
  },
  pin: {
    type: String,
    // required: true,
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },

  isVerified: {
    type: Boolean,
    default: false,
  },
  status: {
    type: String,
    enum: ["pending", "confirmed"],
    
  },
  flights: [
    {
      type: Schema.Types.ObjectId,
      ref: "Flight",
    },
  ],
});

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    const hash = await bcrypt.hash(this.password, 12);
    this.password = hash;
  }

  next();
});

userSchema.methods.comparePassword = async function (password) {
  const result = await bcrypt.compare(password, this.password);
  return result;
};

module.exports = mongoose.model("User", userSchema);
