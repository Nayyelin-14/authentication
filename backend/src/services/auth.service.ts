import CodeTypes from "../constants/CodeTypes";
import { JWT_REFRESH_SECRET, JWT_SECRET } from "../constants/env";
import { CONFLICT, UNAUTHORIZED } from "../constants/http";
import sessionModel from "../models/session.model";
import UserModal from "../models/user.model";
import VerificationCodeModel from "../models/verify.model";
import { AppAssert } from "../utils/appAssert";
import { oneDayFromNow, thirtyDayFromNow } from "../utils/data";
import jwt, { sign } from "jsonwebtoken";
import {
  refreshTokenOption,
  refreshTokenType,
  signToken,
  verfiyToken,
} from "../utils/jwt";
type CreateAccountProps = {
  email: string;
  password: string;
  userAgent?: string;
};

export const CreateAccount = async (data: CreateAccountProps) => {
  const existingUser = await UserModal.exists({
    email: data.email,
  });
  AppAssert(!existingUser, CONFLICT, "Email is already in user");
  const user = await UserModal.create({
    email: data.email,
    password: data.password,
  });

  //create veriification  code
  const createCode = await VerificationCodeModel.create({
    userId: user._id,
    type: CodeTypes.EmailVerification,
    expiresAt: oneDayFromNow(),
  });

  //create session
  const createSession = await sessionModel.create({
    userId: user._id,
    expiresAt: thirtyDayFromNow(),
    userAgent: data.userAgent,
  });

  //refresh token
  const refreshToken = signToken(
    { sessionId: createSession._id },
    refreshTokenOption
  );

  const accessToken = signToken({
    sessionId: createSession._id,
    userId: user._id,
  });

  return { user: user.omitPassword(), refreshToken, accessToken };
};

type LoginProps = {
  email: string;
  password: string;
  userAgent?: string;
};

export const loginAccount = async ({
  email,
  password,
  userAgent,
}: LoginProps) => {
  const existingUser = await UserModal.findOne({
    email: email,
  });
  AppAssert(existingUser, UNAUTHORIZED, "Invalid credentials");

  const isValid = await existingUser.comparePassword(password);
  AppAssert(!isValid, UNAUTHORIZED, "Invalid credentials");

  const UserId = existingUser!._id;
  const Session = await sessionModel.create({
    userId: UserId,
    userAgent,
  });

  const sessionInFo = {
    sessionId: Session._id,
  };

  //refresh token
  const refreshToken = signToken(sessionInFo, refreshTokenOption);

  const accessToken = signToken({ ...sessionInFo, userId: UserId });

  return { user: existingUser.omitPassword(), refreshToken, accessToken };
};

export const refreshUseraccessToken = async (refreshToken: string) => {
  const now = Date.now();
  const { payload, error } = verfiyToken<refreshTokenType>(refreshToken, {
    secret: refreshTokenOption.secret,
  });

  const session = await sessionModel.findById(payload?.sessionId);
  AppAssert(
    session && session.expiresAt.getTime() > now,
    UNAUTHORIZED,
    "Session expired"
  );

  const sessionNeedsRefresh =
    session.expiresAt.getTime() - now < 24 * 60 * 60 * 1000;

  if (sessionNeedsRefresh) {
    session.expiresAt = thirtyDayFromNow();
    await session.save();
  }

  const newRefreshToken = sessionNeedsRefresh
    ? signToken({ sessionId: session._id }, refreshTokenOption)
    : undefined;

  const accessToken = signToken({
    userId: session.userId,
    sessionId: session._id,
  });

  return {
    accessToken,
    newRefreshToken,
  };
};
