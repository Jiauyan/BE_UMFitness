const express = require("express");
const router = express.Router();

const trainingClassBookingController = require("../controllers/trainingClassBookingController");

router.post("/addTrainingClassBooking", trainingClassBookingController.addTrainingClassBooking);
router.get("/getAllTrainingClassBookingsByUID/:uid", trainingClassBookingController.getAllTrainingClassBookingsByUID);
router.delete("/deleteTrainingClassBooking/:id", trainingClassBookingController.deleteTrainingClassBooking);
router.get("/getAllBookingsById/:id", trainingClassBookingController.getAllBookingsById);
router.get("/getBookingById/:id", trainingClassBookingController.getBookingById);
router.post("/updateBooking/:id", trainingClassBookingController.updateBooking);

module.exports = router;