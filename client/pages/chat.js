"use client";

import Header from "@/components/Header";
import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { supabase } from "@/supabase/client";
import axios from 'axios';

function Chat() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
      } else {
        setUser(user);
      }
    };

    checkUser();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session?.user) {
        router.push('/login');
      } else {
        setUser(session.user);
      }
    });

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, [router]);

  const handleSendMessage = async () => {
    if (message.trim()) {
      const newMessage = {
        sender: 'user',
        user: user.phone,
        content: message,
        timestamp: new Date().toISOString(),
      };

      // Add the new message to the messages array
      setMessages([...messages, newMessage]);

      // Clear the input field
      setMessage("");

      try {
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) {
          throw sessionError;
        }

        const response = await axios.post('http://127.0.0.1:8000/chat', {
          question: message,
        }, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${sessionData.session.access_token}`,
          },
        });

        const aiMessage = {
          sender: 'ai',
          user: 'AI',
          content: response.data.response,
          timestamp: new Date().toISOString(),
        };

        // Add the AI message to the messages array
        setMessages((prevMessages) => [...prevMessages, aiMessage]);
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  };

  return (
    <div>
      <Header />
      <div className="overflow-x-hidden flex min-h-screen">
        <div className="relative w-full mx-auto max-w-screen-xl py-12 sm:py-16 xl:pb-0">
          <div className="relative m-10 px-4 sm:px-6 lg:px-4 flex flex-col items-center">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Chat Interface</h1>
            <div className="flex flex-col items-center w-full max-w-lg">
              <div className="w-full h-96 bg-gray-100 rounded-lg p-4 overflow-y-auto">
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`mb-4 p-2 rounded ${
                      msg.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-white text-black'
                    }`}
                  >
                    <div className="text-sm text-gray-600">{msg.user}</div>
                    <div className="text-lg">{msg.content}</div>
                    <div className="text-xs text-gray-500">{new Date(msg.timestamp).toLocaleTimeString()}</div>
                  </div>
                ))}
              </div>
              <div className="flex items-center w-full mt-4">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="flex-grow rounded py-2 px-4 border border-gray-300"
                  placeholder="Type your message..."
                />
                <button
                  onClick={handleSendMessage}
                  className="ml-4 group flex items-center justify-center rounded py-2 px-4 text-center font-bold bg-indigo-600"
                >
                  <span className="text-white">Send</span>
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
    </div>
  );
}

export default Chat;