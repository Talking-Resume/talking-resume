import Header from "@/components/Header";
import { useState, useEffect, useRef } from "react";
import { useRouter } from 'next/navigation';
import { supabase } from "@/supabase/client";
import axios from 'axios';

function Chat() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [user, setUser] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false); // State for loading indicator
  const router = useRouter();
  const messagesEndRef = useRef(null);

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

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (message.trim()) {
      setIsGenerating(true); // Show loading indicator

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

        let aiContent = response.data.response
        .replace(/\n/g, "<br />")
        .replace(/### (.*?)(<br \/>|$)/g, "<h3>$1</h3>")
        .replace(/## (.*?)(<br \/>|$)/g, "<h2>$1</h2>")
        .replace(/# (.*?)(<br \/>|$)/g, "<h1>$1</h1>")
        .replace(/\*\*(.*?)\*\*/g, "<b>$1</b>")
        .replace(/\*(.*?)\*/g, "<i>$1$i>")
        .replace(/__(.*?)__/g, "<u>$1</u>");

        const aiMessage = {
          sender: 'ai',
          user: 'AI',
          content: aiContent,
          timestamp: new Date().toISOString(),
        };

        // Add the AI message to the messages array
        setMessages((prevMessages) => [...prevMessages, aiMessage]);
      } catch (error) {
        console.error("Error sending message:", error);
      } finally {
        setIsGenerating(false); // Hide loading indicator after receiving response or error
      }
    }
  };

  const handleSummary = async () => {
    try {
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) {
        throw sessionError;
      }

      const response = await axios.get('http://127.0.0.1:8000/summary', {
        headers: {
          'Authorization': `Bearer ${sessionData.session.access_token}`,
        },
      });

      console.log("Summary response:", response.data);
      router.push('/summary');
    } catch (error) {
      console.error("Error fetching summary:", error);
    }
  };


  return (
    <div className="chat-container">
      <Header />
      <div className="chat-wrapper flex flex-col h-screen">
        <div className="chat-history overflow-y-auto px-4 py-8 flex-grow">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`chat-message flex items-start mb-4 rounded-lg shadow-md ${
                msg.sender === 'user' ? 'bg-blue-500 text-white right-timeline' : 'bg-gray-100 text-black left-timeline'
              }`}
              style={{ maxWidth: '50%', alignSelf: msg.sender === 'user' ? 'right-timeline' : 'left-timeline' }}
            >
              <div className="chat-bubble p-4 rounded-lg flex-grow">
                <div className="text-sm text-gray-500">{msg.user}</div>
                {msg.sender === 'ai' ? (
                  <div className="text-lg flex items-center">
                    {isGenerating && (
                      <div className="spinner-border mr-2" role="status"></div>
                    )}
                    <div dangerouslySetInnerHTML={{ __html: msg.content }} />
                  </div>
                ) : (
                  <div className="text-lg">{msg.content}</div>
                )}
                <div className="text-xs text-gray-500">{new Date(msg.timestamp).toLocaleTimeString()}</div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <div className="chat-input flex items-center py-4 px-4 bg-gray-100">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex-grow rounded py-2 px-4 border border-gray-300 focus:border-blue-500"
            placeholder="Type your message..."
          />
          <button
            onClick={handleSendMessage}
            className="ml-4 group flex items-center justify-center rounded py-2 px-4 text-center font-bold bg-blue-500 text-white hover:bg-blue-600"
            disabled={isGenerating} // Disable button while generating
          >
            <span className="mr-2">Send</span>
            <svg
              className="h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"   

                strokeLinejoin="round"
                strokeWidth={2}
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </button>
          <button   

            onClick={handleSummary}
            className="ml-4 group flex items-center justify-center rounded py-2 px-4 text-center font-bold bg-green-500 text-white hover:bg-green-600"
          >
            <span className="text-center">Summarize Chat</span>
            <svg
              className="h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"   

                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </div>   

    </div>
  );
}

export default Chat;