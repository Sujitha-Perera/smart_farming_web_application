
import { Router } from 'express';
import { registerUser } from './controller.js'; 
import { loginUser } from './contollogin.js';
import { verifyToken } from './authMiddleware.js';
// import predictRouter from './predict.js';


const router = Router();



router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/dashboard', verifyToken, (req, res) => {
  res.json({
    message: `Welcome, ${req.user.name}!`,
    user: req.user,
  });
});
// router.use('/predict', predictRouter);



export default router;