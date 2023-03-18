const router = require("express").Router();
const flight = require("../models/Flight");
const axios = require("axios");


axios.request(options).then(function (response) {
      console.log(response.data);
  }).catch(function (error) {
      console.error(error);
  });

router.get("/flights", async (req, res) =>{
    try {
        const config = {
          headers: { 'Authorization': 'Bearer YOUR_API_KEY' },
          params: {
            'origin': req.query.origin,
            'destination': req.query.destination,
            'departure_date': req.query.departure_date
          }
        };
        const response = await axios.get('https://api.flightbooking.com/flights', config);
        const data = response.data;

        // Process data and render it to the user
        res.render('flights', { data });
      } catch (error) {
        console.error(error);
        res.render('error');
      }
    });
    router.post('/', (req, res) => {

        flight.find({ 'departureAirport': req.body.departureAirport, 'arrivalAirport': req.body.arrivalAirport }).exec((err, bus) => {
            if (err) {
                res.json({ status: false, message: "error while searching" })
            }
            else res.json({ flight })
        })
    })
    
    router.post('/:id', (req, res) => {
    
        flight.findOne({ _id: req.body.bId }, (err, flight) => {
            if (err) {
                res.json({ status: false, message: "error while searching with ID" })
            }
            else
                res.json({ flight })
        })
    })