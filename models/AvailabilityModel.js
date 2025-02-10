const mongoose = require("mongoose");

const AvailabilitySchema = new mongoose.Schema({
    userName: { type: String, required: true },
    userId: {type: mongoose.Schema.Types.ObjectId},
    userRole: {type: String, required: true},
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    slotId:{ type: String, required: true},
    isBooked: {type: Boolean, default: false}
});

module.exports = mongoose.model("Availability", AvailabilitySchema);