//to search for flights
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//flight model

const FlightSchema = new Schema({
    AirlineName: {
        type: String
    },
    flightType: {
        //economy, business or first class
        type: String
    },
    flightNumber: {
        type: String
    },
    departureAirport: {
        type: String
    },
    arrivalAirport: {
        type: String
    },
    totalSeats: {
        type: String
    },
    availableSeats: {
        type: String
    },
    pricePerSeat: {
        type: String
    },
    travelDate: {
        type: Date
    }
}, {collection: "flights"})

module.exports = mongoose.model('flight', FlightSchema)