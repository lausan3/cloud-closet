'use client';
import React, { useState, useRef, useEffect } from "react";

// The Message interface is updated to handle the new JSON structure
interface Message {
  id: string;
  type: "user" | "ai";
  timestamp: Date;
  text?: string;       // For user's text
  outfit?: string;     // For AI's outfit text
  sources?: string[];  // For AI's images
  reasoning?: string;  // Stored but not yet displayed
}

interface ChatResponse {
  message: string;
  chatResponse: string;
}

export default function Chatbox() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      outfit: "Hello! I'm your AI assistant. How can I help you today?",
      type: "ai",
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (message: string): Promise<ChatResponse> => {
    const apiUrl = "http://" + process.env.NEXT_PUBLIC_API_URL + "/chats/message";
    if (!apiUrl) {
      throw new Error("API URL is not defined in .env");
    }
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data: ChatResponse = await response.json();
    return data;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage.trim(),
      type: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);
    setError(null);

    try {
      const response = await sendMessage(userMessage.text);
      
      const rawResponse = response.chatResponse;
      
      // NEW: A more robust way to find and extract a JSON object from a string
      const startIndex = rawResponse.indexOf('{');
      const endIndex = rawResponse.lastIndexOf('}');

      if (startIndex === -1 || endIndex === -1 || endIndex < startIndex) {
        // If we can't find a valid-looking JSON object, treat it as an error.
        throw new Error("Received an invalid, non-JSON response from the server.");
      }

      const jsonString = rawResponse.substring(startIndex, endIndex + 1);
      
      try {
        const responseData = JSON.parse(jsonString);

        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: "ai",
          timestamp: new Date(),
          outfit: responseData.outfit,
          sources: responseData.sources,
          reasoning: responseData.reasoning,
        };

        setMessages((prev) => [...prev, aiMessage]);
      } catch (parseError) {
        // This catches errors if the extracted string is *still* not valid JSON.
        throw new Error("Failed to parse the JSON content from the AI's response.");
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as any);
    }
  };

  return (
    <div className="h-[39vw]">
      <div className="flex-1 flex flex-col w-[40vw]  mt-[3vw] h-[39vw]">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.type === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-xs sm:max-w-md lg:max-w-lg xl:max-w-xl px-4 py-3 rounded-2xl  ${
                  message.type === "user"
                    ? "bg-[#303030] text-[#A9A9A9]"
                    : "text-white text-gray-800"
                }`}
              >
                <p className="text-sm leading-relaxed whitespace-pre-wrap">
                  {message.type === "user" ? message.text : message.outfit}
                </p>
                
                {message.sources && message.sources.length > 0 && (
                  <div className="mt-3 flex flex-row flex-wrap gap-2">
                    {message.sources.map((src, index) => (
                      <img
                        key={index}
                        src={src}
                        alt={`Outfit source ${index + 1}`}
                        className="w-[4vw] h-[4vw] object-cover rounded-md"
                      />
                    ))}
                  </div>
                )}
                
                <p
                  className={`text-xs mt-2 ${
                    message.type === "user" ? "text-indigo-100" : "text-gray-500"
                  }`}
                >
                  {message.timestamp.toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="text-white px-4 py-3flex items-center gap-2">
                <span className="text-sm">AI is thinking</span>
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"
                    style={{ animationDelay: "0.4s" }}
                  ></div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {error && (
          <div className="mx-6 mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">
              {error}
            </p>
            <button
              onClick={() => setError(null)}
              className="text-xs text-red-500 underline mt-1"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Input */}
        <div className=" px-6 py-4">
          <form onSubmit={handleSubmit} className="flex gap-3 items-end">
            <div className="flex-1">
              <textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message here..."
                className="text-white w-full px-4 py-3 bg-[#303030] rounded-2xl 
                  focus:outline-none focus:ring-2 focus:ring-[#A9A9A9] focus:border-transparent resize-none"
                rows={1}
                style={{ minHeight: "44px", maxHeight: "120px" }}
                disabled={isLoading}
                required
              />
            </div>
            <button
              type="submit"
              disabled={isLoading || !inputMessage.trim()}
              className="bg-[#303030] text-white px-6 py-3 rounded-2xl font-medium hover:bg-[#A9A9A9] hover:text-[#303030] focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md"
            >
              {isLoading ? (
                <div className="w-5 h-5 -2 rounded-full animate-spin text-white"></div>
              ) : (
                "Send"
              )}
            </button>
          </form>
        </div>
      </div>
      <div id="gradient" className="bg-gradient-to-b from-[#212121] to-transparent fixed top-0 h-[29vh] w-[50vw]"></div>
    </div>
  );
}