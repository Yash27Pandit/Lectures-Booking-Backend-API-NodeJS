const express = require("express");
const { setAvailability, seeAvailability } = require("../controllers/availabilityController");
const authentication = require("../middleware/authentication");
const router = express.Router();

//professor can set slots
router.post("/",authentication, setAvailability);
//professor and student can see available slots
router.get("/:professorName", seeAvailability);

module.exports = router;