const express = require("express");
const { setAvailability, seeAvailability, setAvailabilitywarden } = require("../controllers/availabilityController");
const authentication = require("../middleware/authentication");
const router = express.Router();

//professor can set slots
router.post("/professor",authentication, setAvailability);

router.post("/warden", authentication, setAvailabilitywarden );

//professor and student can see available slots
router.get("/availableSlots", authentication, seeAvailability);

module.exports = router;