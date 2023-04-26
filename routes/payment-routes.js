//to view the flight token
const jwt = require("jsonwebtoken");
const express = require("express");
const paymentController = require('../controller/payment-controller');
const { v4: uuidv4 } = require('uuid');

const {check} = require("express-validator");
const router = express.Router();
uuidv4(); 

router.post('/', paymentController.startPayment );
router.post('/createPayment', paymentController.createPayment );
router.post('/paymentDetails', paymentController.getPayment );

module.exports= router;

