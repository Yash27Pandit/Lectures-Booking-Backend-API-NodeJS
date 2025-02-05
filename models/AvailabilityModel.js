const mongoose = require("mongoose");

const AvailabilitySchema = new mongoose.Schema({
    professorName: { type: String, required: true },
    professorId: {type: mongoose.Schema.Types.ObjectId},
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    slotId:{ type: String, required: true},
    isBooked: {type: Boolean, default: false}
});

module.exports = mongoose.model("Availability", AvailabilitySchema);