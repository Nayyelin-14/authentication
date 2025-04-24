import { useQuery } from "@tanstack/react-query";
import React from "react";
import { Link, useParams } from "react-router-dom";
import { VerifyEmail } from "../lib/api";

const VerfiyEmail = () => {
  const { code } = useParams();
  const { isPending, isSuccess, isError } = useQuery({
    queryKey: ["emailverification", code],
    queryFn: () => VerifyEmail(code),
  });
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="border border-gray-300 p-4 shadow-lg rounded-lg shadow-gray-400 flex-col gap-3 items-center ">
        <p className="text-2xl font-bold">Email verificaition</p>

        {isPending && (
          <p className="text-2xl font-bold">Verifing the code, please wait </p>
        )}
        {isSuccess && (
          <p className="text-2xl font-bold text-green-600 rounded-lg  p-2 border border-gray-500 bg-green-300">
            Verified Email
          </p>
        )}
        {isError && (
          <div>
            <p className="text-2xl font-bold">The link is expired or invalid</p>
            <Link to={"/register"} replace className="text-2xl font-bold">
              Get a new code to verify{" "}
            </Link>
          </div>
        )}
        <Link to={"/"} replace className="text-2xl font-bold">
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default VerfiyEmail;
