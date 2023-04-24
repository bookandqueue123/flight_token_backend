let Booking = require("../models/booking");
let User = require("../models/users");
let Flight = require("../models/flight");

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
    const bookings = await Booking.find().populate("flight").populate("user");
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
    const booking = await Booking.findById(bookingId);

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
    res.status(200).json({ success: "true" });
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

module.exports = {
  addNewBooking,
  getAllBookings,
  getABooking,
  cancelBooking,
  getUserBookings,
};
