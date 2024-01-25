import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const AuthMW = async(req, res, nxt) => {
    // get token
    let token = req.header('x-auth-token');
    if (!token) return res.status(401).json({ error: "access denied" });

    // verify token
    try {
        let payload = jwt.verify(token, process.env.JWT_SECRET);

        // check if token user is not exists (authenticated)
        let user = await User.findById(payload.userID);
        if (!user) return res.status(401).json({ error: "access denied" });

        // if user is authenticated
        req.userID = payload.userID
        nxt();
    } catch (err) {
        console.log(err.message);
        return res.status(400).json({ error: "invalid token" });
    }
}

export default AuthMW