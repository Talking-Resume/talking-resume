"use client";

import Header from "@/components/Header";
import { useState, useRef } from "react";
import { supabase } from '../supabase/client'
import { useRouter } from "next/navigation";

function Login() {
  const router=useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formState, setFormState] = useState("SEND_OTP");
  const phoneRef = useRef("");
  const otpRef = useRef("");

  const handleSendOtp = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    const phone = phoneRef.current;
    if (!/^\+[1-9]{1}[0-9]{3,14}$/.test(phone)) {
      setError("Please enter a valid mobile number");
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.signInWithOtp({ phone });
    if (error) {
      console.error("Error sending otp:", error);
      setError(error.error_description || error.message);
    } else {
      setFormState("LOGIN");
      alert('Check your sms for the otp!');
    }
    setLoading(false);
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    const otp = otpRef.current;
    const phone = phoneRef.current;

    const { data, error } = await supabase.auth.verifyOtp({
      phone,
      token: otp,
      type: 'sms'
    });

    if (error) {
      console.error("Error verifying otp:", error);
      setError(error.error_description || error.message);
    } else {
      alert('Successfully authenticated!');
      router.push('upload')
      
    }
    setLoading(false);
  };

  return (
    <>
      <Header />
      <div className="overflow-x-hidden overflow-y-hidden flex items-center justify-center min-h-screen ">
        <div className="relative mx-auto max-w-screen-xl py-12 sm:py-16 xl:pb-0 bg-gray-100">
          <div className="relative m-10 px-4 sm:px-6 lg:px-4 flex flex-col items-center ">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Login</h1>
            {error && (
              <div className="mb-4 text-red-500">
                {error}
              </div>
            )}
            <div className="flex flex-col items-center">
              {formState === "SEND_OTP" && (
                <>
                  <input
                    type="tel"
                    onChange={(e) => (phoneRef.current = e.target.value)}
                    placeholder="Phone Number"
                    className="mb-4 p-3 rounded border border-gray-300 w-80"
                  />
                  <button
                    onClick={handleSendOtp}
                    className="group flex items-center justify-center rounded py-3 px-3 text-center font-bold bg-indigo-600"
                    disabled={loading}
                  >
                    <span className="text-white">Send OTP</span>
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
                </>
              )}
              {formState === "LOGIN" && (
                <>
                  <input
                    type="text"
                    onChange={(e) => (otpRef.current = e.target.value)}
                    placeholder="OTP"
                    className="mb-4 p-3 rounded border border-gray-300 w-80"
                  />
                  <button
                    onClick={handleLogin}
                    className="group flex items-center justify-center rounded py-3 px-3 text-center font-bold bg-indigo-600"
                    disabled={loading}
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
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;