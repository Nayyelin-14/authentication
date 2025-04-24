import CodeTypes from "../constants/CodeTypes";
import { APP_ORIGIN } from "../constants/env";
import {
  CONFLICT,
  INTERNAL_SERVER_ERROR,
  NOT_FOUND,
  TOO_MANY_REQUESTS,
  UNAUTHORIZED,
} from "../constants/http";
import sessionModel from "../models/session.model";
import UserModal from "../models/user.model";
import VerificationCodeModel from "../models/verify.model";
import { AppAssert } from "../utils/appAssert";
import {
  fiveMinsAgo,
  oneDayFromNow,
  oneHourFromNow,
  thirtyDayFromNow,
} from "../utils/data";

import {
  refreshTokenOption,
  refreshTokenType,
  signToken,
  verfiyToken,
} from "../utils/jwt";
import { sendMail } from "../utils/sendMail";
import {
  getResetPasswordEmailTemplate,
  getVerifyEmailTemplate,
} from "../utils/emailtemplates";

import { hashValue } from "../utils/bcrypt";
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

  ///send mail
  const url = `${APP_ORIGIN}/email/verify/${createCode!._id}`;
  const { error } = await sendMail({
    to: user.email,
    ...getVerifyEmailTemplate(url),
  });

  if (error) {
    console.log(error);
  }

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

  return { user: user.omitPassword(), refreshToken, accessToken, createCode };
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
  AppAssert(isValid, UNAUTHORIZED, "Invalid credentials");

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

export const verifyEmail = async (verifyCode: string) => {
  const validationCode = await VerificationCodeModel.findOne({
    _id: verifyCode,
    type: CodeTypes.EmailVerification,
    expiresAt: { $gt: new Date() },
  });

  AppAssert(validationCode, NOT_FOUND, "Invalid or expired verification code");

  //update user
  const updatedUser = await UserModal.findByIdAndUpdate(
    validationCode.userId,
    {
      verified: true,
    },
    {
      new: true,
    }
  );
  AppAssert(
    updatedUser,
    INTERNAL_SERVER_ERROR,
    "Something went wrong in validation"
  );

  //delete code
  await validationCode.deleteOne();

  //reuturn user
  return {
    user: updatedUser.omitPassword(),
  };
};

export const sentResetEmail = async (email: string) => {
  const user = await UserModal.findOne({ email });

  AppAssert(user, NOT_FOUND, "User not found");
  const FiveMinsAgo = fiveMinsAgo();

  const count = await VerificationCodeModel.countDocuments({
    userId: user._id,
    type: CodeTypes.PasswordReset,
    createdAt: { $gt: FiveMinsAgo },
  });

  AppAssert(count <= 1, TOO_MANY_REQUESTS, "Too many request, try again later");

  const expiresAt = oneHourFromNow();

  const ResetCode = await VerificationCodeModel.create({
    userId: user._id,
    type: CodeTypes.PasswordReset,
    expiresAt,
  });

  const url = `${APP_ORIGIN}/password/reset?code=${ResetCode._id}&expires=${expiresAt.getTime()}`;

  const { data, error } = await sendMail({
    to: user.email,
    ...getResetPasswordEmailTemplate(url),
  });

  AppAssert(
    data?.id,
    INTERNAL_SERVER_ERROR,
    `${error?.name} - ${error?.message}`
  );

  return {
    url,
    emailId: data?.id,
  };
};

type resetPasswordProps = {
  password: string;
  code: string;
};
export const resetPassword = async ({ password, code }: resetPasswordProps) => {
  const validateCode = await VerificationCodeModel.findOne({
    _id: code,
    type: CodeTypes.PasswordReset,
    expiresAt: { $gt: new Date() },
  });

  AppAssert(validateCode, NOT_FOUND, "Invalid code ");

  const updatedUser = await UserModal.findByIdAndUpdate(validateCode.userId, {
    password: await hashValue(password),
  });

  AppAssert(updatedUser, INTERNAL_SERVER_ERROR, "Failed to reset password ");

  await validateCode.deleteOne();

  //delete session
  await sessionModel.deleteMany({
    userId: updatedUser._id,
  });

  return { user: updatedUser.omitPassword() };
};
