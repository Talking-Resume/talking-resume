"use client";

import Header from "@/components/Header";
import { useState } from "react";

function Upload() {
  const [file, setFile] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = () => {
    if (file) {
      // Handle the file upload logic here
      console.log("Uploading file:", file);
    }
  };

  return (
    <>
    <Header/>
    <div className="overflow-x-hidden flex items-center justify-center min-h-screen ">
       
      <div className="relative mx-auto max-w-screen-xl py-12 sm:py-16 xl:pb-0">
        <div className="relative m-10 px-4 sm:px-6 lg:px-4 flex flex-col items-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-8">Upload your Resume here</h1>
          <div className="flex flex-col items-center">
            <input
              type="file"
              onChange={handleFileChange}
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="group flex items-center justify-center rounded py-3 px-3 text-center font-bold bg-indigo-600 cursor-pointer"
            >
              <span className="text-white">Choose your file</span>
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
            </label>
            {file && (
              <button
                onClick={handleUpload}
                className="mt-4 group flex items-center justify-center rounded py-3 px-3 text-center font-bold bg-green-600"
                disabled={!file} // Optional: Disable upload button if no file selected
              >
                <span className="text-white">Upload File</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
    </>
  );
}

export default Upload;