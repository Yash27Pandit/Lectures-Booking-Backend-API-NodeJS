const asyncHandler = require("express-async-handler");
const Appointment = require("../models/AppointmentModel");
const Availability = require("../models/AvailabilityModel");

//Student Books Appointment
const bookingAppointment = asyncHandler(async (req, res) => {
    if (req.user.role !== "student") return res.status(403).json({ error: "Access denied" });
    const {professorId, slotId } = req.body;
    if(!professorId || !slotId) {
        res.status(400);
        throw new Error("All fields are mandatory");
    }
    try {
        // Check if the slot and professor exists
        const existingSlot = await Availability.findOne({slotId});
        const existingProfessor = await Availability.findOne({professorId});

        if (!existingSlot) {
            return res.status(404).json({ error: "Slot not found" });
        }

        if (!existingProfessor) {
            return res.status(404).json({ error: "professor id not found" });
        }


        // Check if the slot is already booked
        if (existingSlot.isBooked) {
            return res.status(400).json({ message: "Slot is already booked" });
        }

        const appointment = new Appointment({ studentId: req.user.id, studentName: req.user.name, slotId, professorId });
        await appointment.save();
        
        // Mark the slot as booked
        existingSlot.isBooked = true;
        await existingSlot.save();
        res.json({ message: "Appointment booked" , appointment});

    } catch (error) {
        console.error("Error booking appointment:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

//Student see the appointments
const studentAppointments = asyncHandler(async (req, res) => {
    if (req.user.role !== "student") return res.status(403).json({ error: "Access denied" });
    const appointments = await Appointment.find({ studentId: req.user.id });
    if (appointments.length === 0){
        res.json({message:"No pending appointments"})
    }
    const slotIds = appointments.map(appointment => appointment.slotId);
    const details = await Availability.find({ slotId: { $in: slotIds } });
    res.json({ appointments, AboveAppointmentDetails: details });
});

//Professor can see appointments
const professorAppointments = asyncHandler(async (req, res) => {
    if (req.user.role !== "professor") {
        return res.status(403).json({ error: "Access denied" });
    }
    const appointments = await Appointment.find({ professorId: req.user.id });
    const slotIds = appointments.map(appointment => appointment.slotId);
    const details = await Availability.find({ slotId: { $in: slotIds } });
    res.json({ appointments, AboveAppointmentDetails: details });
});

//professor delete or cancel the appointments
const appointmentCancel = asyncHandler(async (req, res) => {
    if (req.user.role !== "professor") return res.status(403).json({ error: "Access denied" });


    //making isbooked again false
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
        return res.status(404).json({ error: "Appointment not found" });
    }

    await Availability.findOneAndUpdate(
        { slotId: appointment.slotId },
        { isBooked: false }
    );
    //delete appointment
    await Appointment.findByIdAndDelete(req.params.id);
    res.json({ message: "Appointment canceled and slot is again available" });
});


module.exports = {bookingAppointment, studentAppointments, professorAppointments, appointmentCancel}