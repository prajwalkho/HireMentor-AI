import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { axiosInstance, endPoints } from "../../api/axios";

const InterviewStatusEdit = ({ isOpen, onClose, data , onUpdate  }) => {
    const [selected, setSelected] = useState("");  

    if (!isOpen) return null;

    const handleSave = async() => {
        if (selected === "") {
            toast.error("Please select a selection status (Selected/Not Selected).");
            return;
        }
        try {
            const response = await axiosInstance.put(
                `${endPoints.interview.commonInterview}/${data._id}/changestatus`,
                { selected }, 
            );
            if (response.status === 200) {
                toast.success("Interview status Updated Successfully.");
                onUpdate(); 
                onClose(); 
            }
        } catch (error) {
            toast.error("Error updating selection status:", error);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
            <div className="bg-white w-full max-w-md overflow-auto p-6 shadow-lg relative rounded-lg">
                <div className="flex flex-col h-full">
                    <h2 className="text-2xl font-semibold mb-4">Interview Status</h2>

                    <div className="flex flex-col w-full mb-3">
                        <label htmlFor="role" className="text-gray-700 font-medium mb-2">
                            Interview Status:
                        </label>
                        <select
                            id="selected"
                            className="border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
                            value={selected}
                            onChange={(e) => setSelected(e.target.value)}
                        >
                            <option value="">Select Role</option>
                            <option value="Selected">Selected</option>
                            <option value="Not_Selected">Not Selected</option>
                        </select>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end space-x-3 mt-6">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 focus:outline-none w-full"
                        >
                            Cancel
                        </button>
                        <Link to='' className="w-full">
                            <button
                                onClick={handleSave}
                                className="px-4 py-2 rounded focus:outline-none w-full text-[#005151] bg-[#e5f2ea] border-[#005151] border"
                            >
                                Save
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InterviewStatusEdit;
