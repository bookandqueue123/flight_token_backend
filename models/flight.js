const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var flightSchema = new Schema({
  airline: {
    type: String,
    required: true,
  },
  flightNumber: {
    type: String,
    required: true,
  },
  from: {
    type: String,
    required: true,
  },
  to: {
    type: String,
    required: true,
  },
  departing: {
    type: Date,
    required: true,
  },
  returning: {
    type: Date,
  },
  fare: {
    type: Number,
    required: true,
  },
  fare: {
    type: String,
  },

}, { timestamps: true });

module.exports = mongoose.model("Flight", flightSchema);
