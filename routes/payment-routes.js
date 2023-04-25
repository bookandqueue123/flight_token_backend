//to view the flight token
const jwt = require("jsonwebtoken");
const express = require("express");
const { v4: uuidv4 } = require('uuid');

const {check} = require("express-validator");
const router = express.Router();
uuidv4(); 

router.post('/book-flight', (req,res) => {

});

module.exports= router;

