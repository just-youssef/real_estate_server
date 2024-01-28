// .env and mongodb
import { configDotenv } from "dotenv";
import { connect } from 'mongoose';

// cloudinary cloud
import { v2 as cloudinary } from 'cloudinary' ;

// express and third party modules
import express, { urlencoded, json } from "express";
import cors from 'cors';
import helmet from 'helmet';

// routers
import userRouter from './routes/user.route.js';
import cloudinaryRouter from './routes/cloudinary.router.js';
import listingRouter from './routes/listing.router.js';
import ErrorMW from "./middlewares/error.mw.js";

// load environment variables
configDotenv();

// connect to mongodb
connect(process.env.MONGODB_URI, { dbName: 'real_estate' })
    .then(() => console.log('MongoDB Connected!'))
    .catch((err) => console.log(err.message))

// configure cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
});

// initialize app
const app = express();

// using third party modules
app.use(cors());
app.use(helmet());
app.use(urlencoded({ extended: true, }));
app.use(json());

// using routers
app.use("/api/user", userRouter);
app.use("/api/cloudinary", cloudinaryRouter);
app.use("/api/listing", listingRouter);

// using error middleware at the end
app.use(ErrorMW);

// start app
const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
    console.log(`API_ROOT: ${process.env.API_ROOT}`)
})