// controllers/cropController.js
import mongoose from "mongoose";
import Crop from "./model/cropModel.js";
import Reminder from "./model/reminderModel.js";
import User from "./model/userModel.js";

/**
 * Helper: generate array of event dates from start->end with gapDays inclusive
 * startStr/endStr can be Date or ISO string
 */
const generateDatesBetween = (startStr, endStr, gapDays) => {
  const results = [];
  if (!startStr || !endStr || !gapDays || gapDays <= 0) return results;
  const start = new Date(startStr);
  const end = new Date(endStr);
  if (isNaN(start) || isNaN(end) || start > end) return results;

  // normalize to midnight
  start.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);

  let cur = new Date(start);
  while (cur <= end) {
    results.push(new Date(cur));
    cur = new Date(cur);
    cur.setDate(cur.getDate() + gapDays);
  }
  return results;
};

/**
 * Normalize a date to midnight (returns new Date)
 */
const midnite = (d) => {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
};

// ➕ Add crop and create reminders automatically
export const addCrop = async (req, res) => {
  try {
    const {
      userId,
      cropType,
      landArea,
      soilType,
      cropGrowingDate,
      expectedHarvestDate,
      // either arrays OR frequencies (days)
      wateringDates = null, // array of dates (optional)
      fertilizerDates = null, // array of dates (optional)
      wateringFrequency = null, // number of days (optional)
      fertilizerFrequency = null, // number of days (optional)
    } = req.body;

    // Validate userId
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        message:
          "Invalid or missing userId. Must be a valid MongoDB ObjectId.",
      });
    }

    // Ensure user exists
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Validate main dates
    if (!cropGrowingDate || !expectedHarvestDate) {
      return res.status(400).json({ message: "Provide cropGrowingDate and expectedHarvestDate" });
    }
    const grow = new Date(cropGrowingDate);
    const harvest = new Date(expectedHarvestDate);
    if (isNaN(grow) || isNaN(harvest) || grow > harvest) {
      return res.status(400).json({ message: "Invalid growing/harvest dates" });
    }

    // Decide watering/fertilizer arrays:
    // - if arrays are provided, use them (coerce to Date)
    // - else if frequency provided, generate sequences from grow->harvest
    let finalWateringDates = [];
    let finalFertilizerDates = [];

    if (Array.isArray(wateringDates) && wateringDates.length) {
      finalWateringDates = wateringDates
        .map((d) => {
          const x = new Date(d);
          return isNaN(x) ? null : midnite(x);
        })
        .filter(Boolean);
    } else if (wateringFrequency) {
      finalWateringDates = generateDatesBetween(grow, harvest, parseInt(wateringFrequency));
    }

    if (Array.isArray(fertilizerDates) && fertilizerDates.length) {
      finalFertilizerDates = fertilizerDates
        .map((d) => {
          const x = new Date(d);
          return isNaN(x) ? null : midnite(x);
        })
        .filter(Boolean);
    } else if (fertilizerFrequency) {
      finalFertilizerDates = generateDatesBetween(grow, harvest, parseInt(fertilizerFrequency));
    }

    // Create the crop (store the generated arrays)
    const crop = await Crop.create({
      userId,
      cropType,
      landArea,
      soilType,
      cropGrowingDate: midnite(grow),
      expectedHarvestDate: midnite(harvest),
      wateringDates: finalWateringDates,
      fertilizerDates: finalFertilizerDates,
    });

    // create reminders helper: reminder date = eventDate - 1 day
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const addReminderIfNew = async (eventDate, message) => {
      if (!eventDate) return;
      const ev = new Date(eventDate);
      if (isNaN(ev)) return;
      // reminder is one day before event
      const rdate = midnite(new Date(ev.getTime()));
      rdate.setDate(rdate.getDate() - 1);

      // skip reminders scheduled in the past
      if (rdate < today) return;

      // avoid duplicates (userId + message + date)
      const exists = await Reminder.findOne({
        userId,
        message,
        date: rdate,
      });
      if (!exists) {
        await Reminder.create({
          userId,
          email: user.email,
          message,
          date: rdate,
        });
      }
    };

    // water reminders
    for (const ev of finalWateringDates) {
      await addReminderIfNew(ev, `Water your ${cropType}`);
    }

    // fertilizer reminders
    for (const ev of finalFertilizerDates) {
      await addReminderIfNew(ev, `Apply fertilizer for ${cropType}`);
    }

    // harvest reminder (one event)
    await addReminderIfNew(expectedHarvestDate, `Harvest your ${cropType}`);

    res.status(201).json({ message: "Crop added & reminders created", crop });
  } catch (err) {
    console.error("Error in addCrop:", err);
    res.status(500).json({ error: "Error adding crop" });
  }
};

// 📜 Get all crops
export const getAllCrops = async (req, res) => {
  try {
    const crops = await Crop.find().populate("userId", "name email");
    res.json(crops);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching crops" });
  }
};

// ✏️ Update crop
export const updateCrop = async (req, res) => {
  try {
    const updated = await Crop.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error updating crop" });
  }
};

// ❌ Delete crop
export const deleteCrop = async (req, res) => {
  try {
    await Crop.findByIdAndDelete(req.params.id);
    res.json({ message: "Crop deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error deleting crop" });
  }
};
