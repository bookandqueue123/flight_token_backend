let Booking = require("../models/booking");
let User = require("../models/users");
let Flight = require("../models/flight");
let Payment = require("../models/payment");
const jwt = require("jsonwebtoken");
const axios = require("axios");

var customId = require("custom-id");

const addNewBooking = async (req, res, next) => {
  const flightId = req.body.flightId;
  const flight = await Flight.findById(flightId);
  const user = await User.findById(req.userData.userId);
  if (!flight) {
    return res.status(404).json({ message: "Flight not found" });
  }

  let bookingId = customId({
    name: flight.from + flight.to + flight.airline,
    email: user.firstName + user.lastName,
  });
  user.flights.push(flight);
  await user.save();
  const newBooking = new Booking({ bookingId, flight, user });
  try {
    const booking = await newBooking.save();
    return res.status(201).json(booking);
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ message: "Something went wrong, Please try again" });
  }
};

const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({user:req.userData.userId}).populate("flight");
    return res.status(200).json(bookings);
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ message: "Something went wrong, Please try again" });
  }
};

const getABooking = async (req, res, next) => {
  const { bookingId } = req.params;
  try {
    const booking = await Booking.findById(bookingId).populate("flight");

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    return res.status(200).json(booking);
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ message: "Something went wrong, Please try again" });
  }
};

const cancelBooking = async (req, res, next) => {
  const { bookingId } = req.params;
  const booking = await Booking.findById(bookingId);
  if (!booking) {
    return res.status(404).json({ message: "Booking not found" });
  }
  const userId = booking.user;
  const flightId = booking.flight;

  if (userId.toString() !== req.userData.userId)
    return res
      .status(404)
      .json({ message: "User cannot perform this operation" });

  try {
    const result = await Booking.findByIdAndDelete(bookingId);
    const user = await User.findById(userId);
    const flight = await Flight.findById(flightId);
    user.flights.pull(flight);
    await user.save();
    res.status(200).json(result);
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ message: "Something went wrong, Please try again" });
  }
};

const getUserBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ user: req.userData.userId })
      .populate("flight")
      .populate("user");
    return res.status(200).json(bookings);
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ message: "Something went wrong, Please try again" });
  }
};

//forPayment

const paystack = axios.create({
  baseURL: "https://api.paystack.co",
  headers: {
    Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
    "Content-Type": "application/json",
  },
});

const pay = async (req, res) => {
  try {
    const { amount, flightId } = req.body;
    const user = await User.findById(req.userData.userId);
    if (!user) return res.status(404).json({ message: "No user found" });

    //create paystack payment request
    const { data } = await paystack.post("/transaction/initialize", {
      email: user.email,
      amount: amount * 100,
      metadata: {
        paymentId: flightId,
      },
    });
    // Return payment URL to client
    res.json({ url: data.data.authorization_url });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const webhook = async (req, res) => {
  console.log(req.body);
  const secret = process.env.PAYSTACK_SECRET_KEY;
  const hash = req.headers["x-paystack-signature"];
  // Verify request signature
  const hmac = crypto.createHmac("sha512", secret);
  hmac.update(JSON.stringify(req.body));
  const digest = hmac.digest("hex");
  if (digest !== hash) {
    console.error("Invalid webhook signature");
    res.status(400).send("Invalid signature");
    return;
  }
}

module.exports = {
  addNewBooking,
  getAllBookings,
  getABooking,
  cancelBooking,
  getUserBookings,
  pay,
  webhook
};
