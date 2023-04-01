import express from "express";
import { signUp, signIn, slotBooking, fillAllSlots, getSlotByVehicleType, getSlotInfo, getStatisticsByMonth, postStats, orders, verify, paymentDetails } from "../controllers/auth.controller.js";
import {auth} from "../middlewares/auth.middleware.js";
import { validateSignUp, validateLogin } from "../middlewares/validationUser.middleware.js";
import upload from "../utils/multer.js";

const router = express.Router();

// auth
router.post("/signUp", upload.single("attach"), signUp);
router.post("/signIn", validateLogin, signIn);

// slot booking
// router.post("/fill", fillAllSlots);
router.post("/postSlot", auth, slotBooking);
router.get("/vehicle", auth, getSlotByVehicleType);
router.get("/getSlotInfo/:id", auth, getSlotInfo);

// statistics
// router.post("/fillStats", postStats);
router.get("/getStatsByMonth", auth, getStatisticsByMonth);

// payment gateway
router.post('/order', orders);
router.post('/verify', verify);
router.post('/paymentdetails', paymentDetails);

export default router;