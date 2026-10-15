import React, { useState } from "react";
import toast from "react-hot-toast";
import { axiosInstance, endPoints } from "../../api/axios";

const AiCareerCoach = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [showHeader, setShowHeader] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (input.trim()) {
      const userMessage = { text: input, sender: "right" };
      const updatedMessages = [...messages, userMessage];

      setMessages(updatedMessages);
      setInput("");
      setShowHeader(false);
      setIsLoading(true);

      try {
        const response = await axiosInstance.post(
          endPoints.ai.chat,
          { prompt: input }
        );

        const aiResponseText =
          response.data?.data ||
          "Sorry, I couldn't process that. Try again.";

        const aiMessage = { text: formatText(aiResponseText), sender: "left" };
        setMessages((prevMessages) => [...prevMessages, aiMessage]);
        toast.success("AI response generated Successfully!");
      } catch (error) {
        const diagnosticMessage =
          error.response?.data?.message ||
          error.response?.data?.error ||
          (error.response
            ? `AI request failed (${error.response.status}).`
            : "Could not reach the AI API. Check VITE_BASE_URL and the backend CORS configuration.");
        toast.error(diagnosticMessage);

        const errorMessage = {
          text: diagnosticMessage,
          sender: "left",
        };
        setMessages((prevMessages) => [...prevMessages, errorMessage]);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  const formatText = (text) => {
    const codeRegex = /```([\s\S]*?)```/g;
    const boldRegex = /\*\*(.*?)\*\*/g;

    return text.split(codeRegex).map((part, index) => {
      if (index % 2 === 1) {
        return (
          <pre
            key={index}
            className="bg-gray-200 p-4 rounded-md overflow-x-auto"
          >
            {part}
          </pre>
        );
      }
      const formattedText = part
        .split(boldRegex)
        .map((subPart, subIndex) =>
          subIndex % 2 === 1 ? (
            <strong key={subIndex}>{subPart}</strong>
          ) : (
            subPart
          )
        );

      return formattedText;
    });
  };

  return (
    <div className="flex flex-col items-center">
      {/* Header */}
      {showHeader && (
        <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold text-center text-gray-400 mt-10 mb-6 px-4">
          Ask me any questions about{" "}
          <span className="text-[#005151] font-bold">Interviews</span>,
          <br className="hidden sm:block" /> and{" "}
          <span className="text-[#005151] font-bold">Career </span>development
        </h1>
      )}

      {/* Chat Container */}
      <div className="w-full sm:w-11/12 max-w-5xl flex-1 overflow-y-auto mb-24 mt-4 px-2 sm:px-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex mb-4 items-start ${
              message.sender === "right" ? "justify-end" : "justify-start"
            }`}
          >
            {message.sender === "left" && (
              <img
                src="/assets/magicpen.svg"
                alt="AI Avatar"
                className="w-8 h-8 sm:w-6 sm:h-6 rounded-full mr-3"
              />
            )}

            <div
              className={`p-3 rounded-lg max-w-xs sm:max-w-sm ${
                message.sender === "right"
                  ? "bg-[#005151] text-white"
                  : "bg-[#f4f4f4] text-gray-800"
              }`}
              style={{
                display: "inline-block",
                maxWidth: "75%",
                minWidth: "50px",
              }}
            >
              <pre className="text-wrap">{message.text}</pre>
            </div>
          </div>
        ))}

        {/* Loader */}
        {isLoading && (
          <div className="flex mb-4 items-center justify-start">
            <img
              src="/assets/magicpen.svg"
              alt="AI Avatar"
              className="w-8 h-8 sm:w-6 sm:h-6 rounded-full mr-3"
            />
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-[#005151] rounded-full animate-updown"></div>
              <div className="w-2 h-2 bg-[#005151] rounded-full animate-updown delay-200"></div>
              <div className="w-2 h-2 bg-[#005151] rounded-full animate-updown delay-400"></div>
            </div>
          </div>
        )}
      </div>

      {/* Input Section */}
      <div className="w-full fixed bottom-0 bg-white mt-8 pb-4 mx-auto px-2 sm:px-4">
        <div className="border rounded-full px-3 py-2 flex items-center shadow-md sm:w-11/12 max-w-3xl mx-auto">
          <input
            type="text"
            placeholder="Send a message to AI Career Coach"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full outline-none text-gray-600 px-4 text-sm sm:text-base"
          />
          <button
            onClick={handleSend}
            className="rounded-full flex items-center justify-center"
          >
            <img
              src="/assets/arrow-up.svg"
              className="w-8 h-8 sm:w-10 sm:h-10"
              alt="Send"
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AiCareerCoach;
