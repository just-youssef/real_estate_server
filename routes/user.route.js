import { Router } from "express";
import { changePassword, checkVerfication, resendVerfication, signin, signup, updateUser, verify } from "../controllers/user.controller.js";
import SignupValidatorMW from "../middlewares/signup.validator.mw.js";
import SigninValidatorMW from "../middlewares/signin.validator.mw.js";
import UpdateUserValidatorMW from "../middlewares/updateUser.validator.mw.js";
import ChangePasswordValidatorMW from "../middlewares/changePassword.validator.mw.js";
import AuthMW from "../middlewares/auth.mw.js";

const router = Router();

router.post('/signup', SignupValidatorMW, signup)

router.get('/verify/:id/:token', verify)

router.get('/verfication/check/:id', checkVerfication)

router.get('/verfication/resend/:id', resendVerfication)

router.post('/signin', SigninValidatorMW, signin)

router.post('/update', [AuthMW, UpdateUserValidatorMW], updateUser)

router.post('/changePassword', [AuthMW, ChangePasswordValidatorMW], changePassword)

export default router;