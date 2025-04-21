import mongoose from "mongoose";
import { MONGO_URI } from "../constants/env";

const connectToDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log(" connected to database");
  } catch (error) {
    console.log("Failed to connect database", error);
    process.exit(1);
  }
};
export default connectToDB;
