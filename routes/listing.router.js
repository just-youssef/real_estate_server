import { Router } from 'express';
import { createListing } from '../controllers/listing.controller.js';
import AuthMW from "../middlewares/auth.mw.js";

const router = Router();

router.post('/create', AuthMW, createListing);

export default router;