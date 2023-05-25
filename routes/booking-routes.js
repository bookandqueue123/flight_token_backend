const express = require('express')
const bookingController = require('../controller/booking-controller')
const auth = require("../middleware/auth")
const {check} = require("express-validator");

const router = express.Router()

router.post('/', auth, bookingController.addNewBooking)
router.get('/', auth,bookingController.getAllBookings)
router.get('/:bookingId', auth, bookingController.getABooking)
router.delete('/:bookingId', auth, bookingController.cancelBooking) 


router.post("/pay/:billId",  auth, bookingController.pay )
router.post("/webhook", bookingController.webhook )
router.get("/token", bookingController.exchangeTokens) 


module.exports = router;