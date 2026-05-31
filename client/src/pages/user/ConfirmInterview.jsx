import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link, useParams } from "react-router-dom";
import Webcam from "react-webcam";
import { axiosInstance, endPoints } from "../../api/axios";
import { FiCamera, FiCameraOff, FiInfo, FiArrowRight } from "react-icons/fi";

const ConfirmInterview = () => {
  const { id } = useParams();
  const [interviewData, setInterviewData] = useState({});
  const [webCamEnabled, setWebCamEnabled] = useState(false);

  useEffect(() => {
    const getInterview = async () => {
      try {
        const { data } = await axiosInstance.get(
          `${endPoints.interview.mockInterview}/${id}`
        );
        setInterviewData(data?.data);
      } catch (error) {
        toast.error("Failed to load interview details");
        console.error("Error fetching interview:", error);
      }
    };

    getInterview();
  }, [id]);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-teal-700 relative inline-block">
          Let's Get Started With Your Interview
          <span className="absolute bottom-[-8px] left-0 w-full h-1 bg-gradient-to-r from-teal-500 to-emerald-400 rounded-full"></span>
        </h2>
        <p className="text-gray-600 mt-2">Verify your details before starting</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Interview Details Card */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <span className="w-2 h-6 bg-teal-500 rounded-full mr-2"></span>
              Interview Details
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="bg-teal-100 p-2 rounded-lg mr-4">
                  <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Position</h4>
                  <p className="text-lg font-semibold text-gray-800">{interviewData.jobPosition || "Not specified"}</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-blue-100 p-2 rounded-lg mr-4">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Tech Stack</h4>
                  <p className="text-lg font-semibold text-gray-800">{interviewData.jobDesc || "Not specified"}</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-purple-100 p-2 rounded-lg mr-4">
                  <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Experience</h4>
                  <p className="text-lg font-semibold text-gray-800">
                    {interviewData.jobExperience || "Not specified"} years
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Information Notice */}
          <div className="bg-yellow-50 border-l-4 border-yellow-400 rounded-lg p-5 shadow-sm">
            <div className="flex items-start">
              <div className="bg-yellow-100 p-2 rounded-lg mr-4">
                <FiInfo className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <h3 className="font-bold text-yellow-800 mb-2">Important Information</h3>
                <p className="text-gray-700">
                  Please enable your webcam and microphone to begin the AI-generated mock interview. 
                  The interview consists of 5 questions. After completion, you'll receive a detailed 
                  performance report. 
                  <span className="font-semibold block mt-2 text-yellow-800">
                    Note: We never record your video. You can disable camera access anytime.
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Webcam Section */}
        <div className="flex flex-col items-center justify-start space-y-6">
          {webCamEnabled ? (
            <div className="relative w-full max-w-lg">
              <Webcam
                audio={true}
                videoConstraints={{ facingMode: "user" }}
                onUserMedia={() => setWebCamEnabled(true)}
                onUserMediaError={() => {
                  setWebCamEnabled(false);
                  toast.error("Could not access camera/microphone");
                }}
                className="rounded-xl shadow-lg w-full h-auto aspect-video"
                mirrored={true}
              />
              <button
                onClick={() => setWebCamEnabled(false)}
                className="absolute top-4 right-4 bg-white/90 px-3 py-2 rounded-lg shadow-md hover:bg-white flex items-center text-sm font-medium"
              >
                <FiCameraOff className="mr-2" />
                Disable Camera
              </button>
            </div>
          ) : (
            <div className="bg-gray-50 rounded-xl p-8 w-full max-w-lg flex flex-col items-center justify-center aspect-video border-2 border-dashed border-gray-300">
              <div className="bg-teal-100 p-5 rounded-full mb-4">
                <FiCamera className="w-10 h-10 text-teal-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">Enable Camera</h3>
              <p className="text-gray-500 text-center mb-6">
                Camera access is required for the best interview experience
              </p>
              <button
                onClick={() => setWebCamEnabled(true)}
                className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-medium flex items-center transition-colors shadow-md"
              >
                <FiCamera className="mr-2" />
                Enable Webcam & Microphone
              </button>
            </div>
          )}

          <Link
            to={`/user/start-interview/${id}/start`}
            className={`px-8 py-3 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white rounded-lg font-medium flex items-center transition-all shadow-lg ${
              !webCamEnabled ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={(e) => {
              if (!webCamEnabled) {
                e.preventDefault();
                toast.error("Please enable your webcam first");
              }
            }}
          >
            Start Interview Now
            <FiArrowRight className="ml-2" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ConfirmInterview;