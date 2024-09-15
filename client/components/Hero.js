"use client";

function Hero() {
  return (
    <div className="overflow-x-hidden">
      <div className="relative mx-auto max-w-screen-xl py-12 sm:py-16 xl:pb-0">
        <div className="relative m-10 px-4 sm:px-6 lg:px-4 flex items-center">
          <div className="ml-40">
            <h1 className=" inline max-w-sm text-3xl font-bold leading-snug text-white sm:text-6xl sm:leading-snug lg:text-5xl lg:leading-snug">
              AI-driven
              <span className="text-blue-600 block">
                Resume Interactions
              </span>
            </h1>
            <div className="mt-10 sm:mb-20 flex">
              <button className="group flex items-center justify-center rounded py-3 px-3 text-center font-bold bg-indigo-600">
                {" "}
                <span className="text-white">Explore</span>
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
    </div>
  );
}

export default Hero;