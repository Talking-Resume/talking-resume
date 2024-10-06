import Header from "@/components/Header";
import { useState, useEffect, useRef } from "react";
import { useRouter } from 'next/navigation';
import { supabase } from "@/supabase/client";
import axios from 'axios';

function Chat() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [user, setUser] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false); 
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
      setIsGenerating(true);

      const newMessage = {
        sender: 'user',
        user: user.phone,
        content: message,
        timestamp: new Date().toISOString(),
      };

      setMessages([...messages, newMessage]);

      const typingMessage = {
        sender: 'ai',
        user: 'AI',
        content: 'AI is typing...',
        timestamp: new Date().toISOString(),
      };
      setMessages((prevMessages) => [...prevMessages, typingMessage]);

      setMessage("");

      try {
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) {
          throw sessionError;
        }

        const response = await axios.post(`${process.env.API_BASE_URL}/chat`, {
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

        setMessages((prevMessages) => [
          ...prevMessages.slice(0, -1), 
          aiMessage
        ]);
      } catch (error) {
        console.error("Error sending message:", error);
        setMessages((prevMessages) => prevMessages.slice(0, -1));
      } finally {
        setIsGenerating(false);
      }
    }
  };

  const handleSummary = async () => {
    try {
      router.push('/summary');
    } catch (error) {
      console.error("Error navigating to summary page:", error);
    }
  };

  return (
    <div className="chat-container min-h-screen flex flex-col ">
      <Header />
      
      {/* Summarize Button */}
      <div className="flex justify-center items-center my-4">
        <button
          onClick={handleSummary}
          className="ml-4 m-2 group flex items-center justify-center rounded py-2 px-4 text-center font-bold bg-green-500 text-white hover:bg-green-600"
        >
          <span className="text-center">Summarize Chat</span>
          <svg
            className="h-6 w-6 ml-2"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4h16M4 8h16M4 12h16M4 16h16M4 20h16" />
          </svg>
        </button>
      </div>

      {/* Chat Box */}
      <div className="flex flex-col flex-grow items-center justify-center min-h-screen">
        <div className="chat-box bg-white rounded-lg shadow-lg w-full max-w-4xl p-4 border border-gray-200">
          <div className="chat-wrapper flex flex-col h-full">
            <div className="chat-history overflow-y-auto px-4 py-8 flex-grow">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`chat-message flex items-end mb-4 ${
                    msg.sender === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div className={`chat-bubble p-4 rounded-lg ${
                    msg.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'
                  }`}>
                    <div className="text-sm text-gray-500">{msg.user}</div>
                    {msg.sender === 'ai' ? (
                      <div className="text-lg" dangerouslySetInnerHTML={{ __html: msg.content }} />
                    ) : (
                      <div className="text-lg">{msg.content}</div>
                    )}
                    <div className="text-xs text-gray-500">{new Date(msg.timestamp).toLocaleTimeString()}</div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Field */}
            <div className="chat-input flex items-center py-4 px-4 bg-gray-100 rounded-b-lg">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="flex-grow rounded py-2 px-4 border border-gray-300 focus:border-blue-500 outline-none"
                placeholder="Message TR..."
              />
                <button
                onClick={handleSendMessage}
                className="ml-4 group flex items-center justify-center rounded py-2 px-4 text-center font-bold bg-blue-500 text-white hover:bg-blue-600"
                disabled={isGenerating} // Disable button while generating
              >
             
                <svg
                  className="h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"   d="M5 12h14M12 5l7 7-7 7"
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

export default Chat;
