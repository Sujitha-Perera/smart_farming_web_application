import { Router } from 'express';
import { registerUser } from './controller.js'; 
import { loginUser } from './contollogin.js';
import { verifyToken } from './authMiddleware.js';
import { forgotPassword } from './forgotPassword.js';
import { resetPassword } from './resetPassword.js';
import { adminLogin } from './adminLogin.js';
import {getAllUsers,updateUser,deleteUser} from './manageUser.js'
import { addCrop,getAllCrops,updateCrop,deleteCrop,getCropsByUser,deleteCropRemindersEndpoint } from './cropController.js';
import { getReminders,markAsDone,deleteReminder } from './reminderController.js';
import { downloadCropsPDF,downloadFullReportPDF,downloadRemindersPDF } from './pdfService.js';
import { submitContact,getContacts,getContactStats,updateContactStatus,sendResponse,deleteContact } from './contactContoller.js';
import { getAllCropsAdmin,updateCropAdmin,deleteCropAdmin, getAllRemindersAdmin,updateReminderAdmin,deleteReminderAdmin,} from "./manageCropAdmin.js";

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


// In your routes file
router.post('/crops', addCrop);
router.get('/crops', getAllCrops);
router.get('/crops/user/:userId', getCropsByUser);
router.put('/crops/:id', updateCrop);
router.delete('/crops/:id', deleteCrop);
router.delete('/reminders/crop/:cropId', deleteCropRemindersEndpoint);

//  Reminder routes
router.get("/reminders", getReminders);
router.put("/reminders/:id/done", markAsDone);
router.delete("/reminders/:id", deleteReminder);

//  PDF Routes
router.get("/crops/:userId", downloadCropsPDF);
router.get("/reminders/:userId", downloadRemindersPDF);
router.get("/full-report/:userId", downloadFullReportPDF);

// contactUs routes

//public
router.post("/contact",submitContact);
//admin
router.get('/admin/contacts', getContacts);
router.get('/admin/contacts/stats', getContactStats);
router.patch('/admin/contacts/:id/status', updateContactStatus);
router.post('/admin/contacts/:id/respond', sendResponse);
router.delete('/admin/contacts/:id', deleteContact);

// Admin manage crops / reminders
// (removed verifyToken to allow public fetching)
router.get("/admin/crops", getAllCropsAdmin);
router.put("/admin/crops/:id", updateCropAdmin);
router.delete("/admin/crops/:id", deleteCropAdmin);

router.get("/admin/reminders", getAllRemindersAdmin);
router.put("/admin/reminders/:id", updateReminderAdmin);
router.delete("/admin/reminders/:id", deleteReminderAdmin);




export default router;