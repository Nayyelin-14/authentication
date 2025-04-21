import mongoose from "mongoose";
import { thirtyDayFromNow } from "../utils/data";

export interface sessionDocument extends mongoose.Document {
  userId: mongoose.Types.ObjectId;
  expiresAt: Date;
  createdAt: Date;
  userAgent?: string;
}

const sessionSchema = new mongoose.Schema<sessionDocument>({
  userId: {
    type: mongoose.Schema.Types.ObjectId,

    index: true,
    ref: "User",
  },
  userAgent: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    required: true,
  },
  expiresAt: {
    type: Date,
    default: thirtyDayFromNow,
  },
});

const sessionModel = mongoose.model<sessionDocument>("Session", sessionSchema);

export default sessionModel;
