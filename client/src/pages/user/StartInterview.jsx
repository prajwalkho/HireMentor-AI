import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import QuestionSection from "./QuestionSection";
import RecordAnswer from "./RecordAnswer";
import toast from "react-hot-toast";
import { axiosInstance, endPoints } from "../../api/axios";
import { FiChevronLeft, FiChevronRight, FiFlag } from "react-icons/fi";

const StartInterview = () => {
  const { id } = useParams();
  const [interviewData, setInterviewData] = useState({});
  const [mockInterviewQuestion, setMockInterviewQuestion] = useState([]);
  const [InterviewAnswerQuestion, setInterviewAnswerQuestion] = useState([]);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const { data } = await axiosInstance.get(
          `${endPoints.interview.mockInterview}/${id}`
        );
        setInterviewData(data?.data);
        
        if (data?.data?.jsonMockResp) {
          const jsonData = JSON.parse(data.data.jsonMockResp);
          setMockInterviewQuestion(jsonData);
        }

        const answerData = await axiosInstance.get(
          `${endPoints.interview.userAnswer}/${id}`
        );
        setInterviewAnswerQuestion(answerData.data?.data);
      } catch (error) {
        toast.error(error.response?.data?.message || "Error loading interview data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleNextQuestion = () => {
    if (activeQuestionIndex < mockInterviewQuestion.length - 1) {
      setActiveQuestionIndex(activeQuestionIndex + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (activeQuestionIndex > 0) {
      setActiveQuestionIndex(activeQuestionIndex - 1);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-600 mb-4"></div>
          <p className="text-gray-600">Preparing your interview session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 bg-gray-50 min-h-screen">
      {/* Header with progress */}
      <div className="mb-8 bg-white p-6 rounded-xl shadow-sm">
        <h2 className="text-2xl font-semibold text-gray-800 mb-1">Interview Session</h2>
        <p className="text-gray-600 mb-4">{interviewData.jobPosition || "Technical Interview"}</p>
        
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-600">
            Question {activeQuestionIndex + 1} of {mockInterviewQuestion.length}
          </span>
          <span className="text-sm font-medium text-teal-600 bg-teal-50 px-2 py-1 rounded">
            {Math.round(((activeQuestionIndex + 1) / mockInterviewQuestion.length) * 100)}% Complete
          </span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-2">
          <div 
            className="bg-teal-600 h-2 rounded-full transition-all duration-300" 
            style={{ width: `${((activeQuestionIndex + 1) / mockInterviewQuestion.length) * 100}%` }}
          ></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Question Section */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center mb-4">
            <div className="bg-teal-100 p-2 rounded-lg mr-3">
              <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-800">Question</h3>
          </div>
          <QuestionSection
            mockInterviewQuestion={mockInterviewQuestion}
            activeQuestionIndex={activeQuestionIndex}
            setActiveQuestionIndex={setActiveQuestionIndex}
            InterviewAnswerQuestion={InterviewAnswerQuestion}
          />
        </div>

        {/* Answer Section */}
        <div className="flex flex-col gap-6">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 flex-1">
            <div className="flex items-center mb-4">
              <div className="bg-blue-100 p-2 rounded-lg mr-3">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-800">Your Response</h3>
            </div>
            <RecordAnswer
              mockInterviewQuestion={mockInterviewQuestion}
              activeQuestionIndex={activeQuestionIndex}
              interviewData={interviewData}
              setActiveQuestionIndex={setActiveQuestionIndex}
              InterviewAnswerQuestion={InterviewAnswerQuestion}
              getInterviewQuestion={() => {
                axiosInstance.get(`${endPoints.interview.userAnswer}/${id}`)
                  .then(({ data }) => setInterviewAnswerQuestion(data?.data))
                  .catch(error => toast.error(error.response?.data?.message));
              }}
            />
          </div>

          {/* Navigation Controls */}
          <div className="flex justify-between bg-white p-4 rounded-xl shadow-sm border border-gray-200">
            <button
              onClick={handlePreviousQuestion}
              disabled={activeQuestionIndex === 0}
              className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
                activeQuestionIndex === 0
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <FiChevronLeft className="mr-2" />
              Previous
            </button>

            {activeQuestionIndex < mockInterviewQuestion.length - 1 ? (
              <button
                onClick={handleNextQuestion}
                className="flex items-center px-4 py-2 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 transition-colors"
              >
                Next Question
                <FiChevronRight className="ml-2" />
              </button>
            ) : (
              <Link
                to={`/user/feedback/${interviewData.mockId}`}
                className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
              >
                Finish Interview
                <FiFlag className="ml-2" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StartInterview;