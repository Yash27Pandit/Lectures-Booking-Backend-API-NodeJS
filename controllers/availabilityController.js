const asyncHandler = require("express-async-handler");

const Availability = require("../models/AvailabilityModel");

// Professor sets availablity
const setAvailability = asyncHandler(async (req, res)=> {
    if (req.user.role != "professor") {
        return res.status(403).json({error: "Access denied"});
    }

    const { startTime, endTime, slotId } = req.body;
    
    if (!startTime || !endTime || !slotId) {
        return res.status(400).json({ error: "Start time and end time are required" });
    }

    

    const availability = await Availability.create({
        professorId: req.user.id, startTime, endTime, professorName: req.user.name, slotId
    });
    return res.json({message: "Availability Set", availability});

})

// Professor review time slots
const seeAvailability = asyncHandler(async (req, res)=> {
    const slots = await Availability.find({ professorName: req.params.professorName });
    res.json({message: "Available time slots", slots})
})


module.exports = {setAvailability, seeAvailability}
