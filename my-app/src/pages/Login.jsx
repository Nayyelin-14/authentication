import { useMutation } from "@tanstack/react-query";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LoginAction } from "../lib/api";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const {
    mutate: signIn,
    isPending,
    isError,
  } = useMutation({
    mutationFn: LoginAction,
    onSuccess: () => {
      console.log("hi");
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
            signIn({ email, password });
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
              onKeyDown={(e) =>
                e.key === "Enter" && signIn({ email, password })
              }
            />
          </div>
          {isError && (
            <div className="text-red-500 my-3 ">Invalid Credentials</div>
          )}
          <button
            disabled={!email || password.length < 6}
            type="submit"
            className="w-full py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none disabled:bg-gray-400"
          >
            {isPending ? "Logging in..." : "Login"}
          </button>
        </form>
        <div className="text-end mt-4">
          <Link
            to={"/forgot"}
            className="text-blue-500 text-sm hover:underline"
          >
            Forgot your password?
          </Link>
        </div>
        <div className="text-end mt-4">
          <Link
            to={"/password/forgot"}
            className="text-blue-500 text-sm hover:underline"
          >
            Forgot your password?
          </Link>
        </div>{" "}
        <div className="text-center mt-4">
          Don't have an account?
          <Link
            to={"/register"}
            className="text-blue-500 text-sm hover:underline"
          >
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
