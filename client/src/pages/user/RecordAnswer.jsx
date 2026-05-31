import axios from "axios";
import React, { useEffect, useState } from "react";
import useSpeechToText from "react-hook-speech-to-text";
import toast from "react-hot-toast";
import Webcam from "react-webcam";
import Loader from "../../component/Loader";
import { axiosInstance, endPoints } from "../../api/axios";

const RecordAnswer = ({
  mockInterviewQuestion,
  activeQuestionIndex,
  interviewData,
  setActiveQuestionIndex,
  InterviewAnswerQuestion,
  getInterviewQuestion,
}) => {
  const [userAnswer, setUserAnswer] = useState("");
  const [loader, setLoader] = useState(false);
  const [webCamEnabled, setWebCamEnabled] = useState(false);

  const currentUser = JSON.parse(localStorage.getItem("user"));
  const {
    error,
    interimResult,
    isRecording,
    results,
    setResults,
    startSpeechToText,
    stopSpeechToText,
  } = useSpeechToText({
    continuous: true,
    useLegacyResults: false,
  });

  useEffect(() => {
    if (results.length > 0) {
      const combinedResults = results
        .map((result) => result.transcript)
        .join(" ");
      setUserAnswer(combinedResults);
    }
  }, [results]);

  useEffect(() => {
    if (!isRecording && userAnswer.length > 10) {
      UpdateUserAnswer();
    }
  }, [isRecording]);

  const StartStopRecording = () => {
    if (isRecording) {
      stopSpeechToText();
    } else {
      startSpeechToText();
    }
  };

  const UpdateUserAnswer = async () => {
    setLoader(true);
    const feedbackPrompt = `Question: ${mockInterviewQuestion[activeQuestionIndex]?.question}, User Answer: ${userAnswer}, Based on the question and user answer, please provide a rating for the answer and feedback for improvement in JSON format with 'rating' and 'feedback' fields.`;

    try {
      const response = await axiosInstance.post(
        endPoints.ai.chat,
        { prompt: feedbackPrompt }
      );

      const aiResponseText = response.data?.data || "";

      // Clean markdown code blocks if any
      const cleanJsonStr = aiResponseText
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

      const JsonFeedbackResp = JSON.parse(cleanJsonStr);

      try {
        const userAnswerData = {
          mockIdRef: interviewData.mockId,
          question: mockInterviewQuestion[activeQuestionIndex]?.question,
          correctAns: mockInterviewQuestion[activeQuestionIndex]?.answer,
          userAns: userAnswer,
          feedback: JsonFeedbackResp.feedback,
          rating: JsonFeedbackResp.rating,
          userEmail: currentUser.email,
        };
        const saveResponse = await axiosInstance.post(
          endPoints.interview.userAnswer,
          userAnswerData,
          // {
          //   headers: {
          //     "Content-Type": "application/json",
          //   },
          // }
        );

        // const [0,2,3]

        if (saveResponse.data?.success) {
          toast.success("Your answer has been saved successfully!");
          setUserAnswer("");
          setResults([]);
          setActiveQuestionIndex((prev) => (prev === 9 ? 9 : prev + 1));
          getInterviewQuestion();
        } else {
          toast.error("Failed to save your answer. Please try again.");
          setResults([]);
        }
        setLoader(false);
      } catch (error) {
        toast.error("Error saving your answer.");
        setResults([]);
      }
    } catch (error) {
      toast.error("Error fetching feedback.");
      setResults([]);
      setLoader(false);
    }
  };
  return (
    <div className="flex justify-center items-center flex-col">
      {webCamEnabled ? (
        <div className="relative">
          <Webcam style={{ width: "100%", height: 350 }} mirrored={true} />
          <button
            onClick={() => setWebCamEnabled(false)}
            className="absolute top-2 right-2 bg-white/80 px-3 py-1 rounded-md hover:bg-white"
          >
            Hide Camera
          </button>
        </div>
      ) : (
        <>
          <img src="/assets/webcam.png" className="w-60" alt="" />
          <button
            className={`px-4 py-2 rounded-lg bg-[#e5f2ea] hover:bg-[#d9ece1] text-[#005151] border border-[#2a8f8f]`}
            onClick={() => setWebCamEnabled(true)}
          >
            Enabled Web Cam and Microphone
          </button>
        </>
      )}

      <button
        className="bg-[#005151] border text-[white] font-semibold py-2 px-4 rounded-md mt-5 flex items-center gap-3 disabled:opacity-50"
        onClick={StartStopRecording}
        disabled={InterviewAnswerQuestion.some(
          (item) =>
            item.question ===
            mockInterviewQuestion[activeQuestionIndex]?.question
        )}
      >
        {loader ? <Loader /> : <img src="/assets/microphone-2.svg" alt="" />}
        {InterviewAnswerQuestion.some(
          (item) =>
            item.question ===
            mockInterviewQuestion[activeQuestionIndex]?.question
        )
          ? "Already Answered"
          : isRecording
          ? "Stop Recording..."
          : "Recording Answer"}
      </button>

      <ul>
        {results.map((result) => (
          <li key={result.timestamp}>{result.transcript}</li>
        ))}
        {interimResult && <li>{interimResult}</li>}
      </ul>
    </div>
  );
};

export default RecordAnswer;
