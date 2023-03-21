const express = require("express");
const jwt = require("jsonwebtoken");
var mongo = require('mongodb');
const { isValidObjectId } = require("mongoose");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const { validationResult } = require("express-validator");

const User = require("../models/users");
dotenv.config();

const connection = mongoose.connection;

//GET LOGGED USER
const getLoggedUser = (req, res) => {
    const userId = req.userData.userId;
    User.findById(userId, " email username fullname phone_number ")
      .then((user) => {
        if (!user) return res.status(404).json({ message: "No user found" });
        return res.status(200).json(user);
      })
      .catch(() => {
        return res.status(500).json({ message: "Something went wrong!.. please try again." });
      });
  };

//EDIT PROFILE
const editProfile = async (req, res) => {
    const errors = validationResult(req);
  
    if (!errors.isEmpty()) {
      const message = errors.errors[0].msg;
      return res.status(400).json({ message: message });
    }
    const { username, password, fullname, email, phone_number, nationality} =
      req.body;
  
    var editedUser;
    try {
      editedUser = await User.findByIdAndUpdate(
        req.userData.userId,
        {
          $set: {
            username,
            email,
            fullname,
            phone_number,
            nationality,
          },
        },
        { new: true }
      );
    } catch (err) {
      return res
        .status(500)
        .json({ message: " Something went Please try again" });
    }
  
    if (!editedUser) {
      return res.status(404).json({ message: "User does not exist" });
    }
  
    return res
      .status(201)
      .json({ message: " Your profile has been sucessfully edited" });
  };

  module.exports = {
    editProfile,
    getLoggedUser
  }