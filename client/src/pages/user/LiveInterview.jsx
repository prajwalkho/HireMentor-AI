import React, { useState } from "react";
import AddInterview from "../../component/models/AddInterview";
import InterviewList from "./InterviewList";

const LiveInterview = () => {
  const [addInterview, setAddInterview] = useState(false);
  return (
    <>
      <div className="p-4 md:p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          <div
            className="p-6 border-2 border-dashed border-indigo-100 rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50 hover:shadow-lg cursor-pointer transition-all duration-300 transform hover:-translate-y-1 text-center"
            onClick={() => setAddInterview(true)}
          >
            <div className="flex flex-col items-center justify-center h-full">
              <div className="w-12 h-12 flex items-center justify-center bg-indigo-100 rounded-full mb-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-indigo-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
              </div>
              <h2 className="text-lg font-semibold text-indigo-700">Add New Interview</h2>
              <p className="text-indigo-500 mt-1">Create a new interview session for users</p>
            </div>
          </div>
        </div>

        <InterviewList />
      </div>
      {addInterview && (
        <AddInterview
          onClose={() => {
            setAddInterview(false);
          }}
        />
      )}
    </>
  );
};

export default LiveInterview;