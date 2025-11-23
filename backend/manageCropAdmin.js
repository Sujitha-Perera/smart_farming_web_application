import mongoose from "mongoose";
import Crop from "./model/cropModel.js";
import Reminder from "./model/reminderModel.js";
import User from "./model/userModel.js";

export const getAllCropsAdmin = async (req, res) => {
  try {
    const crops = await Crop.find({}).populate("userId", "name email").sort({ createdAt: -1 });
    return res.json({ success: true, crops });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Failed to fetch crops" });
  }
};

export const updateCropAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    if (req.body.userId && !mongoose.Types.ObjectId.isValid(req.body.userId)) {
      return res.status(400).json({ success: false, message: "Invalid userId" });
    }
    const crop = await Crop.findByIdAndUpdate(id, req.body, { new: true }).populate("userId", "name email");
    if (!crop) return res.status(404).json({ success: false, message: "Crop not found" });
    return res.json({ success: true, crop });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Failed to update crop" });
  }
};

export const deleteCropAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const crop = await Crop.findByIdAndDelete(id);
    if (!crop) return res.status(404).json({ success: false, message: "Crop not found" });
    await Reminder.deleteMany({ userId: crop.userId });
    return res.json({ success: true, message: "Crop deleted" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Failed to delete crop" });
  }
};

export const getAllRemindersAdmin = async (req, res) => {
  try {
    const reminders = await Reminder.find({}).populate("userId", "name email").sort({ date: -1 });
    return res.json({ success: true, reminders });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Failed to fetch reminders" });
  }
};

export const updateReminderAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const reminder = await Reminder.findByIdAndUpdate(id, req.body, { new: true }).populate("userId", "name email");
    if (!reminder) return res.status(404).json({ success: false, message: "Reminder not found" });
    return res.json({ success: true, reminder });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Failed to update reminder" });
  }
};

export const deleteReminderAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const rem = await Reminder.findByIdAndDelete(id);
    if (!rem) return res.status(404).json({ success: false, message: "Reminder not found" });
    return res.json({ success: true, message: "Reminder deleted" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Failed to delete reminder" });
  }
};