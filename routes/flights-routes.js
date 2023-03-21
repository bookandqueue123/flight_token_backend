const router = require("express").Router();
const flight = require("../models/Flight");
const axios = require("axios");


axios.request(options).then(function (response) {
      console.log(response.data);
  }).catch(function (error) {
      console.error(error);
  });

  const options = {
    method: 'GET',
    url: 'https://aerodatabox.p.rapidapi.com/airports/%7BcodeType%7D/DME',
    headers: {
      'X-RapidAPI-Key': '70825555a8mshc0c2e29178aba67p15bdf5jsn81794c735890',
      'X-RapidAPI-Host': 'aerodatabox.p.rapidapi.com'
    }
  };

router.post("/flights", async (req, res) =>{
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
        res.json('flights', { data });
      } catch (error) {
        console.error(error);
        res.json('error');
      }
    });
    router.post('/', (req, res) => {

        flight.find({ 'departureAirport': req.body.departureAirport, 'arrivalAirport': req.body.arrivalAirport }).exec((err, bus) => {
            if (err) {
                res.json({ status: 500, message: "error while searching" })
            }
            else res.json({ flight })
        })
    })
    
    router.post('/:id', (req, res) => {
    
        flight.findOne({ _id: req.body.bId }, (err, flight) => {
            if (err) {
                res.json({ status: 500, message: "error while searching with ID" })
            }
            else
                res.json({ flight })
        })
    })
   
  //UPDATE
  router.put('/:id', async (req,res) => {
      
      try{
          const updatedHotel = new Hotel.findByIdAndUpdate(req.params.id, {$set: req.body}, {new: true});
          res.status(200).json(updatedHotel);
  
      }catch(err){
          res.status(500).json(err);
      };
  
  }
  );
   //DELETE
  router.delete('/:id', async (req,res) => {
      
      try{
          await Hotel.findByIdAndDelete(req.params.id);
          res.status(200).json("Hotel has been deleted.");
  
      }catch(err){
          res.status(500).json(err);
      };
  
  }
  );
 
  //GET
  router.get('/:id', async (req,res) => {
      
      try{
          const hotel = await Hotel.findById(req.params.id);
          res.status(200).json(hotel);
  
      }catch(err){
          res.status(500).json(err);
      };
  
  }
  );
  //GET-ALL
  router.get('/', async (req,res) => {
      
      try{
          const hotel = await Hotel.find();
          res.status(200).json(hotel);
  
      }catch(err){
          res.status(500).json(err);
      };
  
  }
  );
  