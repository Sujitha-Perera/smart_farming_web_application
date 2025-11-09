
import { Router } from 'express';
import { registerUser } from './controller.js'; 
import { loginUser } from './contollogin.js';
import { verifyToken } from './authMiddleware.js';
import { forgotPassword } from './forgotPassword.js';
import { resetPassword } from './resetPassword.js';
import { adminLogin } from './adminLogin.js';
import {getAllUsers,updateUser,deleteUser} from './manageUser.js'
import { addCrop,getAllCrops,updateCrop,deleteCrop } from './cropController.js';
import { getReminders,markAsDone,deleteReminder } from './reminderController.js';
import { downloadCropsPDF,downloadFullReportPDF,downloadRemindersPDF } from './pdfService.js';


const router = Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/forgotPassword',forgotPassword);
router.post('/resetPassword/:token',resetPassword)
router.get('/dashboard', verifyToken, (req, res) => {
  res.json({
    message: `Welcome, ${req.user.name}!`,
    user: req.user,
  });
});
router.post('/admin',adminLogin);

// user mange in admin panel
router.get("/users", getAllUsers);
router.put("/users/:id", updateUser);
router.delete("/users/:id", deleteUser);

// 🌱 Crop routes
router.post("/crops", addCrop);
router.get("/crops", getAllCrops);
router.put("/crops/:id", updateCrop);
router.delete("/crops/:id", deleteCrop);

// 🔔 Reminder routes
router.get("/reminders", getReminders);
router.put("/reminders/:id/done", markAsDone);
router.delete("/reminders/:id", deleteReminder);

// 📄 PDF Routes
router.get("/crops/:userId", downloadCropsPDF);
router.get("/reminders/:userId", downloadRemindersPDF);
router.get("/full-report/:userId", downloadFullReportPDF);




export default router;