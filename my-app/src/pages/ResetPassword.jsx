import { useMutation } from "@tanstack/react-query";
import React, { useState } from "react";
import { ResetPasswordAction } from "../lib/api";
import { Link, useSearchParams } from "react-router-dom";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const resetCode = searchParams.get("code");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const {
    mutate: PasswordReset,
    isPending,
    isSuccess,
    isError,
    error,
  } = useMutation({
    mutationFn: ResetPasswordAction,
    onSuccess: (response) => {
      setMessage(response.message); // ✅ pull message from API response
    },
    onError: (response) => {
      setMessage(response.message); // ✅ pull message from API response
    },
  });

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-[60%]">
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault(); // ⛔️ prevent browser from submitting the form
            PasswordReset({ password, resetCode });
          }}
        >
          {isError && (
            <div className="text-red-500 my-3 ">
              {message ? message : "Invalid Credentials"}
            </div>
          )}
          {isSuccess ? (
            <>
              {" "}
              <div className="text-green-500 my-3 p-4 flex items-center gap-4   border border-gray-200 rounde-lg">
                {message}
              </div>
            </>
          ) : (
            <>
              <div className="mb-6">
                <label for="password" className="block text-gray-700">
                  Password
                </label>
                <input
                  disabled={isPending}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  name="password"
                  required
                  className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="Enter your password"
                  onKeyDown={(e) =>
                    e.key === "Enter" && PasswordReset({ password, resetCode })
                  }
                />
              </div>
              <button
                disabled={password.length < 6 || isPending}
                type="submit"
                className="w-full py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none disabled:bg-gray-400"
              >
                {isPending ? "Resetting" : "Reset Password"}
              </button>
            </>
          )}
        </form>

        {isSuccess ? (
          <>
            <div className="text-center mt-4">
              <Link
                to={"/login"}
                className="text-blue-500 text-sm hover:underline"
              >
                Go back to login
              </Link>
            </div>
          </>
        ) : (
          <div className="text-center mt-4">
            Don't have an account?
            <Link
              to={"/register"}
              className="text-blue-500 text-sm hover:underline"
            >
              Sign up
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
