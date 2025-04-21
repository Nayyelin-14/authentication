export const enum AppErrorCode {
  InvalidAccessToken = "InvalidAccessToken",
}

class AppError extends Error {
  constructor(
    //The constructor is a special method inside a class that runs automatically when you create a new object from that class.
    public statusCode: number,
    public message: string,
    public errorCode?: AppErrorCode
  ) {
    super(message); //// Calls the Error constructor
  }
}

export default AppError;
