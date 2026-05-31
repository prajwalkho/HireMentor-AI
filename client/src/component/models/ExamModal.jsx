import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { axiosInstance, endPoints } from "../../api/axios";

const ExamModal = ({
  getExamQuestion,
  getExam,
  onClose,
}) => {
  const navigate = useNavigate();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [questions, setQuestions] = useState(getExamQuestion);
  const [loading, setLoading] = useState(true);

  const handleAnswerSelect = (option, index) => {
    setSelectedAnswers((prev) => {
      const updatedAnswers = [...prev];
      updatedAnswers[currentQuestionIndex] = {
        question: questions[currentQuestionIndex].question,
        userAnswer: option,
        rightAnswer: questions[currentQuestionIndex].rightAnswer === index,
      };

      return updatedAnswers;
    });

  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handleSubmit = async () => {
    try {
      const totalQuestions = selectedAnswers.length;
      const correctAnswers = selectedAnswers.filter(
        (answer) => answer?.rightAnswer === true
      ).length;
      const score = (correctAnswers / totalQuestions) * 100;
     

      await axiosInstance.put(
        endPoints.exam.complete,
        {
          examId: getExam?._id,
          userAnswer: selectedAnswers,
          status: "completed",
          result: score >= 70 ? "Pass" : "Fail",
          Score: score,
        },
        {
          withCredentials: true,
        }
      );
      toast.success("Exam Completed Successfully.");
      onClose();
      navigate(`/user/enroll-exam-score/${getExam?._id}`
    );
    } catch (error) {
      toast.error("Error updating exam status:", error);
    }
  };

  const handleClose = () => {
    if (onClose) {
      onClose();
    }
  };

  // if (loading) {
  //   return (
  //     <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[9999]'>
  //       <p className='text-white'>Loading questions...</p>
  //     </div>
  //   );
  // }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[9999]">
      <div className="bg-white sm:max-w-[60vw]  w-full p-4 rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">Exam Questions</h2>

        {questions.length > 0 ? (
          <>
            {/* Question */}
            <h3 className="text-2xl font-semibold mb-4 select-none">
              {`${currentQuestionIndex + 1}: ${
                questions[currentQuestionIndex].question
              }`}
            </h3>

            {/* Options */}
            <div className="flex flex-col space-y-2 mb-6 select-none">
              {questions[currentQuestionIndex].options.map((option, index) => (
                <label
                  key={index}
                  className={`p-2 rounded ${
                    selectedAnswers[currentQuestionIndex]?.userAnswer === option
                      ? "bg-blue-100"
                      : "bg-white"
                  } cursor-pointer`}
                >
                  <input
                    type="radio"
                    name={`question-${currentQuestionIndex}`}
                    value={index}
                    checked={
                      selectedAnswers[currentQuestionIndex]?.userAnswer ===
                      option
                    }
                    onChange={() => handleAnswerSelect(option, index)}
                    className="mr-2"
                  />
                  {option}
                </label>
              ))}
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between">
              <button
                onClick={handleClose}
                className="bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded"
              >
                Cancel
              </button>
              {currentQuestionIndex < questions.length - 1 ? (
                <button
                  onClick={handleNext}
                  disabled={!selectedAnswers[currentQuestionIndex]?.userAnswer}
                  className="bg-[#e5f2ea] text-[#005151] hover:bg-[#d9ece1] font-semibold border border-[#278a8a] py-2 px-4 rounded-md"
                >
                  Next
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={!selectedAnswers[currentQuestionIndex]?.userAnswer}
                  className="bg-[#e5f2ea] text-[#005151] hover:bg-[#d9ece1] font-semibold border border-[#278a8a] py-2 px-4 rounded"
                >
                  Submit
                </button>
              )}
            </div>
          </>
        ) : (
          <p className="text-center text-gray-500">No questions available.</p>
        )}
      </div>
    </div>
  );
};

export default ExamModal;
