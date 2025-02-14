const dotenv = require("dotenv");
dotenv.config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.API_KEY);

async function extractActionableSteps(notes) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const prompt = `
    Extract actionable steps from the following notes: ${notes}.
    Return a JSON with "checklist" and "plan" keys as follows:
      Checklist: Immediate one-time tasks (eg. buy a drug).
      Plan: A schedule of actions (e.g., daily reminders to take the drug for 7 days).
    
      Example response:
          {
            "checklistData": [
              "Buy medication",
            ],
            "plan": {
              "cron": "0 8 * * *",
              "task": "Take medication"
              "requiredNumberOfCheckIns": 7
            }
          }

      Explanation
          "cron" → The cron string for scheduling reminders.
          "requiredNumberOfCheckIns" → The number of times the patient must check in. If "indefinite", the reminders continue forever.
          Checklist:
            Tasks that need to be done immediately (e.g., "Buy medication").
            These are one-time tasks.
          Plan:
            Tasks that need to be done on a schedule (e.g., "Take medication daily for 7 days").
            Extract the key information and construct the appropriate cron string in cron format, for the plan.
      

`;
  const result = await model.generateContent(prompt);
  return JSON.parse(`${result.response.text().slice(7, -4)}`);
}

module.exports = { extractActionableSteps };
