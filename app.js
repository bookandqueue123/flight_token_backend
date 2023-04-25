const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");
const axios = require("axios")
const authRoutes = require("./routes/auth-routes");
// const adminRoutes = require("./routes/admin-routes");
// const discussionRoutes = require("./routes/discussion");
const flightRoutes = require("./routes/flights-routes");
const usersRoutes = require("./routes/users-routes");
const HttpError = require("./models/http-error");
const Amadeus = require('amadeus');

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: false}))

app.use("/uploads/files", express.static(path.join("uploads", "files")));
app.use("/flight-token", express.static(path.join("uploads", "logos")));


dotenv.config();
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin,X-Requested-With,Content-Type,Accept,Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PATCH,DELETE");

  next();
});
const amadeus = new Amadeus({
    clientId: 'y5gN096ABuszGybR2rzlmm8duVvxOggq',
    clientSecret: 'iA1cNoUbqAWDpzyS',
});



// const data = new URLSearchParams( {
//   grant_type: 'client_credentials',
//   client_id: 'y5gN096ABuszGybR2rzlmm8duVvxOggq',  
//   client_secret: 'iA1cNoUbqAWDpzyS',
// })
// const getAmadeusKey = async () =>{
//   const response = await axios({
//       url: "https://test.api.amadeus.com/v1/security/oauth2/token",
//       method: 'post',
//       headers: {
//           'Content-Type': 'x-www-form-urlencoded'
//       },

//       data
//   });
//   console.log(response.data);
// }
// getAmadeusKey()
app.use('/', authRoutes);


app.use('/api/bookings', flightRoutes)
app.use('/api/user-profile', usersRoutes)
// app.use("/api/admin", adminRoutes.router);
// app.use("/api/discussion", discussionRoutes.router);
app.use(`/city-and-airport-search/:parameter`, (req, res) => {
  const parameter = req.params.parameter;
  // Which cities or airports start with the parameter variable
  amadeus.referenceData.locations
      .get({
          keyword: parameter,
          subType: Amadeus.location.any,
      })
      .then(function (response) {
          res.send(response.result);
      })
      .catch(function (response) {
          res.send(response);
      });
});
app.use((req, res, next) => {
  return res
    .status(404)
    .json({ message: "Page not found.. This route couldn't be found!" });
});

app.use((error, req, res, next) => {
  if (res.headersSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "Unknown Error" });
});

mongoose.set('strictQuery', false);
mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zchdj.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`,
    // 'mongodb://127.0.0.1:27017/Flight-token',
    {
      useNewUrlParser: true, useUnifiedTopology: true
      // maxPoolSize: 5,
    }
  ).then(() => {
   app.listen(process.env.PORT || 8000);
   console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });
  