// model/reminderModel.js
import mongoose, { Schema } from "mongoose";

const reminderSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "userstable" },
  email: String,
  message: String,
  date: Date, // date when the reminder should be sent (midnight normalized)
  isDone: { type: Boolean, default: false },
});

const Reminder = mongoose.model("reminders", reminderSchema);
export default Reminder;
