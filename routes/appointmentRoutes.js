const express = require("express");
const authentication = require("../middleware/authentication");
const { bookingAppointment, studentAppointments, professorAppointments, appointmentCancel } = require("../controllers/appointmentController");

const router = express.Router();

// Student can book appointment
router.post("/", authentication, bookingAppointment);

// Student can see appointment
router.get("/student", authentication, studentAppointments);

// professor can see appointment
router.get("/professor", authentication, professorAppointments);

// professor can cancel the appointment
router.delete("/:id", authentication, appointmentCancel);

module.exports = router;