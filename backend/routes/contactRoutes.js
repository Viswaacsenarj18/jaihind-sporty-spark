import express from 'express';
import { sendContactEmail } from '../controllers/contactController.js';

const router = express.Router();

// ✅ SEND CONTACT FORM EMAIL (Public endpoint - no auth required)
router.post('/send', sendContactEmail);

export default router;
