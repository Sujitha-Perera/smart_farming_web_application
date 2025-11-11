// mail/scheduler.js
import nodemailer from "nodemailer";
import cron from "node-cron";
import Reminder from "./model/reminderModel.js";
import Crop from "./model/cropModel.js"; // Import Crop model

// configure transporter (Gmail example)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// run at 12:50 PM Colombo time daily
cron.schedule(
  "01 10 * * *",
  async () => {
    try {
      console.log(" Checking today's reminders...");

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const nextDay = new Date(today.getTime() + 24 * 60 * 60 * 1000);

      const reminders = await Reminder.find({
        date: { $gte: today, $lt: nextDay },
        isDone: false,
      }).populate("userId", "name");

      if (!reminders.length) {
        console.log(" No reminders to send today.");
        return;
      }

      // Get crop types for all users in one query
      const userIds = reminders.map(r => r.userId?._id).filter(id => id);
      const userCrops = await Crop.find({ 
        userId: { $in: userIds } 
      }).sort({ cropGrowingDate: -1 });

      // Create a map of user IDs to their most recent crop type
      const cropMap = new Map();
      userCrops.forEach(crop => {
        if (!cropMap.has(crop.userId.toString())) {
          cropMap.set(crop.userId.toString(), crop.cropType);
        }
      });

      const formatDate = (d) =>
        new Date(d).toLocaleDateString("en-GB", {
          weekday: "long",
          year: "numeric",
          month: "short",
          day: "numeric",
        });

      for (const r of reminders) {
        try {
          const farmerName = r.userId?.name || "Farmer";
          const reminderDate = formatDate(r.date);
          const cropType = cropMap.get(r.userId?._id.toString()) || "your crops";

          // detect message type to customize subject/body
          let type = "general";
          const msgLower = (r.message || "").toLowerCase();
          if (msgLower.includes("water")) type = "watering";
          else if (msgLower.includes("fertilizer")) type = "fertilizer";
          else if (msgLower.includes("harvest")) type = "harvest";

          let subject = "";
          let htmlContent = "";

          switch (type) {
            case "watering":
              subject = `💧 Reminder: Watering scheduled for ${cropType}`;
              htmlContent = `
                <div style="font-family: Arial; padding:20px; border-radius:8px; background:#e3f2fd;">
                  <h3>💧 Hello ${farmerName},</h3>
                  <p>This is a reminder for watering your ${cropType} scheduled ${reminderDate}.</p>
                  <p><b>Note:</b> Make sure irrigation is ready early in the morning.</p>
                  <p style="margin-top:10px; color:#555;">— Smart Farming System</p>
                </div>
              `;
              break;

            case "fertilizer":
              subject = `🌾 Reminder: Fertilizer scheduled for ${cropType}`;
              htmlContent = `
                <div style="font-family: Arial; padding:20px; border-radius:8px; background:#fff8e1;">
                  <h3>🌾 Hello ${farmerName},</h3>
                  <p>This is a reminder for fertilizer application for your ${cropType} scheduled ${reminderDate}.</p>
                  <p><b>Tip:</b> Use recommended amounts and protective gear.</p>
                  <p style="margin-top:10px; color:#555;">— Smart Farming System</p>
                </div>
              `;
              break;

            case "harvest":
              subject = `🎉 Reminder: ${cropType} Harvest scheduled`;
              htmlContent = `
                <div style="font-family: Arial; padding:20px; border-radius:8px; background:#e8f5e9;">
                  <h3>🎉 Hello ${farmerName},</h3>
                  <p>Your ${cropType} harvest is scheduled ${reminderDate}. Prepare tools and storage.</p>
                  <p style="margin-top:10px; color:#555;">— Smart Farming System</p>
                </div>
              `;
              break;

            default:
              subject = `🌱 ${cropType} Farming Reminder for ${reminderDate}`;
              htmlContent = `
                <div style="font-family: Arial; padding:20px; border-radius:8px; background:#f1f8e9;">
                  <h3>Hello ${farmerName},</h3>
                  <p>${r.message} for your ${cropType} on ${reminderDate}</p>
                </div>
              `;
          }

          await transporter.sendMail({
            from: `"Smart Farming System" <${process.env.EMAIL_USER}>`,
            to: r.email,
            subject,
            html: htmlContent,
          });

          console.log(`📤 Sent ${type} email for ${cropType} to ${r.email}`);
        } catch (err) {
          console.error("Error sending single reminder:", err);
        }
      }
    } catch (err) {
      console.error("Cron failed:", err);
    }
  },
  {
    timezone: "Asia/Colombo",
  }
);