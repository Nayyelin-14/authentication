import API from "../configs/apiClient"; // Axios instance

export const LoginAction = async (data) => {
  try {
    const response = await API.post("/auth/login", data);
    return response;
  } catch (error) {
    // Axios error format
    const message = error.response?.data?.message || "Invalid credentials";
    throw new Error(message);
  }
};

export const RegisterAction = async (data) => {
  try {
    const response = await API.post("/auth/register", data);
    console.log(response);
    return response;
  } catch (error) {
    // Axios error format

    const message = error.response?.data?.message || "Invalid credentials";
    throw new Error(message);
  }
};

export const VerifyEmail = async (verificationCode) => {
  try {
    const response = await API.post(`/auth/email/verify/${verificationCode}`);
    return response;
  } catch (error) {
    // Axios error format
    console.log(error);
    const message = error?.message || "Invalid credentials";
    throw new Error(message);
  }
};

export const SendEmailToReset = async (email) => {
  try {
    const response = await API.post(`/auth/password/forgot`, email);
    console.log(response);
    return response;
  } catch (error) {
    // Axios error format
    console.log(error);
    const message = error?.message || "Invalid credentials";
    throw new Error(message);
  }
};

export const ResetPasswordAction = async ({ password, resetCode }) => {
  try {
    const response = await API.post(`/auth/password/reset`, {
      password,
      code: resetCode,
    });
    console.log(response);
    return response;
  } catch (error) {
    // Axios error format
    console.log(error);
    const message = error?.message || "Invalid credentials";
    throw new Error(message);
  }
};
