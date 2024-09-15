"use client";

import Header from "@/components/Header";
import { useState } from "react";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    console.log("Logging in with:", { email, password });
  };

  return (
    <>
      <Header />
      <div className="overflow-x-hidden overflow-y-hidden flex items-center justify-center min-h-screen ">
        <div className="relative mx-auto max-w-screen-xl py-12 sm:py-16 xl:pb-0 bg-gray-100">
          <div className="relative m-10 px-4 sm:px-6 lg:px-4 flex flex-col items-center ">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Login</h1>
            <div className="flex flex-col items-center">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="mb-4 p-3 rounded border border-gray-300 w-80"
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="mb-4 p-3 rounded border border-gray-300 w-80"
              />
              <button
                onClick={handleLogin}
                className="group flex items-center justify-center rounded py-3 px-3 text-center font-bold bg-indigo-600"
              >
                <span className="text-white">Login</span>
                <svg
                  className="ml-2 h-6 w-6 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;