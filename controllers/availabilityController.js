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
        userId: req.user.id, startTime, endTime, userName: req.user.name, slotId, userRole: req.user.role
    });
    return res.json({message: "Availability Set", availability});

})

// warden sets availablity
const setAvailabilitywarden = asyncHandler(async (req, res)=> {
    if (req.user.role != "warden") {
        return res.status(403).json({error: "Access denied"});
    }

    const { startTime, endTime, slotId } = req.body;
    
    if (!startTime || !endTime || !slotId) {
        return res.status(400).json({ error: "Start time and end time are required" });
    }

    

    const availability = await Availability.create({
        userId: req.user.id, startTime, endTime, userName: req.user.name, slotId, userRole: req.user.role
    });
    return res.json({message: "Availability Set", availability});

})



// Professor and warden review time slots
const seeAvailability = asyncHandler(async (req, res)=> {
    if(req.user.role == "warden"){
    const slots = await Availability.find({ userRole: "warden" });
    res.json({message: "Available time slots", slots})
    }
    if(req.user.role !== "warden"){
    const slots = await Availability.find({ userRole: "professor" });
    res.json({message: "Available time slots", slots})
    }
})


module.exports = {setAvailability, seeAvailability, setAvailabilitywarden}
