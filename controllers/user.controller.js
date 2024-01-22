import { genSalt, hash } from "bcrypt";
import User from "../models/user.model.js";

const signup = async(req, res, nxt) => {
    try {
        // extrct data from request body
        const { first_name, last_name, email, password } = req.body;

        // check if email exits
        let user = await User.findOne({ email });
        if (user) {
            console.log("email already exists");
            return res.status(400).json({ error: { email: "email already exists" } });
        }

        // hash the password
        let saltRounds = await genSalt();
        let hashedPassword = await hash(password, saltRounds);

        user = new User({
            first_name, last_name, email,
            password: hashedPassword,
        });

        // save to db
        await user.save();
        console.log("user created..");

        // generate jwt 
        let token = user.genAuthToken();

        // send token
        res.header("x-auth-token", token);
        return res.status(201).json({ jwt: token });
    } catch (err) {
        nxt(err);
    }
}

const signin = async (req, res, nxt) => {
    try {
        
    } catch (err) {
        nxt(err)
    }
}

export {
    signup,
    signin
}