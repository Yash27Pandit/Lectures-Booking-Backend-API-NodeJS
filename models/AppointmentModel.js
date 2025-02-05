const mongoose = require("mongoose");

const AppointmentSchema = new mongoose.Schema({
    studentId: {type: mongoose.Schema.Types.ObjectId},
    studentName: {type: String, required: true},
    professorId: {type: String, required: true},
    slotId: {type: String, required: true},
});

module.exports = mongoose.model("Appointment", AppointmentSchema);