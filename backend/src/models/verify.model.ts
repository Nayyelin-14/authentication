import mongoose from "mongoose";
import CodeTypes from "../constants/CodeTypes";
import { oneDayFromNow } from "../utils/data";

export interface verifyCodeDocuemnt extends mongoose.Document {
  userId: mongoose.Types.ObjectId;
  type: CodeTypes;
  expiresAt: Date;
}

const VerificationCodeSchema = new mongoose.Schema<verifyCodeDocuemnt>({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    index: true,
    ref: "User",
    required: true,
  },
  type: { type: String, required: true },
  expiresAt: { type: Date, default: oneDayFromNow },
});

const VerificationCodeModel = mongoose.model<verifyCodeDocuemnt>(
  "VerificationCode", //Model name
  VerificationCodeSchema, //Schema definition
  "verification_code" //name iin database , iif empty , it wiill take first args
);

export default VerificationCodeModel;
