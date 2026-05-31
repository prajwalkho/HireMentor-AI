import React, { useState } from "react";
import Loader from "../Loader";
import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router-dom";
import { axiosInstance, endPoints } from "../../api/axios";

const AddInterview = ({ isOpen, onClose }) => {
  const [loader, setLoader] = useState(false);
  const [jobPosition, setJobPosition] = useState("");
  const [jobDesc, setJobDesc] = useState("");
  const [jobExperience, setJobExperience] = useState("");
  const [jsonResponse, setJsonResponse] = useState([]);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoader(true);
      const currentUser = JSON.parse(localStorage.getItem("user"));

      // 1️⃣ Call backend to generate interview content (NOT Gemini directly)
      const response = await axiosInstance.post(
        "/api/generate-interview",
        {
          jobPosition,
          jobDesc,
          jobExperience,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      const mockJsonResp = response.data.data;

      setJsonResponse(mockJsonResp);

      // 2️⃣ Save interview to your backend database
      const backendResponse = await axiosInstance.post(
        endPoints.interview.mockInterview,
        {
          jsonMockResp: JSON.stringify(mockJsonResp),
          jobPosition,
          jobDesc,
          jobExperience,
          createdBy: currentUser._id,
          mockId: uuidv4(),
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      // 3️⃣ Close modal and go to interview page
      onClose();
      navigate(`/user/start-interview/${backendResponse?.data?.data.mockId}`);

      setLoader(false);
    } catch (error) {
      console.error("❌ Error generating content:", error.response?.data || error.message);
      setLoader(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[9999] overflow-y-auto">
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg w-full max-w-[90%] max-h-[90%] sm:w-[450px] lg:w-[500px] overflow-y-auto">
        <h2 className="text-2xl font-semibold mb-4">Tell us more about your job interview</h2>
        <p className="mb-4">
          Add details about your job position/role, job description and years of experience.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="mt-2">
            <label className="text-gray-700 font-semibold">Job Role/Job Position</label>
            <input
              type="text"
              value={jobPosition}
              onChange={(e) => setJobPosition(e.target.value)}
              placeholder="Ex. Frontend Developer"
              className="input border border-gray-300 w-full rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#4DC3AB]"
              required
            />
          </div>

          <div className="mt-3">
            <label className="text-gray-700 font-semibold">Job Description / Tech Stack</label>
            <textarea
              value={jobDesc}
              onChange={(e) => setJobDesc(e.target.value)}
              placeholder="Ex. React, Angular, NodeJs, MySql etc."
              className="input border border-gray-300 w-full rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#4DC3AB]"
              required
            />
          </div>

          <div className="mt-3">
            <label className="text-gray-700 font-semibold">Years of Experience</label>
            <input
              type="number"
              value={jobExperience}
              onChange={(e) => setJobExperience(e.target.value)}
              placeholder="Ex. 05"
              className="input border border-gray-300 w-full rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#4DC3AB]"
              required
            />
          </div>

          <div className="mt-5 flex gap-4">
            <button
              onClick={onClose}
              className="border border-[#005151] text-[#005151] bg-[#e5f2ea] hover:bg-[#d9ece1] font-semibold py-2 px-4 rounded-md"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="border border-[#005151] text-[#005151] bg-[#e5f2ea] hover:bg-[#d9ece1] font-semibold py-2 px-4 rounded-md"
            >
              {loader ? <Loader /> : "Start Interview"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddInterview;
