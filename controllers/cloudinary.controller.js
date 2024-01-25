import { v2 as cloudinary } from 'cloudinary' ;
import User from '../models/user.model.js';

const changeAvatar = async(req, res, nxt) => {
    try {
        const { url } = await cloudinary.uploader.upload(req.file.path, { folder: `${req.userID}/avatars` });
        
        // update user avatar
        let user = await User.findById(req.userID);
        user.avatar = url;
        await user.save();
        console.log('avatar changed');

        // exclude password and send user data
        const { password: pass, ...rest } = user._doc;
        return res.json(rest);
    } catch (err) {
        nxt(err)
    }
}

export {
    changeAvatar,
}