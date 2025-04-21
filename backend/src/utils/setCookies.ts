import { CookieOptions, Request, Response } from "express";
import { fifteenminsFromNow, thirtyDayFromNow } from "./data";

const defaults: CookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV !== "development",
  sameSite: "strict",
};

export const getAccessTokenOptions = (): CookieOptions => ({
  ...defaults,
  expires: fifteenminsFromNow(),
});
export const getRefreshTokenOptions = (): CookieOptions => ({
  ...defaults,
  expires: thirtyDayFromNow(),
  path: "/auth/refresh", //The refreshToken cookie will only be sent to the server when a request is made to a URL that starts with /auth/refresh
});
type cookieType = {
  res: Response;
  accessToken: string;
  refreshToken: string;
};

export const setCookies = ({ res, accessToken, refreshToken }: cookieType) => {
  return res
    .cookie("accessToken", accessToken, getAccessTokenOptions())
    .cookie("refreshToken", refreshToken, getRefreshTokenOptions());
};

export const clearcookie = (res: Response) => {
  return res.clearCookie("accessToken").clearCookie("refreshToken", {
    path: "/auth/refresh",
  });
};
