import { Router } from 'express';
import { createListing, getListingById, updateListingById } from '../controllers/listing.controller.js';
import AuthMW from "../middlewares/auth.mw.js";

const router = Router();

router.post('/create', AuthMW, createListing);

router.get('/:id', getListingById);

router.put('/update/:id', AuthMW, updateListingById);

export default router;