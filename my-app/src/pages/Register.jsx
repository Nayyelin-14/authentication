import { useMutation } from "@tanstack/react-query";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { RegisterAction } from "../lib/api";
import { m } from "framer-motion";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();
  const {
    mutate: signUp,
    isPending,
    isError,
    error,
  } = useMutation({
    mutationFn: RegisterAction,
    onSuccess: () => {
      navigate("/", {
        replace: true,
      });
    },
  });

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-[60%]">
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault(); // ⛔️ prevent browser from submitting the form
            signUp({ email, password, confirmPassword });
          }}
        >
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
            />
          </div>
          <div className="mb-6">
            <label for="password" className="block text-gray-700">
              Password
            </label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              name="password"
              required
              className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Enter your password"
            />
          </div>{" "}
          <div className="mb-6">
            <label htmlFor="confirmPassword" className="block text-gray-700">
              Confirm password
            </label>
            <input
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              type="password"
              name="confirmPassword"
              required
              className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Enter your confirmPassword"
              onKeyDown={(e) =>
                e.key === "Enter" &&
                signIn({ email, password, confirmPassword })
              }
            />
          </div>
          {isError && (
            <div className="text-red-500 my-3 ">
              {(error && error?.message) || "Something went wrong"}
            </div>
          )}
          <button
            disabled={
              !email || password.length < 6 || password !== confirmPassword
            }
            type="submit"
            className="w-full py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none disabled:bg-gray-400"
          >
            {isPending ? "Creating" : "Create"}
          </button>
        </form>

        <div className="text-center mt-4">
          Already have an account?
          <Link to={"/login"} className="text-blue-500 text-sm hover:underline">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
