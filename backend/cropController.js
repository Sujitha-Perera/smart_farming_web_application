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

/**
 * Create reminders for events (watering, fertilizer, harvest)
 */
const createRemindersForCrop = async (userId, userEmail, cropType, wateringDates, fertilizerDates, harvestDate) => {
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
        email: userEmail,
        message,
        date: rdate,
      });
    }
  };

  // water reminders
  for (const ev of wateringDates) {
    await addReminderIfNew(ev, `Water your ${cropType}`);
  }

  // fertilizer reminders
  for (const ev of fertilizerDates) {
    await addReminderIfNew(ev, `Apply fertilizer for ${cropType}`);
  }

  // harvest reminder (one event)
  await addReminderIfNew(harvestDate, `Harvest your ${cropType}`);
};

/**
 * Delete all reminders for a specific crop
 */
const deleteCropReminders = async (userId, cropType) => {
  try {
    // Delete watering reminders for this crop
    await Reminder.deleteMany({
      userId,
      message: `Water your ${cropType}`
    });

    // Delete fertilizer reminders for this crop
    await Reminder.deleteMany({
      userId,
      message: `Apply fertilizer for ${cropType}`
    });

    // Delete harvest reminder for this crop
    await Reminder.deleteMany({
      userId,
      message: `Harvest your ${cropType}`
    });

    console.log(` Deleted all reminders for crop: ${cropType}`);
  } catch (error) {
    console.error("Error deleting crop reminders:", error);
    throw error;
  }
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
      wateringFrequency: wateringFrequency || null,
      fertilizerFrequency: fertilizerFrequency || null,
    });

    // Create reminders for the crop
    await createRemindersForCrop(
      userId, 
      user.email, 
      cropType, 
      finalWateringDates, 
      finalFertilizerDates, 
      expectedHarvestDate
    );

    res.status(201).json({ 
      message: "Crop added & reminders created", 
      crop 
    });
  } catch (err) {
    console.error("Error in addCrop:", err);
    res.status(500).json({ error: "Error adding crop" });
  }
};

//  Update crop and regenerate reminders
export const updateCrop = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      cropType,
      landArea,
      soilType,
      cropGrowingDate,
      expectedHarvestDate,
      wateringDates = null,
      fertilizerDates = null,
      wateringFrequency = null,
      fertilizerFrequency = null,
    } = req.body;

    // Validate crop ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid crop ID" });
    }

    // Find existing crop
    const existingCrop = await Crop.findById(id).populate("userId", "email");
    if (!existingCrop) {
      return res.status(404).json({ message: "Crop not found" });
    }

    const userId = existingCrop.userId._id || existingCrop.userId;
    const userEmail = existingCrop.userId.email;
    const oldCropType = existingCrop.cropType;

    // Validate main dates if provided
    const grow = cropGrowingDate ? new Date(cropGrowingDate) : new Date(existingCrop.cropGrowingDate);
    const harvest = expectedHarvestDate ? new Date(expectedHarvestDate) : new Date(existingCrop.expectedHarvestDate);
    
    if (isNaN(grow) || isNaN(harvest) || grow > harvest) {
      return res.status(400).json({ message: "Invalid growing/harvest dates" });
    }

    // Generate new watering/fertilizer dates
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
    } else {
      // Keep existing watering dates if no new data provided
      finalWateringDates = existingCrop.wateringDates || [];
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
    } else {
      // Keep existing fertilizer dates if no new data provided
      finalFertilizerDates = existingCrop.fertilizerDates || [];
    }

    // Update the crop
    const updatedCrop = await Crop.findByIdAndUpdate(
      id,
      {
        cropType: cropType || existingCrop.cropType,
        landArea: landArea || existingCrop.landArea,
        soilType: soilType || existingCrop.soilType,
        cropGrowingDate: midnite(grow),
        expectedHarvestDate: midnite(harvest),
        wateringDates: finalWateringDates,
        fertilizerDates: finalFertilizerDates,
        wateringFrequency: wateringFrequency || existingCrop.wateringFrequency,
        fertilizerFrequency: fertilizerFrequency || existingCrop.fertilizerFrequency,
      },
      { new: true, runValidators: true }
    );

    // Delete old reminders and create new ones
    await deleteCropReminders(userId, oldCropType);
    
    // Create new reminders with updated data
    const newCropType = cropType || oldCropType;
    await createRemindersForCrop(
      userId,
      userEmail,
      newCropType,
      finalWateringDates,
      finalFertilizerDates,
      harvest
    );

    res.json({ 
      message: "Crop updated & reminders regenerated", 
      crop: updatedCrop 
    });
  } catch (err) {
    console.error("Error in updateCrop:", err);
    res.status(500).json({ error: "Error updating crop" });
  }
};

// Get all crops
export const getAllCrops = async (req, res) => {
  try {
    const crops = await Crop.find().populate("userId", "name email");
    res.json(crops);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching crops" });
  }
};

//  Delete crop
export const deleteCrop = async (req, res) => {
  try {
    const { id } = req.params;

    // Find crop first to get crop type for reminder deletion
    const crop = await Crop.findById(id);
    if (!crop) {
      return res.status(404).json({ message: "Crop not found" });
    }

    // Delete all reminders associated with this crop
    await deleteCropReminders(crop.userId, crop.cropType);

    // Delete the crop
    await Crop.findByIdAndDelete(id);

    res.json({ message: "Crop and associated reminders deleted" });
  } catch (err) {
    console.error("Error in deleteCrop:", err);
    res.status(500).json({ error: "Error deleting crop" });
  }
};

//  Delete all reminders for a specific crop (utility endpoint)
export const deleteCropRemindersEndpoint = async (req, res) => {
  try {
    const { cropId } = req.params;
    
    const crop = await Crop.findById(cropId);
    if (!crop) {
      return res.status(404).json({ message: "Crop not found" });
    }

    await deleteCropReminders(crop.userId, crop.cropType);
    
    res.json({ message: `All reminders for crop ${crop.cropType} deleted` });
  } catch (err) {
    console.error("Error deleting crop reminders:", err);
    res.status(500).json({ error: "Error deleting crop reminders" });
  }
};

// Get crops by user ID
export const getCropsByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const crops = await Crop.find({ userId }).populate("userId", "name email");
    res.json(crops);
  } catch (err) {
    console.error("Error fetching user crops:", err);
    res.status(500).json({ error: "Error fetching user crops" });
  }
};