const Flight = require("../models/flight");
const { validationResult } = require("express-validator");

const HttpError = require("../models/http-error");

const addFlight = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const message = errors.errors[0].msg;
    return res.status(400).json({ message: message });
  }
  const { airline, flightNumber, from, to, date, fare } = req.body;

  const newFlight = Flight({
    airline,
    flightNumber,
    from,
    to,
    date,
    fare,
  });

  try {
    await newFlight.save();
    return res.status(201).json({ message: "Flight added!" });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Something went wrong, Please try again" , err:err});
  }
};

const getFlights = (req, res) => {
  Flight.find()
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
  const from = req.body.from;
  const to = req.body.to;
  const startDate = Date.parse(req.body.date);
  const endDate = startDate + 24 * 60 * 60 * 1000;
  Flight.find({ from, to, date: { $gte: startDate, $lt: endDate } })
    .exec()
    .then((flights) => res.status(200).json(flights))
    .catch((err) => res.status(500).json("Error: " + err));
};

const updateFlight = (req, res) => {
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
  getFlight
};
