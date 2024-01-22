// .env and mongodb
import { configDotenv } from "dotenv";
import { connect } from 'mongoose';

// express and third party modules
import express, { urlencoded, json } from "express";
import cors from 'cors';
import helmet from 'helmet';

// routers
// import postsRouter from './routes/posts.js';

// load environment variables
configDotenv();

// connect to mongodb
connect(process.env.MONGODB_URI, { dbName: 'real_estate' })
    .then(() => console.log('MongoDB Connected!'))
    .catch((err) => console.log(err.message))

// initialize app
const app = express();

// using third party modules
app.use(cors());
app.use(helmet());
app.use(urlencoded({ extended: true }));
app.use(json());

// using routers
// app.use("/api/posts", postsRouter);

// start app
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running on host http://localhost:${port}/`))