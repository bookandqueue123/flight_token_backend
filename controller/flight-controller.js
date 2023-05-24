const Flight = require("../models/flight");
const { validationResult } = require("express-validator");
const dotenv = require("dotenv");
const cloudinary = require("cloudinary").v2;
const HttpError = require("../models/http-error"); 
dotenv.config();



const addFlight = async (req, res) => {
  if (req.userData.role === "user")
    return next(HttpError("You are unauthorized for this operation", 403));
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const message = errors.errors[0].msg;
    return res.status(400).json({ message: message });
  }
  const { airline, flightNumber, from, to, departing, returning, fare, type } = req.body;
  const newFlight = Flight({
    airline,
    flightNumber,
    from,
    to,
    departing, returning,
    fare,
    type
  });

  try {
    await newFlight.save();
    return res.status(201).json({ message: "Flight added!" });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Something went wrong, Please try again", err: err });
  }
};

const getFlights = (req, res) => {
  Flight.find({})
    .then((flights) => {
      return res.status(200).json(flights);
    })
    .catch((e) => {
      return res
        .status(500)
        .json({ message: "Something went wrong, Please try again" });
    });
};

const searchFlight = (req, res) => {
  const { from, to, departing, returning, type } = req.body;
  const departingDate = Date.parse(departing);
  const returningDate = returning ? Date.parse(returning) : null;
  const searchCriteria = {
    from,
    to,
    departing: { $gte: departingDate },
    ...(returningDate && { returning: { $lte: returningDate } }),
  };

  if (type === 'one-way') {
    Flight.find(searchCriteria)
      .exec()
      .then((flights) => res.status(200).json(flights))
      .catch((err) => res.status(500).json("Error: " + err));
  } else {
    Flight.find({ ...searchCriteria, returning: { $exists: true } })
      .exec()
      .then((flights) => {
        const roundTripFlights = flights.filter((flight) => {
          return Date.parse(flight.returning) >= returningDate;
        });
        res.status(200).json( roundTripFlights );
      })
      .catch((err) => res.status(500).json("Error: " + err));
  }
};

const updateFlight = (req, res) => {
  if (req.userData.role === "user")
  return next(HttpError("You are unauthorized for this operation", 403));
  const { id } = req.params;
  Flight.findByIdAndUpdate(
    id,
    {
      $set: req.body,
    },
    { new: true }
  )
    .then((flight) => {
      if (!flight) {
        return res.status(404).json({ message: "Flight not found" });
      }
      res.status(200).json({ message: "Flight updated sucessfully" });
    })
    .catch((err) =>
      res
        .status(500)
        .json({ message: "Something went wrong, Please try again" })
    );
};

const deleteFlight = (req, res) => {
  if (req.userData.role === "user")
  return next(HttpError("You are unauthorized for this operation", 403));
  const { id } = req.params;
  Flight.findByIdAndDelete(id)
    .then((flight) => {
      if (!flight) {
        return res.status(404).json({ message: "Flight not found" });
      }
      res.status(200).json({ message: "Flight deleted sucessfully" });
    })
    .catch((err) =>
      res
        .status(500)
        .json({ message: "Something went wrong, Please try again" })
    );
};

const getFlight = (req, res) => {
  const { id } = req.params;
  Flight.findById(id)
    .then((flight) => {
      if (!flight) {
        return res.status(404).json({ message: "Flight not found" });
      }
      res.status(200).json(flight);
    })
    .catch((err) =>
      res
        .status(500)
        .json({ message: "Something went wrong, Please try again" })
    );
};

module.exports = {
  addFlight,
  getFlights,
  searchFlight,
  updateFlight,
  deleteFlight,
  getFlight,
};
