import { Request, RequestHandler } from "express";
import { AppAssert } from "../utils/appAssert";
import { UNAUTHORIZED } from "../constants/http";
import { AppErrorCode } from "../utils/AppError";
import { refreshTokenType, verfiyToken } from "../utils/jwt";
const authenticate: RequestHandler = (req, res, next) => {
  console.log(req.userId);
  const accessToken = req.cookies.accessToken as string | undefined;
  AppAssert(
    accessToken,
    UNAUTHORIZED,
    "Not authorized",
    AppErrorCode.InvalidAccessToken
  );

  const { error, payload } = verfiyToken(accessToken);
  AppAssert(
    payload,
    UNAUTHORIZED,
    error === "jwt expired" ? "Token expired" : "Invalid token",
    AppErrorCode.InvalidAccessToken
  );
  // @ts-ignore
  req.userId = payload.userId;
  // @ts-ignore
  req.sessionId = payload.sessionId;
  next();
};

export default authenticate;
///refresh so yin d lo
// const authenticate: RequestHandler = async (req, res, next) => {
//   const refreshToken = req.cookies.refreshToken as string | undefined;
//   AppAssert(
//     refreshToken,
//     UNAUTHORIZED,
//     "Not an authorized user",
//     AppErrorCode.InvalidAccessToken
//   );

//   const { payload, error } = verfiyToken<refreshTokenType>(refreshToken);
//   console.log("authenticated result", payload, error);
//   AppAssert(
//     payload,
//     UNAUTHORIZED,
//     error === "jwt expired" ? "Token expired" : "Invalid Token",
//     AppErrorCode.InvalidAccessToken
//   );

//   //   const userId = payload.userId;
//   const sessionId = payload.sessionId;
//   next();
// };
