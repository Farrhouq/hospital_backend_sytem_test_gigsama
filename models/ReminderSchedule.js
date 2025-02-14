const mongoose = require("mongoose");

const ReminderScheduleSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, required: true },
  cron: { type: String, required: true },
  requiredNumberOfCheckIns: { type: String, required: true }, // "indefinite" or number
  checkInsCompleted: { type: Number, default: 0 },
  task: { type: String, required: true },
});

const ReminderSchedule = mongoose.model(
  "ReminderSchedule",
  ReminderScheduleSchema,
);

module.exports = mongoose.model("ReminderSchedule", ReminderScheduleSchema);
