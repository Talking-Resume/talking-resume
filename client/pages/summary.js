"use client";

import Header from "@/components/Header";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/supabase/client";
import axios from "axios";

const SummaryPage = () => {
  const [summaryData, setSummaryData] = useState({
    summary: "",
    improvements: "",
    strengths: "",
    weaknesses: "",
  });
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkUserAndFetchSummary = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) {
          router.push("/login");
          return;
        }

        setUser(user);

        const { data: sessionData, error: sessionError } =
          await supabase.auth.getSession();
        if (sessionError) {
          throw sessionError;
        }

        if (sessionData?.session?.access_token) {
          const response = await axios.get(
            `${process.env.API_BASE_URL}/summary`,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${sessionData.session.access_token}`,
              },
            },
          );

          setSummaryData(response.data.summary_sections);
        } else {
          setError("No active session");
        }
      } catch (err) {
        setError("Failed to fetch summary");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    checkUserAndFetchSummary();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (!session?.user) {
          router.push("/login");
        } else {
          setUser(session.user);
        }
      },
    );

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, [router]);

  return (
    <>
      <Header />
      <div className="overflow-x-hidden overflow-y-hidden flex items-center justify-center min-h-screen">
        <div className="relative m-10 px-4 sm:px-6 lg:px-4 flex flex-col items-center">
          {error && <div className="mb-4 text-red-500">{error}</div>}
          {loading ? (
            <div className="flex flex-col justify-center items-center">
              <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-16 w-16 mb-4"></div>
              <div className="text-gray-600 text-lg">Loading Summary...</div>
            </div>
          ) : (
            <>
              <div className="flex justify-center items-center">
                <h2 className="mb-8 text-4xl font-bold tracking-tighter text-blue-600 lg:text-6xl md:text-5xl animate-jump-in animate-once animate-delay-800 animate-ease-linear animate-fill-both text-center">
                  <span>Insights</span>
                  <br className="hidden lg:block"></br>
                </h2>
              </div>
              {summaryData.summary && (
                <div className="container  mx-auto w-full">
                  <div className="relative wrap overflow-hidden p-10 h-full">
                    <div
                      className="border-2-2 absolute border-opacity-20 border-white h-full border"
                      style={{ left: "50%" }}
                    ></div>

                    <div className="mb-8 flex justify-between items-center w-full lg:right-timeline">
                      <div className="order-1 lg:w-5/12"></div>
                      <div className="hidden lg:z-20 lg:flex lg:items-center lg:order-1 lg:bg-blue-600 lg:shadow-xl lg:w-8 lg:h-8 lg:rounded-full">
                        <h1 className=" lg:mx-auto lg:font-semibold text-lg lg:text-white">
                          1
                        </h1>
                      </div>
                      <div className="order-1 bg-white rounded-lg shadow-xl lg:w-5/12 px-6 py-4 animate-wiggle animate-infinite animate-duration-[5000ms] animate-ease-linear">
                        <h3 className="mb-3 font-bold text-gray-800 text-xl">
                          Summary
                        </h3>
                        <div
                          className="text-sm leading-snug tracking-wide text-gray-900 text-opacity-100"
                          dangerouslySetInnerHTML={{
                            __html: summaryData.summary,
                          }}
                        />
                      </div>
                    </div>

                    <div className="mb-8 flex justify-between flex-row-reverse items-center w-full lg:left-timeline">
                      <div className="order-1 w-5/12"></div>
                      <div className="hidden lg:z-20 lg:flex lg:items-center lg:order-1 lg:bg-blue-600 lg:shadow-xl lg:w-8 lg:h-8 lg:rounded-full">
                        <h1 className="mx-auto text-white font-semibold text-lg">
                          2
                        </h1>
                      </div>
                      <div className="order-1 bg-blue-600 rounded-lg shadow-xl lg:w-5/12 px-6 py-4 animate-wiggle animate-infinite animate-duration-[5000ms] animate-ease-linear">
                        <h3 className="mb-3 font-bold text-white text-xl">
                          Improvements
                        </h3>
                        <div
                          className="text-sm font-medium leading-snug tracking-wide text-white text-opacity-100"
                          dangerouslySetInnerHTML={{
                            __html: summaryData.improvements,
                          }}
                        />
                      </div>
                    </div>

                    <div className="mb-8 flex justify-between items-center w-full lg:right-timeline">
                      <div className="order-1 lg:w-5/12"></div>
                      <div className="hidden lg:z-20 lg:flex lg:items-center lg:order-1 lg:bg-blue-600 lg:shadow-xl lg:w-8 lg:h-8 lg:rounded-full">
                        <h1 className="mx-auto font-semibold text-lg text-white">
                          3
                        </h1>
                      </div>
                      <div className="order-1 bg-white rounded-lg shadow-xl lg:w-5/12 px-6 py-4 animate-wiggle animate-infinite animate-duration-[5000ms] animate-ease-linear">
                        <h3 className="mb-3 font-bold text-gray-800 text-xl">
                          Strengths
                        </h3>
                        <div
                          className="text-sm leading-snug tracking-wide text-gray-900 text-opacity-100"
                          dangerouslySetInnerHTML={{
                            __html: summaryData.strengths,
                          }}
                        />
                      </div>
                    </div>

                    <div className="mb-8 flex justify-between flex-row-reverse items-center w-full lg:left-timeline">
                      <div className="order-1 w-5/12"></div>
                      <div className="hidden lg:z-20 lg:flex lg:items-center lg:order-1 lg:bg-blue-600 lg:shadow-xl lg:w-8 lg:h-8 lg:rounded-full">
                        <h1 className="mx-auto text-white font-semibold text-lg">
                          4
                        </h1>
                      </div>
                      <div className="order-1 bg-blue-600 rounded-lg shadow-xl lg:w-5/12 px-6 py-4 animate-wiggle animate-infinite animate-duration-[5000ms] animate-ease-linear">
                        <h3 className="mb-3 font-bold text-white text-xl">
                          Weaknesses
                        </h3>
                        <div
                          className="text-sm font-medium leading-snug tracking-wide text-white text-opacity-100"
                          dangerouslySetInnerHTML={{
                            __html: summaryData.weaknesses,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default SummaryPage;
