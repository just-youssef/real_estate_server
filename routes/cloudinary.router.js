import { Router } from "express";
import AuthMW from "../middlewares/auth.mw.js";
import { uploadFile } from "../controllers/cloudinary.controller.js";
import multer from "multer";

const multerUploadMW = multer({ dest: 'multer/' })
const router = Router();

router.post('/uploadFile', [AuthMW, multerUploadMW.single('file')], uploadFile)

export default router;