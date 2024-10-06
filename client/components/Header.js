"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../supabase/client";

export default function Header() {
  const router = useRouter();
  const [navbarOpen, setNavbarOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };

    checkUser();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user || null);
      },
    );

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  const handleLoginClick = () => {
    router.push("/login");
  };

  const handleLogoutClick = async () => {
    await supabase.auth.signOut();
    setUser(null);
    router.push("/");
  };

  return (
    <header className="text-white body-font">
      <div className="container mx-auto flex flex-wrap p-5 md:flex-row">
        <a
          className="flex title-font font-medium text-white mb-4 md:mb-0 pr-4"
          href="/"
        >
          <span className="ml-3 text-3xl">Talking Resume</span>
        </a>
        <button
          className="text-white cursor-pointer text-xl leading-none py-1 border border-solid border-transparent rounded bg-transparent block md:hidden outline-none focus:outline-none ml-auto pb-3"
          type="button"
          onClick={() => setNavbarOpen(!navbarOpen)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="feather feather-menu"
          >
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>
        <div
          className={
            "md:flex flex-grow items-center" +
            (navbarOpen ? " flex" : " hidden")
          }
          id="example-navbar-danger"
        >
          <nav className="md:ml-auto flex flex-wrap items-center text-base justify-center font-semibold pl-7">
            {user ? (
              <button
                className="px-4 py-2 mt-2 text-sm font-semibold text-white bg-blue-600 transition duration-500 ease-in-out transform bg-transparent rounded-lg dark:text-gray-300 md:mt-0 md:ml-4 hover:text-gray-900 focus:text-gray-900 hover:bg-gray-100 focus:bg-gray-200 focus:outline-none focus:shadow-outline"
                onClick={handleLogoutClick}
              >
                Logout
              </button>
            ) : (
              <button
                className="px-4 py-2 mt-2 text-sm font-semibold text-white bg-blue-600 transition duration-500 ease-in-out transform bg-transparent rounded-lg dark:text-gray-300 md:mt-0 md:ml-4 hover:text-gray-900 focus:text-gray-900 hover:bg-gray-100 focus:bg-gray-200 focus:outline-none focus:shadow-outline"
                onClick={handleLoginClick}
              >
                Login
              </button>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
