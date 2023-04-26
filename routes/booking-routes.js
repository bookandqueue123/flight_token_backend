const express = require('express')
const bookingController = require('../controller/booking-controller')
const auth = require("../middleware/auth")


const router = express.Router()

router.post('/', auth, bookingController.addNewBooking)
router.get('/', auth,bookingController.getAllBookings)
router.get('/:bookingId', auth, bookingController.getABooking)
router.delete('/:bookingId', auth, bookingController.cancelBooking) 




module.exports = router;