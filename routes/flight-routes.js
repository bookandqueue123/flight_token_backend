const express = require("express");
const { check } = require("express-validator");

const adminController = require("../controller/flight-controller");
const auth = require("../middleware/auth");

const router = express.Router();

router.post(
  "/",
  [
    check("airline").not().isEmpty().withMessage("Airline is required"),
    check("flightNumber")
      .not()
      .isEmpty()
      .withMessage("flight number is required"),
    check("from").not().isEmpty().withMessage("origin is required"),

    check("to").not().isEmpty().withMessage("destination is required"),

    check("date").not().isEmpty().withMessage("date is required"),
    check("fare").not().isEmpty().withMessage("fare is required"),
  ],
  adminController.addFlight
);

router.get("/", adminController.getFlights),
router.get("/:id", adminController.getFlight),

router.post("/search", adminController.searchFlight)
router.patch("/:id", adminController.updateFlight)
router.delete("/:id", adminController.deleteFlight)



module.exports = router;
