const { Timestamp } = require("mongodb");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var bookingSchema = new Schema({
  bookingId: { type: String, required: true },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  flight: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Flight",
  },
}, { timestamps: true });

module.exports = mongoose.model("Booking", bookingSchema);
