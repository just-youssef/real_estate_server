import { compare, genSalt, hash } from "bcrypt";
import User from "../models/user.model.js";
import Token from "../models/token.model.js";
import { randomBytes } from "crypto";
import sendEmail from "../utils/sendEmail.js";

// sign up 
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

        // create verfication token
        let token = new Token({
            user: user._id,
            value: randomBytes(32).toString('hex')
        })

        // save to db
        await token.save();
        console.log("verfication token created..");

        // send email verfication
        const msg = `${process.env.API_ROOT}/user/verify/${user._id}/${token.value}`
        await sendEmail(user.email, 'RealEstate Email Verfication', msg)

        return res.status(201).json({ userID: user._id })
    } catch (err) {
        nxt(err);
    }
}

// verify email
const verify = async(req, res, nxt) => {
    try {
        // check user exists
        let user = await User.findById(req.params.id);
        if (!user) return res.status(400).json({ error: "invalid id" });

        // check if already verfied
        if (user.verified) return res.redirect(process.env.LOGIN);

        // check token exists
        let token = await Token.findOne({ value: req.params.token, user: user._id });
        if (!token) return res.status(400).json({ error: "invalid token" });
        
        // verify user then delete token
        await user.verifyEmail();
        await Token.findByIdAndDelete(token._id)
        console.log('email verfied');

        return res.redirect(process.env.LOGIN)
    } catch (err) {
        nxt(err)
    }
}

// check if email verified
const checkVerified = async (req, res, nxt) => {
    try {
        let user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ error: "user not found" });

        return res.json({ verified: user.verified })
    } catch (err) {
        nxt(err)
    }
}

// sign in
const signin = async (req, res, nxt) => {
    try {
        // extrct data from request body
        const { email, password } = req.body;

        // check if email not exits
        let user = await User.findOne({ email });
        if (!user) return res.status(400).json({ error: { email: "email doesn't exists" } });
   
        // check password
        let valid = await compare(password, user.password);
        if (!valid) return res.status(400).json({ error: { password: "incorrect password" } });

        // generate jwt 
        let token = user.genAuthToken();

        // send token
        res.header("x-auth-token", token);
        return res.json({ jwt: token });
    } catch (err) {
        nxt(err)
    }
}

export {
    signup,
    verify,
    checkVerified,
    signin
}