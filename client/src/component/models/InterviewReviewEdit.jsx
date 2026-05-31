import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Loader from "../Loader";
import toast from "react-hot-toast";
import { axiosInstance, endPoints } from "../../api/axios";

const ViewHrRound = ({ isOpen, onClose, data, onUpdate }) => {
  const [status, setStatus] = useState("");
  const [loader, setLoader] = useState(false);

  if (!isOpen) return null;

  useEffect(() => {
    if (data && data.status) {
      setStatus(data.status);
    }
  }, [data]);

  const handleSave = async () => {
    if (!status) {
      toast.error("Please select a status.");
      return;
    }

    try {
      setLoader(true);
      const response = await axiosInstance.put(
        `${endPoints.interview.commonInterview}/${data._id}/changestatus`,
        { status }
      );
      if (response.status === 200) {
        toast.success("Interview status Updated Successfully.");
        onUpdate();
        onClose();
      } else {
        toast.error("Failed to update interview status.");
      }
      setLoader(false);
    } catch (error) {
      toast.error("Error updating interview:", error);
      setLoader(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
      <div className="bg-white w-full max-w-md overflow-auto p-6 shadow-lg relative rounded-lg">
        <div className="flex flex-col h-full">
          <h2 className="text-2xl font-semibold mb-4">Interview Review</h2>

          {/* Status Selector */}
          <div className="flex flex-col w-full mb-3">
            <label htmlFor="status" className="text-gray-700 font-medium mb-2">
              Interview Status:
            </label>
            <select
              id="status"
              className="border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="">Select Status</option>
              <option value="Completed">Completed</option>
              <option value="Pending">Pending</option>
            </select>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 mt-6">
            <button
              onClick={onClose} // Close the modal without saving
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 focus:outline-none w-full"
            >
              Cancel
            </button>
            <button
              onClick={handleSave} // Save the status change
              className="px-4 py-2 bg-[#4DC3AB] hover:bg-[#43b8a0] text-white rounded focus:outline-none w-full"
            >
              {!loader ? "Save" : <Loader />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewHrRound;
