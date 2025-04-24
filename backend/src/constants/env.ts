import dotenv from "dotenv";
dotenv.config();
const getEnv = (key: string, defaultValue?: string): string => {
  const value = process.env[key] || defaultValue;
  console.log(value);
  if (value === undefined) {
    throw new Error(`Missing evnironment variable ${key}`);
  }
  return value;
};

export const MONGO_URI = getEnv("MONGO_URI");
export const PORT = getEnv("PORT");
export const APP_ORIGIN = getEnv("APP_ORIGIN");
export const JWT_SECRET = getEnv("JWT_SECRET");
export const JWT_REFRESH_SECRET = getEnv("JWT_REFRESH_SECRET");
export const RESEND_API = getEnv("RESEND_API");
export const NODE_ENV = getEnv("NODE_ENV", "development");
