import Listing from "../models/listing.model.js";

const createListing = async (req, res, nxt) => {
    try {
        const listing = await Listing.create({ ...req.body, owner: req.userID });
        return res.status(201).json(listing);
    } catch (err) {
        nxt(err);
    }
};

export {
    createListing,
}