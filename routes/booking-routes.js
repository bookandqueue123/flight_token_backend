const express = require('express')
const bookingController = require('../controller/booking-controller')
const auth = require("../middleware/auth")
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require('uuid');

const {check} = require("express-validator");
uuidv4(); 


const router = express.Router()

router.post('/', auth, bookingController.addNewBooking)
router.get('/', auth,bookingController.getAllBookings)
router.get('/:bookingId', auth, bookingController.getABooking)
router.delete('/:bookingId', auth, bookingController.cancelBooking) 

// router.post('/pay', bookingController.startPayment );
// router.post('/pay/createPayment', bookingController.createPayment );
// router.post('/pay/paymentDetails', bookingController.getPayment );
router.post("/pay/:billId",  auth, bookingController.pay )
router.post("/webhook", bookingController.webhook )


module.exports = router;