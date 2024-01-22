import { Router } from "express";
import { signup } from "../controllers/user.controller.js";
import SignupValidatorMW from "../middlewares/signup.validator.mw.js";

const router = Router();

router.get('/signup', SignupValidatorMW, signup)

export default router;