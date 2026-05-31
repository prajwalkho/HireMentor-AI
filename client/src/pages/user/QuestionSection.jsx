import React from "react";
import toast from "react-hot-toast";

const QuestionSection = ({
  mockInterviewQuestion,
  activeQuestionIndex,
  setActiveQuestionIndex,
  InterviewAnswerQuestion,
}) => {
  const handelSpeak = (text) => {
    if ("speechSynthesis" in window) {
      const speech = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(speech);
    } else {
      toast.error("Sorry, your browser does not support text to speech");
    }
  };

  return (
    mockInterviewQuestion && (
      <div className="p-5 border rounded-lg">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {mockInterviewQuestion &&
            mockInterviewQuestion.map((question, index) => {
              const isAnswered = InterviewAnswerQuestion.some(
                (item) => item.question === question.question
              );

              return (
                <div
                  key={index}
                  onClick={() => setActiveQuestionIndex(index)}
                  className="cursor-pointer"
                >
                  <p
                    className={`text-sm font-semibold p-2 ${
                      activeQuestionIndex === index
                        ? "bg-[#005151] text-white"
                        : isAnswered
                        ? "bg-[#e5f2ea]"
                        : "bg-gray-200"
                    } rounded-full text-center text-nowrap`}
                  >
                    Question: {index + 1}
                  </p>
                </div>
              );
            })}
        </div>
        <h2 className="font-semibold mt-5">
          {activeQuestionIndex + 1}.{" "}
          {mockInterviewQuestion[activeQuestionIndex]?.question}
        </h2>
        <img
          src="/assets/volume-high.svg"
          className="p-2 bg-gray-100 rounded-lg cursor-pointer mt-3"
          onClick={() =>
            handelSpeak(mockInterviewQuestion[activeQuestionIndex]?.question)
          }
          alt="volume"
        />
        <div className="p-4 border rounded-lg border-blue-300 bg-blue-100 mt-10">
          <div className="flex font-bold text-blue-500">
            <img src="/assets/magicpen.svg" alt="" />
            Note
          </div>
          <p>
            Click on Record answer when you want to answer the question. At the
            end of interview we will give you the feedback along with correct
            answer for each of questions and your answer to compare it.
          </p>
        </div>
      </div>
    )
  );
};

export default QuestionSection;
