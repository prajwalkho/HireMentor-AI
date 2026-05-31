import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import PageLoader from "../../component/PageLoader";
import { axiosInstance, endPoints } from "../../api/axios";

const InterviewList = () => {
  const [loader, setLoader] = useState(false);
  const currentUser = JSON.parse(localStorage.getItem("user"));
  const [interviewList, setInterviewList] = useState([]);

  useEffect(() => {
    const getInterview = async () => {
      try {
        setLoader(true);
        const { data } = await axiosInstance.get(
          `${endPoints.interview.createdBy}/${currentUser._id}`
        );
        setLoader(false);
        setInterviewList(data?.data);
      } catch (error) {
        setLoader(false);
        toast.error(error.response?.data?.message);
      }
    };

    getInterview();
  }, []);

  return (
    <div className="p-4 md:p-6">
      <h2 className="text-2xl font-bold text-indigo-700 relative mb-8 pb-2">
        Previous Mock Interviews
        <span className="absolute bottom-0 left-0 w-20 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"></span>
      </h2>

      {loader ? (
        <div className="flex justify-center items-center h-64">
          <PageLoader />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {interviewList && interviewList.length > 0 ? (
            interviewList.map((interview, index) => (
              <div 
                className="border border-gray-200 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 bg-white"
                key={index}
              >
                <div className="p-5">
                  <div className="flex items-center mb-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-indigo-600"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z"
                          clipRule="evenodd"
                        />
                        <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" />
                      </svg>
                    </div>
                    <div>
                      <h2 className="font-bold text-lg text-gray-800">
                        {interview?.jobPosition}
                      </h2>
                      <span className="inline-block px-2 py-1 text-xs font-semibold bg-amber-100 text-amber-800 rounded-full mt-1">
                        {interview?.jobExperience} Years Experience
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {interview?.jobDesc}
                  </p>

                  <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                    <Link
                      to={`/user/feedback/${interview?.mockId}`}
                      className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium rounded-lg hover:opacity-90 transition-opacity shadow-sm"
                    >
                      View Feedback
                    </Link>
                    <span className="text-xs text-gray-400">
                      {new Date(interview?.createdAt).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <div className="mx-auto w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-10 w-10 text-indigo-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-600 mb-1">
                No interviews found
              </h3>
              <p className="text-gray-400 text-sm">
                Create your first mock interview to get started
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default InterviewList;