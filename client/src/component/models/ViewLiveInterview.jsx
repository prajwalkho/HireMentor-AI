import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { axiosInstance, endPoints } from "../../api/axios";

const ViewLiveInterview = ({ isOpen, onClose, data }) => {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const navigate = useNavigate();
  if (!isOpen) return null;

  const getTodayDate = () => {
    const localDate = new Date();
    const year = localDate.getFullYear();
    const month = String(localDate.getMonth() + 1).padStart(2, "0");
    const day = String(localDate.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const getCurrentTime = () => {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  const today = getTodayDate();
  const currentTime = getCurrentTime();

  const handleSave = async () => {
  
    const data1 = {
      interviewDate: date,
      interviewTime: time,
      candidateEmail: data.email,
      role: data.role,
      candidateId:data.id
    };
    try {
      const response = await axiosInstance.post(
        endPoints.interview.schedule,
        data1,
        {
          withCredentials: true,
        }
      );
      if (response.status === 201) {
        toast.success("Interview scheduled successfully.");
        navigate("/user/interview-progress");
      }
      onClose();
    } catch (error) {
      toast.error("Error scheduling interview.", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
      <div className="bg-white w-full max-w-md overflow-auto p-6 shadow-lg relative rounded-lg">
        <div className="flex flex-col h-full">
          <h2 className="text-2xl font-semibold mb-4">Live Interview</h2>

          <div className="flex space-x-4">
            {" "}
            {/* Use space-x-4 to add space between fields */}
            {/* Date Field */}
            <div className="flex flex-col w-1/2">
              {" "}
              {/* Set width to 1/2 for both inputs */}
              <label htmlFor="date" className="text-gray-700 font-medium mb-2">
                Date:
              </label>
              <input
                type="date"
                id="date"
                className="border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                min={today}
              />
            </div>
            {/* Time Field */}
            <div className="flex flex-col w-1/2">
              {" "}
              {/* Set width to 1/2 for both inputs */}
              <label htmlFor="time" className="text-gray-700 font-medium mb-2">
                Time:
              </label>
              <input
                type="time"
                id="time"
                className="border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                min={date === today ? currentTime : undefined}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 focus:outline-none w-full"
            >
              Cancel
            </button>
            {/* <Link to='/user/interview-progress' className="w-full"> */}
            <button
              onClick={handleSave}
              className="px-4 py-2 text-[#005151] bg-[#e5f2ea] border-[#005151] border rounded focus:outline-none w-full"
            >
              Save
            </button>
            {/* </Link> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewLiveInterview;
