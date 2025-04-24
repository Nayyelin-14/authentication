import { useMutation } from "@tanstack/react-query";
import React, { useState } from "react";
import { SendEmailToReset } from "../lib/api";

const Forgotpassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const {
    mutate: sendPasswordReset,
    isPending,
    isSuccess,
    isError,
    error,
  } = useMutation({
    mutationFn: SendEmailToReset,
    onSuccess: (response) => {
      setMessage(response.message); // ✅ pull message from API response
    },
  });

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-[60%]">
        <h2 className="text-2xl font-bold text-center mb-6">
          Fill to email to get reset link
        </h2>
        <form
          onSubmit={(e) => {
            e.preventDefault(); // ⛔️ prevent browser from submitting the form
            sendPasswordReset({ email });
          }}
        >
          {isError && (
            <div className="text-red-500 my-3 ">
              {error.message || "SOmething went wrong"}{" "}
            </div>
          )}

          {isSuccess ? (
            <div className="text-green-500 my-3 p-4 flex items-center gap-4   border border-gray-200 rounde-lg">
              {message}
              <a
                href="https://mail.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-2 px-4 py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600"
              >
                Open Gmail
              </a>
            </div>
          ) : (
            <>
              {" "}
              <div className="mb-4">
                <label for="email" className="block text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="Enter your email"
                  onKeyDown={(e) =>
                    e.key === "Enter" && signIn({ email, password })
                  }
                />
              </div>
              <button
                disabled={!email}
                type="submit"
                className="w-full py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none disabled:bg-gray-400"
              >
                {isPending ? "Logging in..." : "Login"}
              </button>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default Forgotpassword;
