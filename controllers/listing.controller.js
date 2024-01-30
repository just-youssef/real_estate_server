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
        const listing = await Listing.findById(req.params.id).populate('owner', ['first_name', 'last_name', 'email', 'password']);
        if(!listing) return res.status(404).json({error: "listing not found"})

        return res.json(listing)
    } catch (err) {
        nxt(err);
    }
};

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

const getUserListings = async (req, res, nxt) => {
    try {
        const listings = await Listing.find({ owner: req.userID }).sort({ "createdAt": -1 });
        console.log(`found ${listings.length} listings`);

        return res.json(listings);
    } catch (err) {
        nxt(err)
    }
}

const deleteListingById = async (req, res, nxt) => {
    try {
        const listing = await Listing.findById(req.params.id)
        if(!listing) return res.status(404).json({error: "listing not found"})

        // check if req user is the listing owner
        if(req.userID !== listing.owner.toString()) return res.status(403).json({error: "access denied"})

        await Listing.findByIdAndDelete(req.params.id);
        console.log("listing deleted..!");

        return res.json({ message: "listing deleted..!" })
    } catch (err) {
        nxt(err);
    }
}

const searchListings = async (req, res, nxt) => {
    try {
        const searchTerm = req.query.searchTerm || '';
        const sort = req.query.sort || 'createdAt';
        const order = req.query.order || -1;
        const limit = parseInt(req.query.limit) || 9;
        const startIndex = parseInt(req.query.startIndex) || 0;

        let offer = req.query.offer;
        if ([undefined, 'false'].includes(offer)) {
            offer = { $in: [false, true] };
        }

        let furnished = req.query.furnished;
        if ([undefined, 'false'].includes(furnished)) {
            furnished = { $in: [false, true] };
        }

        let parking = req.query.parking;
        if ([undefined, 'false'].includes(parking)) {
            parking = { $in: [false, true] };
        }
        
        let type = req.query.type;
        if ([undefined, 'all'].includes(type)) {
            type = { $in: ['sell', 'rent'] };
        }

        const listings = await Listing.find({
            title: { $regex: searchTerm, $options: 'i' },
            offer,
            furnished,
            parking,
            type,
        }).sort({ [sort]: order }).limit(limit).skip(startIndex);
        console.log(`found ${listings.length} listings`);

        return res.json(listings);
    } catch (err) {
        nxt(err);
    }
}


export {
    createListing,
    getListingById,
    updateListingById,
    getUserListings,
    deleteListingById,
    searchListings,
}