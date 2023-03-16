const multer = require("multer");
const mongoose = require("mongoose");
const crypto = require('crypto');
const path = require('path');

const dotenv = require("dotenv");
const { GridFsStorage } = require("multer-gridfs-storage");
dotenv.config();


// const connection = mongoose.createConnection(
//   `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zchdj.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`,
//   { useNewUrlParser: true, useUnifiedTopology: true, }
// );


const connection = mongoose.connection

const storageImage = new GridFsStorage({
  db: connection,
  file: (req, file) => {

    return {
    // filename: `${file.originalname}_${Date.now()}`, // Override the default filename
    filename: file.originalname, // Override the default filename
    bucketName: "image", // Override the default bucket name (fs)
    chunkSize: 500000, // Override the default chunk size (255KB)
    // metadata: {
    //   uploadedBy: req.userData.userId,
    //   username: req.userData.username,  
    // }, // Attach any metadata to the uploaded file
  }},
});
const storagePassport = new GridFsStorage({
  db: connection,
  file: (req, file) => {
   
    return {
    // filename: `${file.originalname}_${Date.now()}`, // Override the default filename

    filename: file.originalname, // Override the default filename
    bucketName: "passport", // Override the default bucket name (fs)
    chunkSize: 500000, // Override the default chunk size (255KB)
    // metadata: {
    //   uploadedBy: req.userData.userId,
    //   username: req.userData.username,  
    // }, // Attach any metadata to the uploaded file
  }},
});
const uploadImage = multer({
  storage: storageImage,

  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpeg|jpg|png)$/)) {
      req.fileValidationError =
        "Extension not supported";
      return cb(null, false, req.fileValidationError);
    }
    cb(undefined, true);
  },
}).single("image",);


const uploadPassport = multer({
  storage: storagePassport,

  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpeg|jpg|png)$/)) {
      req.fileValidationError =
        "Extension not supported";
      return cb(null, false, req.fileValidationError);
    }
    cb(undefined, true);
  },
}).single("passport",);

module.exports = {
  uploadImage,
  uploadPassport
};

