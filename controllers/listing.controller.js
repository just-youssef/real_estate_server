import Listing from "../models/listing.model.js";

const createListing = async (req, res, nxt) => {
    try {
        const listing = await Listing.create({ ...req.body, owner: req.userID });
        console.log("listing created..");

        return res.status(201).json({ listingID: listing._id });
    } catch (err) {
        nxt(err);
    }
};

const getListingById = async (req, res, nxt) => {
    try {
        const listing = await Listing.findById(req.params.id)
        if(!listing) return res.status(404).json({error: "lsiting not found"})

        return res.json(listing)
    } catch (err) {
        nxt(err);
    }
}

const updateListingById = async (req, res, nxt) => {
    try {
        const listing = await Listing.findById(req.params.id)
        if(!listing) return res.status(404).json({error: "lsiting not found"})

        // check if req user is the listing owner
        if(req.userID !== listing.owner.toString()) return res.status(403).json({error: "access denied"})

        const updatedListing = await Listing.findByIdAndUpdate(req.params.id, {
            $set: {
                title: req.body.title,
                description: req.body.description,
                address: req.body.address,
                type: req.body.type,
                furnished: req.body.furnished,
                parking: req.body.parking,
                offer: req.body.offer,
                regularPrice: req.body.regularPrice,
                discountPrice: req.body.discountPrice,
                bathrooms: req.body.bathrooms,
                bedrooms: req.body.bedrooms,
                imageUrls: req.body.imageUrls,
            }
        }, { new: true });
        console.log("listing updated");

        return res.json({ listingID: updatedListing._id });
    } catch (err) {
        nxt(err);
    }
};

export {
    createListing,
    getListingById,
    updateListingById,
}