import { Router } from "express";
import { checkVerified, signup, verify } from "../controllers/user.controller.js";
import SignupValidatorMW from "../middlewares/signup.validator.mw.js";

const router = Router();

router.post('/signup', SignupValidatorMW, signup)

router.get('/verify/:id/:token', verify)

router.get('/check-verified/:id', checkVerified)

export default router;