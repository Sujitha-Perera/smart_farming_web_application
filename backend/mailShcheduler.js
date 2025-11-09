// mail/scheduler.js
import nodemailer from "nodemailer";
import cron from "node-cron";
import Reminder from "./model/reminderModel.js";

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
  "* * * * *",
  async () => {
    try {
      console.log("🌅 Checking today's reminders...");

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const nextDay = new Date(today.getTime() + 24 * 60 * 60 * 1000);

      const reminders = await Reminder.find({
        date: { $gte: today, $lt: nextDay },
        isDone: false,
      }).populate("userId", "name");

      if (!reminders.length) {
        console.log("✅ No reminders to send today.");
        return;
      }

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
              subject = `💧 Reminder: Watering scheduled`;
              htmlContent = `
                <div style="font-family: Arial; padding:20px; border-radius:8px; background:#e3f2fd;">
                  <h3>💧 Hello ${farmerName},</h3>
                  <p>This is a reminder for watering scheduled ${reminderDate}.</p>
                  <p><b>Note:</b> Make sure irrigation is ready early in the morning.</p>
                  <p style="margin-top:10px; color:#555;">— Smart Farming System</p>
                </div>
              `;
              break;

            case "fertilizer":
              subject = `🌾 Reminder: Fertilizer scheduled`;
              htmlContent = `
                <div style="font-family: Arial; padding:20px; border-radius:8px; background:#fff8e1;">
                  <h3>🌾 Hello ${farmerName},</h3>
                  <p>This is a reminder for fertilizer application scheduled ${reminderDate}.</p>
                  <p><b>Tip:</b> Use recommended amounts and protective gear.</p>
                  <p style="margin-top:10px; color:#555;">— Smart Farming System</p>
                </div>
              `;
              break;

            case "harvest":
              subject = `🎉 Reminder: Harvest scheduled`;
              htmlContent = `
                <div style="font-family: Arial; padding:20px; border-radius:8px; background:#e8f5e9;">
                  <h3>🎉 Hello ${farmerName},</h3>
                  <p>Your harvest is scheduled ${reminderDate}. Prepare tools and storage.</p>
                  <p style="margin-top:10px; color:#555;">— Smart Farming System</p>
                </div>
              `;
              break;

            default:
              subject = `🌱 Farming Reminder for ${reminderDate}`;
              htmlContent = `
                <div style="font-family: Arial; padding:20px; border-radius:8px; background:#f1f8e9;">
                  <h3>Hello ${farmerName},</h3>
                  <p>${r.message} on ${reminderDate}</p>
                </div>
              `;
          }

          await transporter.sendMail({
            from: `"Smart Farming System" <${process.env.EMAIL_USER}>`,
            to: r.email,
            subject,
            html: htmlContent,
          });

          console.log(`📤 Sent ${type} email to ${r.email}`);
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
