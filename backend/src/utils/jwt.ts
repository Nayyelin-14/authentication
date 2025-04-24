import jwt, { SignOptions, VerifyOptions } from "jsonwebtoken";
//SignOptions: Options for signing a JWT (like expiresIn, audiencez VerifyOptions: Options for verifying a JWT (like audience, issuer).
import { sessionDocument } from "../models/session.model";
import { UserDocument } from "../models/user.model";
import { JWT_REFRESH_SECRET, JWT_SECRET } from "../constants/env";

export type refreshTokenType = {
  sessionId: sessionDocument["_id"];
};

export type accessTokenType = {
  sessionId: sessionDocument["_id"];
  userId: UserDocument["_id"];
};
type SignOptionsAndSecret = SignOptions & {
  secret: string; //extending the built-in SignOptions with a required secret.
};

const defaults: SignOptions = {
  audience: ["user"],
};

const accessTokenOption: SignOptionsAndSecret = {
  expiresIn: "15m",
  secret: JWT_SECRET,
};
export const refreshTokenOption: SignOptionsAndSecret = {
  expiresIn: "30d",
  secret: JWT_REFRESH_SECRET,
};

export const signToken = (
  payload: accessTokenType | refreshTokenType,
  options?: SignOptionsAndSecret
) => {
  const { secret, ...signOpts } = options || accessTokenOption;

  return jwt.sign(payload, secret, {
    ...defaults,
    ...signOpts, //This ensures that anything in signOpts overwrites the same keys in defaults
  });
};

export const verfiyToken = <TPayload extends object = accessTokenType>(
  token: string,
  options?: VerifyOptions & { secret: string }
) => {
  const { secret = JWT_SECRET, ...verifyOpts } = options || {};
  try {
    const payload = jwt.verify(token, secret, {
      ...defaults,
      ...verifyOpts,
    }) as TPayload;
    return { payload };
  } catch (error: any) {
    return {
      error: error.message,
    };
  }
};
