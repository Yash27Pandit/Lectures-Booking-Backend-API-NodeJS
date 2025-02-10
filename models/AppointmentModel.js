const mongoose = require("mongoose");

const AppointmentSchema = new mongoose.Schema({
    clientId: {type: String, required: true},
    userId: {type: String, required: true},
    slotId: {type: String, required: true},
});

module.exports = mongoose.model("Appointment", AppointmentSchema);