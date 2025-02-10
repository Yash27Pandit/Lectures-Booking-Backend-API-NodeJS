const asyncHandler = require("express-async-handler");
const Appointment = require("../models/AppointmentModel");
const Availability = require("../models/AvailabilityModel");
const User = require("../models/userModel");

//Student Books Appointment
const bookingAppointment = asyncHandler(async (req, res) => {
    if (req.user.role !== "student" ) return res.status(403).json({ error: "Access denied" });
    const {userId, slotId } = req.body;
    if(!userId || !slotId) {
        res.status(400);
        throw new Error("All fields are mandatory");
    }
    try {
        // Check if the slot and professor exists
        const existingSlot = await Availability.findOne({slotId});
        const existingProfessor = await Availability.findOne({userId});

        if (!existingSlot) {
            return res.status(404).json({ error: "Slot not found" });
        }

        if (!existingProfessor) {
            return res.status(404).json({ error: "professor id not found" });
        }

        // if(req.user.role !== "student"  && (existingSlot.userRole !== "professor")){
        //     return res.status(403).json({error: " only student can book appointment with professor"})
        // }


        // Check if the slot is already booked
        if (existingSlot.isBooked) {
            return res.status(400).json({ message: "Slot is already booked" });
        }

        const appointment = new Appointment({ clientId: req.user.id, slotId, userId });
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


//warden Books Appointment
const bookingAppointmentwarden = asyncHandler(async (req, res) => {
    if (req.user.role !== "warden" ) return res.status(403).json({ error: "Access denied" });
    const {userId, slotId } = req.body;
    if(!userId || !slotId) {
        res.status(400);
        throw new Error("All fields are mandatory");
    }
    try {
        // Check if the slot and warden exists
        const existingSlot = await Availability.findOne({slotId});
        const existingWarden = await Availability.findOne({userId});

        if (!existingSlot) {
            return res.status(404).json({ error: "Slot not found" });
        }

        if (!existingWarden) {
            return res.status(404).json({ error: "warden id not found" });
        }

        // if(req.user.role !== "warden"  && (existingSlot.userRole !== "warden")){
        //     return res.status(403).json({error: " only warden can book appointment with warden"})
        // }


        // Check if the slot is already booked
        if (existingSlot.isBooked) {
            return res.status(400).json({ message: "Slot is already booked" });
        }

        const appointment = new Appointment({ clientId: req.user.id, slotId, userId });
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
    if (req.user.role !== "student") {
        return res.status(403).json({ error: "Access denied" });
    }
    const appointments = await Appointment.find({ clientId: req.user.id });
    if (appointments.length === 0){
        res.json({message:"No pending appointments"})
    }

    const slotIds = appointments.map(appointment => appointment.slotId);
    const appointmentdetails = await Availability.findOne({ slotId: { $in: slotIds } });
    
    const clientdetails = appointments.map(appointment => appointment.clientId);
    const clientid = await User.findOne({_id: {$in: clientdetails}});

    const outputAppointments = appointments.map(appointments => ({
            userId: appointments.userId,
            slotId: appointments.slotId,
            clientId: appointments.clientId,
            clientname: clientid.name,
            startTime: appointmentdetails.startTime,
            endTime: appointmentdetails.endTime
      })
    );

    res.json({outputAppointments})
});

//Professor/warden can see appointments
const professorAppointments = asyncHandler(async (req, res) => {
    if (req.user.role == "student") {
        return res.status(403).json({ error: "Access denied" });
    }
    const appointments = await Appointment.find({ userId: req.user.id });

    const slotIds = appointments.map(appointment => appointment.slotId);
    const appointmentdetails = await Availability.findOne({ slotId: { $in: slotIds } });
    
    const clientdetails = appointments.map(appointment => appointment.clientId);
    const clientid = await User.findOne({_id: {$in: clientdetails}});

    const outputAppointments = appointments.map(appointments => ({
            userId: appointments.userId,
            slotId: appointments.slotId,
            clientId: appointments.clientId,
            clientname: clientid.name,
            startTime: appointmentdetails.startTime,
            endTime: appointmentdetails.endTime
      })
    );

    res.json({outputAppointments})
    
});

//professor/warden delete or cancel the appointments
const appointmentCancel = asyncHandler(async (req, res) => {
    if (req.user.role == "student") return res.status(403).json({ error: "Access denied" });


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


module.exports = {bookingAppointment, studentAppointments, professorAppointments, appointmentCancel, bookingAppointmentwarden}