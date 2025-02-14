const mongoose = require("mongoose");

const ChecklistSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: "Patient" },
  items: [
    {
      task: String,
      isCompleted: { type: Boolean, default: false },
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Checklist", ChecklistSchema);
