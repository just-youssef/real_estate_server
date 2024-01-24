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
        const msg = `${process.env.CLIENT}/verification-confirm/${user._id}/${token.value}`
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
        if (user.verified) {
            console.log('email already verified');
            return res.json({ message: "email already verified", verified: user.verified })
        };

        // check token exists
        let token = await Token.findOne({ value: req.params.token, user: user._id });
        if (!token) return res.status(400).json({ error: "invalid token" });
        
        // verify user then delete token
        await user.verifyEmail();
        await Token.findByIdAndDelete(token._id)
        console.log('email verfied');

        return res.json({ message: 'email verified', verified: user.verified })
    } catch (err) {
        nxt(err)
    }
}

// check if email verified
const checkVerfication = async(req, res, nxt) => {
    try {
        // check user exits
        let user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ error: "user not found" });

        return res.json({ verified: user.verified })
    } catch (err) {
        nxt(err)
    }
}

const resendVerfication = async(req, res, nxt) => {
    try {
        // check user exits
        let user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ error: "user not found" });

        // check if already verfied
        if (user.verified) {
            console.log('email already verified');
            return res.json({ message: 'already verified' })
        };

        // get and delete old tokens
        let tokens = await Token.find({ user: user._id });
        if (tokens) {
            for(let t of tokens){
                await Token.findByIdAndDelete(t._id)
            }
        }
        
        // create new verfication token
        let token = new Token({
            user: user._id,
            value: randomBytes(32).toString('hex')
        })

        // save to db
        await token.save();
        console.log("new verfication token created..");

        // send email verfication
        const msg = `${process.env.CLIENT}/verification-confirm/${user._id}/${token.value}`
        await sendEmail(user.email, 'RealEstate Email Verfication', msg)
            
        return res.json({ message: 'verfication sent again' })
    } catch (error) {
        
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

        // generate jwt and extrat user data
        let token = user.genAuthToken();
        const { password: pass, ...rest } = user._doc;

        // send response
        return res.json({ jwt: token, user: rest });
    } catch (err) {
        nxt(err)
    }
}

// update user
const updateUser = async (req, res, nxt) => {
    try {
        // check user exits
        let user = await User.findById(req.userID);
        if (!user) return res.status(404).json({ error: "user not found" });

        // update user by req.body
        Object.keys(req.body).forEach(key => user[key] = req.body[key]);

        // save updates
        await user.save();
        console.log('user updated');

        // exclude password and send user data
        const { password: pass, ...rest } = user._doc;
        return res.json(rest)
    } catch (err) {
        nxt(err)
    }
}

// show user password
const changePassword = async (req, res, nxt) => {
    try {
        // extrct data from request body
        const { old_password, new_password } = req.body;

        // check user exits
        let user = await User.findById(req.userID);
        if (!user) return res.status(404).json({ error: "user not found" });

        // check old_password
        let valid = await compare(old_password, user.password);
        if (!valid) return res.status(400).json({ error: { old_password: "old password is incorrect" } });

        // check if old and new password is not matched
        let matched = await compare(new_password, user.password);
        if (matched) return res.status(400).json({ error: { new_password: "new password cannot be same as old password", same: true } });

        // hash the password
        let saltRounds = await genSalt();
        let hashedPassword = await hash(new_password, saltRounds);

        // update password
        user.password = hashedPassword
        await user.save()

        return res.json({ message: 'password changed' })
    } catch (err) {
        nxt(err);
    }
}

export {
    signup,
    verify,
    checkVerfication,
    signin,
    resendVerfication,
    updateUser,
    changePassword
}