import { Router } from "express";
import { checkVerified, signin, signup, verify } from "../controllers/user.controller.js";
import SignupValidatorMW from "../middlewares/signup.validator.mw.js";
import SigninValidatorMW from "../middlewares/signin.validator.mw.js";

const router = Router();

router.post('/signup', SignupValidatorMW, signup)

router.get('/verify/:id/:token', verify)

router.get('/check-verified/:id', checkVerified)

router.post('/signin', SigninValidatorMW, signin)

export default router;