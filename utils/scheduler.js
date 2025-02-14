const cron = require("node-cron");

const scheduleReminders = async (schedule) => {
  const {
    patientId,
    cron: cronExpression,
    requiredNumberOfCheckIns,
    task,
  } = schedule;

  cron.schedule(cronExpression, async () => {
    const scheduleData = await ReminderSchedule.findOne({ patientId });

    if (!scheduleData) return;

    // If it's not indefinite and the required check-ins are completed, stop scheduling
    if (
      scheduleData.requiredNumberOfCheckIns !== "indefinite" &&
      scheduleData.checkInsCompleted >=
        parseInt(scheduleData.requiredNumberOfCheckIns)
    ) {
      console.log(`Reminder schedule for patient ${patientId} has ended.`);
      return;
    }

    console.log(`Sending reminder to patient ${patientId}`);

    // Create a reminder (not needed if reminders are just sent directly)
    await new Reminder({ patientId, action: task }).save();
  });
};

module.exports = { scheduleReminders };
