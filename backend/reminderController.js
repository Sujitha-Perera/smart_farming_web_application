// controllers/reminderController.js
import Reminder from "./model/reminderModel.js";

//  Get all reminders with user info
export const getReminders = async (req, res) => {
  try {
    const reminders = await Reminder.find().populate("userId", "name email");
    res.json(reminders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching reminders" });
  }
};

//  Mark as done
export const markAsDone = async (req, res) => {
  try {
    const reminder = await Reminder.findByIdAndUpdate(
      req.params.id,
      { isDone: true },
      { new: true }
    );
    res.json(reminder);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error updating reminder" });
  }
};

//  Delete reminder
export const deleteReminder = async (req, res) => {
  try {
    await Reminder.findByIdAndDelete(req.params.id);
    res.json({ message: "Reminder deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error deleting reminder" });
  }
};
