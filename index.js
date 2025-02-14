const express = require("express");
const bcrypt = require("bcrypt");
const { extractActionableSteps } = require("./utils/llm");
const Note = require("./models/Note");
const Assignment = require("./models/Assignment");
const Reminder = require("./models/Reminder");
const User = require("./models/User");
const CheckList = require("./models/CheckList");
const ReminderSchedule = require("./models/ReminderSchedule");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Routes
app.get("/", (req, res) => {
  res.send("Hospital Backend System");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.post("/api/signup", async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    const user = new User({ name, email, password, role });
    await user.save();
    res
      .status(201)
      .json({ message: "User created successfully", userId: user._id });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(400).json({ error: "Invalid credentials" });
  }
  const token = jwt.sign(
    { userId: user._id, role: user.role },
    process.env.JWT_SECRET,
  );
  res.json({ token });
});

app.post("/api/assign-doctor", async (req, res) => {
  const { patientId, doctorId } = req.body;
  const assignment = new Assignment({ patientId, doctorId });
  await assignment.save();
  res.status(201).json({ message: "Doctor assigned successfully" });
});

app.get("/api/doctor-patients/:doctorId", async (req, res) => {
  const { doctorId } = req.params;
  const patients = await Assignment.find({ doctorId }).populate("patientId");
  res.json(patients);
});

// index.js
const { scheduleReminders } = require("./utils/scheduler");

app.post("/api/submit-notes", async (req, res) => {
  const { patientId, doctorId, content } = req.body;

  try {
    // Extract actionable steps using the LLM
    const { checklistData, plan } = await extractActionableSteps(content);
    const { cron, requiredNumberOfCheckIns, task } = plan;

    // Create checklist for the patient
    await CheckList.findOneAndUpdate(
      { patientId },
      {
        patientId,
        items: checklistData.map((item) => ({
          task: item,
          isCompleted: false,
        })),
      },
      { upsert: true, new: true },
    );

    // Delete all previous reminders and schedules for the patient
    await Reminder.deleteMany({ patientId });
    await ReminderSchedule.deleteMany({ patientId });

    // Save the new note
    const note = new Note({
      patientId,
      doctorId,
      content,
      checklistData,
      plan: { cron, requiredNumberOfCheckIns }, // Store the new schedule data
    });
    await note.save();

    // Create a new schedule for the patient
    const schedule = new ReminderSchedule({
      patientId,
      cron,
      requiredNumberOfCheckIns,
      checkInsCompleted: 0,
      task,
    });
    await schedule.save();

    // Start scheduling reminders
    scheduleReminders(schedule);

    res.status(201).json({
      message:
        "New note submitted. Old reminders & schedules deleted. New schedule created.",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/check-in", async (req, res) => {
  const { patientId } = req.body;

  try {
    const schedule = await ReminderSchedule.findOne({ patientId });

    if (!schedule) {
      return res.status(404).json({ error: "No active schedule found" });
    }

    // Update the check-in count
    schedule.checkInsCompleted += 1;
    await schedule.save();

    res.json({ message: "Check-in recorded successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/patients", async (req, res) => {
  try {
    const patients = await User.find({ role: "patient" });
    res.json(patients);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/doctors", async (req, res) => {
  try {
    const doctors = await User.find({ role: "doctor" });
    res.json(doctors);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
