const mongoose = require("mongoose");

const reminderSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  action: { type: Object, required: true }, // Contains task and schedule
  // isCompleted: { type: Boolean, default: false },
  // createdAt: { type: Date, default: Date.now }, // Track creation time
});

module.exports = mongoose.model("Reminder", reminderSchema);
