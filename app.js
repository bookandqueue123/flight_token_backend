const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");
const axios = require("axios")
const authRoutes = require("./routes/auth-routes");
const adminRoutes = require("./routes/admin-routes");
const flightRoutes = require("./routes/flight-routes");
const bookingRoutes = require("./routes/booking-routes");
const paymentRoutes = require("./routes/payment-routes");





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



app.use(authRoutes);
app.use("/api/admin",adminRoutes);
app.use("/api/flight",flightRoutes);
app.use("/api/booking",bookingRoutes);
app.use("/api/pay",paymentRoutes);





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
  .connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zchdj.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`,
    {
      useNewUrlParser: true, useUnifiedTopology: true
      // maxPoolSize: 5,
    }
  ).then(() => {
   app.listen(process.env.PORT || 5000);
    
  })
  .catch((err) => {
    console.log(err);
  });


  // `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zchdj.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`,
