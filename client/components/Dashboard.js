"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import axios from "axios";
import Modal from "@/components/ui/modal";

const Dashboard = () => {
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);
  const [isPromptModalOpen, setIsPromptModalOpen] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [text, setText] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [industry, setIndustry] = useState("");
  const [generatedPosts, setGeneratedPosts] = useState({
    linkedin_post: "",
    twitter_post: "",
    insta_post: "",
  });
  const [imageData, setImageData] = useState(null);

  const openManualModal = () => setIsManualModalOpen(true);
  const closeManualModal = () => setIsManualModalOpen(false);

  const openPromptModal = () => setIsPromptModalOpen(true);
  const closePromptModal = () => setIsPromptModalOpen(false);

  const handleGeneratePosts = async () => {
    if (!text || !companyName || !industry) {
      alert("Please fill out all fields");
      return;
    }
    setLoading2(true);
    try {
      const response = await axios.post(
        `${process.env.API_BASE_URL}/generate-posts/`,
        {
          text,
          name: companyName,
          industry,
        },
      );
      const formattedData = {
        linkedin_post: response.data.linkedin_post.replace(/\n/g, "<br />"),
        twitter_post: response.data.twitter_post.replace(/\n/g, "<br />"),
        insta_post: response.data.insta_post.replace(/\n/g, "<br />"),
      };
      setGeneratedPosts(formattedData);
      alert("Posts generated successfully");
    } catch (error) {
      console.error("Error generating posts:", error);
      alert("Failed to generate posts");
    } finally {
      setLoading2(false);
    }
  };

  // Function to download the image
  const downloadImage = (dataUrl) => {
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = "generated-image.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Function to share on social media
  const shareOnSocialMedia = (platform, textContent) => {
    // const canvas = document.createElement('canvas');
    // const ctx = canvas.getContext('2d');
    // const image = new Image();

    // image.onload = () => {
    //   canvas.width = image.width;
    //   canvas.height = image.height;
    //   ctx.drawImage(image, 0, 0);
    //   const imageBase64 = canvas.toDataURL('image/png');

    //   let url = '';
    //   const text = encodeURIComponent('Check out this image!');
    //   if (platform === 'twitter') {
    //     url = `https://twitter.com/intent/tweet?text=${text}`;
    //   } else if (platform === 'instagram') {
    //     alert('Instagram does not support direct posting via URL. Please download and share manually.');
    //     return;
    //   }
    //   window.open(url, '_blank');
    // };

    // image.src = dataUrl;
    let url = "";
    const text = encodeURIComponent(textContent);

    if (platform === "twitter") {
      url = `https://twitter.com/intent/tweet?text=${text}`;
    } else if (platform === "linkedin") {
      url = `https://www.linkedin.com/sharing/share-offsite/`;
    } else if (platform === "instagram") {
      alert(
        "Instagram does not support direct posting via URL. Please copy the text and share manually.",
      );
      return;
    }

    window.open(url, "_blank");
  };

  const handleGenerateImage = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${process.env.API_BASE_URL}/generate-image/`,
        {
          prompt: prompt,
        },
        { responseType: "arraybuffer" },
      );

      if (response.data instanceof ArrayBuffer) {
        const base64 = btoa(
          new Uint8Array(response.data).reduce(
            (data, byte) => data + String.fromCharCode(byte),
            "",
          ),
        );
        setTimeout(() => {
          setImageData("data:;base64," + base64);
        }, 10000);
      } else {
        console.error("Unexpected server response format");
      }
    } catch (error) {
      console.error("Error generating image:", error);
      alert("Failed to generate image");
    } finally {
      setLoading(false);
    }
  };

  const getPrompt = async () => {
    const apiUrl = `${process.env.API_BASE_URL}/automate-prompt/`;
    try {
      const response = await axios.get(apiUrl);
      if (typeof response.data === "string") {
        setPrompt(response.data);
      } else {
        console.error("Unexpected server response format");
      }
    } catch (error) {
      console.error("Error fetching prompt:", error);
    }
  };

  return (
    <div className="flex flex-row items-center justify-center h-45 p-4 mt-4">
   Hello World
    </div>
  );
};

export default Dashboard;