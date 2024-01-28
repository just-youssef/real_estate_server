import { Router } from 'express';
import { createListing, deleteListingById, getListingById, getUserListings, updateListingById } from '../controllers/listing.controller.js';
import AuthMW from "../middlewares/auth.mw.js";

const router = Router();

router.post('/create', AuthMW, createListing);

router.get('/me', AuthMW, getUserListings);

router.get('/:id', getListingById);

router.put('/update/:id', AuthMW, updateListingById);

router.delete('/delete/:id', AuthMW, deleteListingById);

export default router;