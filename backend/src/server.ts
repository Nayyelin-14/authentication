import connectToDB from "./config/db";
import dotenv from "dotenv";
import cors from "cors";
import express from "express";
import { APP_ORIGIN, NODE_ENV, PORT } from "./constants/env";
import cookieParser from "cookie-parser";
import errorHandler from "./middleware/errorhandler";
import authRoutes from "./Routes/auth.route.";
import authenticate from "./middleware/authenticate";
import userRoutes from "./Routes/user.route";
import sessinRoutes from "./Routes/session.route";

dotenv.config();
const app = express();
app.use(express.json()); //Allows you to access JSON data in req.body
app.use(express.urlencoded({ extended: true })); // for form data
app.use(
  cors({
    origin: APP_ORIGIN,
    credentials: true,
  })
);

app.use(cookieParser()); //handles incoming requests — specifically, it parses the Cookie header from the incoming HTTP request and makes the cookie data available as:

//routes
app.use("/auth", authRoutes);
app.use("/user", authenticate, userRoutes);
app.use("/session", authenticate, sessinRoutes);
//
app.use(errorHandler);
app.listen(PORT, async () => {
  console.log(`Server is running at ${PORT} and ${NODE_ENV} mode`);
  await connectToDB();
});
