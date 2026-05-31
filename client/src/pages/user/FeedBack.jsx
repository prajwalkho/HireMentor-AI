import axios from 'axios';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Link, useParams } from 'react-router-dom';
import PageLoader from '../../component/PageLoader';
import Rating from 'react-rating';
import { axiosInstance, endPoints } from '../../api/axios';
import { FiChevronDown, FiChevronUp, FiHome } from 'react-icons/fi';

const FeedBack = () => {
  const { id } = useParams();
  const [feedbackList, setFeedbackList] = useState([]);
  const [activeIndex, setActiveIndex] = useState(null);
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    const getInterview = async () => {
      try {
        setLoader(true);
        const { data } = await axiosInstance.get(
          `${endPoints.interview.userAnswer}/${id}`
        );
        setFeedbackList(data?.data);
        setLoader(false);
      } catch (error) {
        toast.error(error.response?.data?.message);
        setLoader(false);
      }
    };

    getInterview();
  }, [id]);

  const toggleAccordion = index => {
    setActiveIndex(prevIndex => (prevIndex === index ? null : index));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-teal-600 to-emerald-600 text-white rounded-xl p-6 mb-8 shadow-lg">
        <div className="flex justify-between items-center flex-wrap gap-4">
          <div>
            <h2 className="text-3xl font-bold mb-2">Congratulations 🎉</h2>
            <p className="text-emerald-100">Here is your interview feedback</p>
          </div>
          <Link
            to="/user/live-interview"
            className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            <FiHome className="text-lg" />
            Go Home
          </Link>
        </div>
      </div>

      {/* Description */}
      <div className="bg-white rounded-lg shadow-sm p-5 mb-8 border border-gray-100">
        <p className="text-gray-700">
          Below are your interview questions with the correct answers, your responses, 
          and personalized feedback for improvement.
        </p>
      </div>

      {/* Feedback List */}
      <div className="space-y-2">
        {loader ? (
          <div className="flex justify-center items-center py-12">
            <PageLoader />
          </div>
        ) : (
          feedbackList &&
          feedbackList.map((feedback, index) => (
            <div 
              key={index} 
              className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200 transition-all duration-200"
            >
              <button
                onClick={() => toggleAccordion(index)}
                className="w-full flex justify-between items-center p-5 text-left hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-teal-100 text-teal-800 font-medium mr-3 mt-0.5 flex-shrink-0">
                    {index + 1}
                  </span>
                  <span className="text-lg font-medium text-gray-800">
                    {feedback.question}
                  </span>
                </div>
                <span className="text-gray-500 ml-2">
                  {activeIndex === index ? (
                    <FiChevronUp className="w-5 h-5" />
                  ) : (
                    <FiChevronDown className="w-5 h-5" />
                  )}
                </span>
              </button>
              
              <div
                className={`transition-all duration-300 ease-in-out ${
                  activeIndex === index ? 'max-h-screen' : 'max-h-0'
                }`}
              >
                <div className="px-5 pb-5 pt-2 border-t border-gray-100">
                  {/* Rating */}
                  <div className="flex items-center mb-4">
                    <span className="font-medium text-gray-700 mr-3">Rating:</span>
                    <div className="flex items-center">
                      <Rating
                        initialRating={feedback.rating / 2}
                        readonly
                        emptySymbol={
                          <svg
                            className="w-6 h-6 text-gray-300"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M12 17.27L18.18 21 16.54 13.97 22 9.24 14.81 8.63 12 2 9.19 8.63 2 9.24 7.46 13.97 5.82 21 12 17.27z"></path>
                          </svg>
                        }
                        fullSymbol={
                          <svg
                            className="w-6 h-6 text-yellow-400"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M12 17.27L18.18 21 16.54 13.97 22 9.24 14.81 8.63 12 2 9.19 8.63 2 9.24 7.46 13.97 5.82 21 12 17.27z"></path>
                          </svg>
                        }
                        fractions={2}
                      />
                    </div>
                  </div>

                  {/* Your Answer */}
                  <div className="mb-4">
                    <h4 className="font-medium text-gray-700 mb-1">Your Answer:</h4>
                    <p className="text-gray-600 bg-gray-50 p-3 rounded-lg">
                      {feedback.userAns}
                    </p>
                  </div>

                  {/* Correct Answer */}
                  <div className="mb-4">
                    <h4 className="font-medium text-gray-700 mb-1">Correct Answer:</h4>
                    <p className="text-gray-600 bg-gray-50 p-3 rounded-lg">
                      {feedback.correctAns}
                    </p>
                  </div>

                  {/* Feedback */}
                  <div>
                    <h4 className="font-medium text-gray-700 mb-1">Feedback:</h4>
                    <p className="text-gray-600 bg-blue-50 p-3 rounded-lg">
                      {feedback.feedback}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default FeedBack;