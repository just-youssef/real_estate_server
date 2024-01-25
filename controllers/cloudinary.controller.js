import { v2 as cloudinary } from 'cloudinary' ;

const uploadFile = async(req, res, nxt) => {
    try {
        const { url } = await cloudinary.uploader.upload(req.file.path, { folder: `${req.userID}` });
        return res.json({ url });
    } catch (err) {
        nxt(err)
    }
}

export {
    uploadFile,
}