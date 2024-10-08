"use client";

import Header from "@/components/Header";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/supabase/client";

function Upload() {
  const [file, setFile] = useState(null);
  const [user, setUser] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState("");
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
      } else {
        setUser(user);
      }
    };

    checkUser();

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

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
      setUploadStatus("");
    } else {
      setUploadStatus("Only PDF files are allowed.");
    }
  };

  const handleUpload = async () => {
    console.log(user);
    if (file) {
      const fileName = `${user.id}/Resume.pdf`;

      try {
        const { data: existingFile, error: checkError } = await supabase.storage
          .from("uploads")
          .list(user.id, {
            search: "Resume.pdf",
          });

        if (checkError) {
          throw checkError;
        }

        if (existingFile && existingFile.length > 0) {
          const { error: deleteError } = await supabase.storage
            .from("uploads")
            .remove([fileName]);

          if (deleteError) {
            throw deleteError;
          }

          console.log("Previous file deleted successfully");
        }

        // Upload the new file
        const { data, error } = await supabase.storage
          .from("uploads")
          .upload(fileName, file, {
            cacheControl: "3600",
            upsert: false,
          });

        if (error) {
          throw error;
        }

        console.log("File uploaded successfully:", data);
        setUploadStatus("File Uploaded Successfully!");

        setTimeout(() => {
          router.push("/chat");
        }, 2000);
      } catch (error) {
        console.error("Error uploading file:", error.message);
        setUploadStatus("Failed to upload file");
      }
    }
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length) {
      const selectedFile = files[0];
      if (selectedFile.type === "application/pdf") {
        setFile(selectedFile);
        setUploadStatus("");
      } else {
        setUploadStatus("Only PDF files are allowed.");
      }
    }
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  return (
    <div className="min-h-screen flex flex-col ">
      <Header />
      <div className="flex-grow flex justify-center items-center">
        <div className="relative mx-auto mt -5 justify-center max-w-screen-md py-4 sm:py-12 xl:pb-0">
          <div className="relative  px-4 sm:px-6 lg:px-4 flex flex-col items-center">
            <h1 className="text-3xl font-bold text-gray-100 mb-6">
              Upload your Resume here
            </h1>
            <div
              id="dropzone"
              className={`border-2 ${
                isDragging ? "border-blue-500" : "border-gray-300"
              } p-8 w-full text-center cursor-pointer`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => document.getElementById("file-upload").click()}
            >
              <div>
                <div className="text-1xl font-italic text-gray-200 mb-3">
                  {uploadStatus ||
                    "Drag and drop your resume here, or click to select a file"}
                </div>
                <div className="mt-4">
                  {uploadProgress >= 0 && uploadProgress <= 100 ? (
                    <progress
                      value={uploadProgress}
                      max="100"
                      className="w-full"
                    />
                  ) : (
                    ""
                  )}
                </div>
              </div>
            </div>
            <input
              id="file-upload"
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
              className="hidden"
            />
            {file && (
              <button
                onClick={handleUpload}
                className="mt-5 group flex items-center justify-center rounded py-3 px-3 text-center font-bold bg-sky-800"
                disabled={!file} // Optional: Disable upload button if no file selected
              >
                <span className="text-gray-200 ">Upload File</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Upload;
