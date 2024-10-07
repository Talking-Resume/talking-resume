"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/supabase/client";

function Hero() {
  const router = useRouter();
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

  const handleExploreClick = () => {
    if (user) {
      router.push("/upload");
    } else {
      router.push("/login");
    }
  };

  return (
    <div className="overflow-x-hidden flex accordion-up  animate-pulse animate-bounce animate-duration-[4000ms] animate-ease-linear">
      <div className="relative   mx-auto max-w-screen-xl py-12 sm:py-16 xl:pb-0 ">
        <div className="relative m-10 px-4 sm:px-6  flex items-center justify-center ">
          <div className="ml-0 lg:ml-30 text-center ">
            <h1 className="inline max-w-sm text-3xl font-bold leading-snug text-white sm:text-6xl sm:leading-snug lg:text-5xl lg:leading-snug">
              An Interactive AI Assistant
              <span className="text-blue-600 block">
                {" "}
                Helping you Craft Your Resume
              </span>
            </h1>
            <div className="mt-10 sm:mb-20 flex justify-center">
              <button
                className="group flex items-center justify-center rounded py-3 px-3 text-center font-bold bg-blue-600"
                onClick={handleExploreClick}
              >
                <span className="text-white inline-center justify-center">
                  Explore
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Hero;
