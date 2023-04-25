const router = require("express").Router();
const Flight = require("../models/Flights");
const axios = require("axios");
const mongoose = require("mongoose");


// const options = {
//     method: 'GET',
//     url: 'https://aerodatabox.p.rapidapi.com/airports/%7BcodeType%7D/DME',
//     headers: {
//       'X-RapidAPI-Key': '70825555a8mshc0c2e29178aba67p15bdf5jsn81794c735890',
//       'X-RapidAPI-Host': 'aerodatabox.p.rapidapi.com'
//     }
//   };

// axios.request(options).then(function (response) {
//       console.log(response.data);
//   }).catch(function (error) {
//       console.error(error);
//   });

  

// router.post("/flights", async (req, res) =>{
//     try {
//         const config = {
//           headers: { 'Authorization': 'Bearer YOUR_API_KEY' },
//           params: {
//             'origin': req.query.origin,
//             'destination': req.query.destination,
//             'departure_date': req.query.departure_date
//           }
//         };
//         const response = await axios.get('https://api.flightbooking.com/flights', config);
//         const data = response.data;

//         // Process data and render it to the user
//         res.json('flights', { data });
//       } catch (error) {
//         console.error(error);
//         res.json('error');
//       }
//     });
    router.post('/', async (req, res) => {

       const flight = await Flight.find({ 'departureAirport': req.body.departureAirport, 'arrivalAirport': req.body.arrivalAirport }).exec((err, flight) => {
            if (err) {
                res.json({ status: 500, message: "error while searching" })
            }
            else res.json({ flight })
        })
    })
    
    router.post('/:id', async (req, res) => {
    
       await Flight.findOne({ _id: req.body.bId }, (err, flight) => {
            if (err) {
                res.json({ status: 500, message: "error while searching with ID" })
            }
            else
                res.json({ flight })
        })
    })
   
     //GET
  router.get('/:id', async (req,res) => {
      
    try{
        const flight = await Flight.findById(req.params.id);
        res.status(200).json(flight);

    }catch(err){
        res.status(500).json(err);
    };

}
);
//GET-ALL
router.get('/', async (req,res) => {
    
    try{
        const flight = await Flight.find();
        res.status(200).json(flight);

    }catch(err){
        res.status(500).json(err);
    };

}
//to search for flight
);
  //UPDATE
  router.put('/:id', async (req,res) => {
      
      try{
          const updatedFlight = await new Flight.findByIdAndUpdate(req.params.id, {$set: req.body}, {new: true});
          res.status(200).json(updatedFlight);
  
      }catch(err){
          res.status(500).json(err);
      };
  
  }
  );
   //DELETE
  router.delete('/:id', async (req,res) => {
      
      try{
          await Flight.findByIdAndDelete(req.params.id);
          res.status(200).json("flight has been deleted.");
  
      }catch(err){
          res.status(500).json(err);
      };
  
  }
  );
 
 
  module.exports = router;