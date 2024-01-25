import { Router } from "express";
import AuthMW from "../middlewares/auth.mw.js";
import { changeAvatar } from "../controllers/cloudinary.controller.js";
import multer from "multer";

const multerUploadMW = multer({ dest: 'multer/' })
const router = Router();

router.post('/changeAvatar', [AuthMW, multerUploadMW.single('avatar')], changeAvatar)

export default router;