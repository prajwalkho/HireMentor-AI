import React, { useEffect, useState } from "react";
import eye from "../../../public/assets/eye.svg";

const ViewScheduleInterview = ({ isOpen, onClose, data }) => {
  const [fileSize, setFileSize] = useState(null);

  useEffect(() => {
    if (data?.file) {
      fetchFileSize(data.file);
    }
  }, [data?.file]);

  const fetchFileSize = async (url) => {
    try {
      const response = await fetch(url, { method: "HEAD" });
      const size = response.headers.get("Content-Length");

      if (size) {
        const sizeInKB = size / 1024;
        const formattedSize =
          sizeInKB >= 1024 * 1024
            ? `${(sizeInKB / (1024 * 1024)).toFixed(2)} GB`
            : sizeInKB >= 1024
            ? `${(sizeInKB / 1024).toFixed(2)} MB`
            : `${sizeInKB.toFixed(2)} KB`;

        setFileSize(formattedSize);
      } else {
        setFileSize("Unknown size");
      }
    } catch (error) {
      console.error("Error fetching file size:", error);
      setFileSize("Unknown size");
    }
  };
  const handleViewImage = () => {
    console.log("File URL:", data?.file);
    window.open(data.documentURL, "_blank"); 
    console.log("File URL:", data?.file);
  };
  
  const getFileName = (filePath) => {
    return filePath ? filePath.split('/').pop() : "No file uploaded";
  };
  
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] max-sm:px-[15px]">
      <div className="bg-white w-full max-w-md overflow-auto p-6 shadow-lg relative rounded-lg">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 focus:outline-none"
        >
          <span className="text-2xl font-bold">&times;</span>
        </button>

        <div className="flex flex-col h-full">
          <h2 className="text-2xl font-semibold mb-4">Interview Details</h2>
          <div className="space-y-2 flex-1">
          <div>
              <strong>Profile Image:</strong>
              <div className="flex items-center space-x-4 mt-2">
                {data.profile ? (
                  <img
                    src={data.profile}
                    alt="Profile"
                    className="w-16 h-16 rounded-full object-cover"
                  />
                ) : (
                  <p>No profile image available</p>
                )}
              </div>
            </div>
            <p>
              <strong>Name:</strong> {data?.first_Name} {data?.last_Name}
            </p>
            <p>
              <strong>Email:</strong> {data?.email}
            </p>
            <p>
              <strong>Gender:</strong> {data?.gender}
            </p>
            <p>
              <strong>Role:</strong> {data?.role}
            </p>
            <p>
              <strong>Phone Number:</strong> {data?.phoneNumber}
            </p>
            <p>
              <strong>Date of Birth:</strong>
              {new Date(data?.birth_Date).toLocaleString("en-GB", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })}
            </p>
            <div className="mt-4">
              <strong>Document:</strong>
              <div className="flex justify-between items-center border px-2 py-1 rounded-xl my-1">
                <div className="flex items-center space-x-4 mt-2">
                  <img
                    src="/assets/gallery.svg"
                    alt="Uploaded Document"
                    className="w-6 h-6"
                  />
                  <div className="flex flex-col overflow-hidden w-[300px]">
                    <p className="text-sm text-gray-700">
                    {getFileName(data?.file)}
                    </p>
                    <p className="text-xs text-gray-500">
                      {fileSize || "Unknown size"}
                    </p>
                  </div>
                </div>
                <div>
                  <button onClick={handleViewImage}>
                    <img src={eye} alt="View" width={22} />
                  </button>
                </div>
              </div>
            </div>

            <div>
              <strong>Skills:</strong>
              <ul className="mt-2 flex flex-wrap gap-3 list-none">
                {data?.skill?.map((skill, index) => (
                  <li key={index} className="mb-1 bg-[#e5f2ea] hover:bg-[#d9ece1] px-5 py-1 rounded-full border border-[#68b384]">
                    {skill.trim()}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewScheduleInterview;


