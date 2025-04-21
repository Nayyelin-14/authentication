import assert from "node:assert"; // assert is a built-in module in Node.js used for assertion testing. It's typically used to validate that certain conditions are true. If the condition is false, it throws an error.
import AppError, { AppErrorCode } from "./AppError";

type AppAssertType = (
  condition: any,
  httpstatusCode: number,
  message: string,
  errorCode?: AppErrorCode
) => asserts condition;

export const AppAssert: AppAssertType = (
  condition,
  httpstatusCode,
  message,
  errorCode
) => assert(condition, new AppError(httpstatusCode, message, errorCode));
