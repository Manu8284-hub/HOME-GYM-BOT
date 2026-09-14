import express from 'express';
import {
  signupUser,
  loginUser,
  getUserProfile,
  updateUserProfile
} from '../controllers/userController.js';

const router = express.Router();

router.post('/signup', signupUser);
router.post('/login', loginUser);
router.get('/', getUserProfile);
router.post('/', updateUserProfile);
router.put('/', updateUserProfile);

export default router;
