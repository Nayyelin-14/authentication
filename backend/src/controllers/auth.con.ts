import { z } from "zod";
import catchErrors from "../utils/catchErrors";
import {
  CreateAccount,
  loginAccount,
  refreshUseraccessToken,
} from "../services/auth.service";
import { CREATED, OK, UNAUTHORIZED } from "../constants/http";
import {
  clearcookie,
  getAccessTokenOptions,
  getRefreshTokenOptions,
  setCookies,
} from "../utils/setCookies";
import { loginSchema, registerSchema } from "../types/auth.schema";
import { refreshTokenOption, verfiyToken } from "../utils/jwt";
import sessionModel from "../models/session.model";
import { AppAssert } from "../utils/appAssert";

export const registerHandler = catchErrors(async (req, res) => {
  const request = registerSchema.parse({
    ...req.body,
    userAgent: req.headers["user-agent"],
  });
  const { user, refreshToken, accessToken } = await CreateAccount(request);

  return setCookies({ res, accessToken, refreshToken })
    .status(CREATED)
    .json(user);
});

export const loginHandler = catchErrors(async (req, res) => {
  const request = loginSchema.parse({
    ...req.body,
    userAgent: req.headers["user-agent"],
  });

  const { user, refreshToken, accessToken } = await loginAccount(request);

  return setCookies({ res, accessToken, refreshToken }).status(OK).json(user);
});

export const logoutHandler = catchErrors(async (req, res) => {
  const accessToken = req.cookies.accessToken;
  if (!accessToken) {
    return res.status(UNAUTHORIZED).json({ message: "Token not found" });
  }

  const { payload, error } = verfiyToken(accessToken);
  if (error || !payload) {
    return res.status(UNAUTHORIZED).json({ message: "Unauthorized" });
  }

  if (payload) {
    const deletedSession = await sessionModel.findByIdAndDelete(
      payload.sessionId
    );
    if (!deletedSession) {
      return res
        .status(UNAUTHORIZED)
        .clearCookie("accessToken")
        .clearCookie("refreshToken")
        .json({
          message: "Session not found during logout:",
        });
    }
  }

  return clearcookie(res).status(OK).json({
    message: "Logout",
  });
});

export const refreshToken = catchErrors(async (req, res) => {
  const refreshToken = req.cookies.refreshToken as string | undefined;

  AppAssert(refreshToken, UNAUTHORIZED, "Missing refresh token"); //will throw when the value is null, undefined, false, 0, '', or any other falsy value.

  const { accessToken, newRefreshToken } =
    await refreshUseraccessToken(refreshToken);

  if (newRefreshToken) {
    res.cookie("refreshToken", newRefreshToken, getRefreshTokenOptions());
  }

  return res
    .status(OK)
    .cookie("accessToken", accessToken, getAccessTokenOptions())
    .json({
      message: "Access Token Refreshed",
    });
});
