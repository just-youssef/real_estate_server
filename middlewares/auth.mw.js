import jwt from "jsonwebtoken";

const AuthMW = (req, res, nxt) => {
    // get token
    let token = req.header('x-auth-token');
    if (!token) return res.status(401).json({ error: "access denied" });

    // verify token
    try {
        let payload = jwt.verify(token, process.env.JWT_SECRET);

        // if token user is not authenticated
        if (!payload.userID) return res.status(401).json({ error: "access denied" });

        // if user is authenticated
        req.userID = payload.userID
        nxt();
    } catch (err) {
        console.log(err.message);
        return res.status(400).json({ error: "invalid token" });
    }
}

export default AuthMW