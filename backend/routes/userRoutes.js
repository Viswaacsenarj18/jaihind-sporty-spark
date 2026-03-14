import express from "express";
import {
registerUser,
loginUser,
forgotPassword,
resetPassword,
updateProfile,
changePassword
} from "../controllers/userController.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

router.put("/update-profile", updateProfile);
router.put("/change-password", changePassword);

export default router;