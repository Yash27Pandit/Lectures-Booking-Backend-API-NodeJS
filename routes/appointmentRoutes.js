const express = require("express");
const authentication = require("../middleware/authentication");
const { bookingAppointment, studentAppointments, professorAppointments, appointmentCancel, bookingAppointmentwarden } = require("../controllers/appointmentController");

const router = express.Router();

// Student can book appointment
router.post("/", authentication, bookingAppointment);

// warden books appointment
router.post("/warden", authentication, bookingAppointmentwarden);

// Student can see appointment
router.get("/studentbookings", authentication, studentAppointments);

// professor/warden can see appointment
router.get("/bookings", authentication, professorAppointments);

// professor/warden can cancel the appointment
router.delete("/:id", authentication, appointmentCancel);

module.exports = router;