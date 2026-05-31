import React from "react";

const ViewCourseInformation = ({ isOpen, onClose, data }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
      <div className="bg-white w-full max-w-md overflow-auto p-6 shadow-lg relative rounded-lg h-[85%] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 focus:outline-none"
        >
          <span className="text-2xl font-bold">&times;</span>
        </button>

        <div className="flex flex-col h-full">
          <h2 className="text-2xl font-semibold mb-4">View Course Information</h2>
          <div className="space-y-4 flex-1">
            <p>
              {data?.courseImage ? (
                <img
                  src={data.courseImage}
                  alt="Course Image "
                  className="w-20 h-20 rounded-full object-cover"
                />
              ) : (
                "No Image"
              )}
            </p>
            <p><strong>Role:</strong> {data?.roleId?.roleName || "N/A"}</p>
            <p><strong>Course Type:</strong> {data?.courseId?.courseType || "N/A"}</p>
            <p><strong>Title:</strong> {data?.title || "N/A"}</p>
            <p><strong>Overview:</strong> {data?.overview || "N/A"}</p>
            <p><strong>Description:</strong> {data?.description || "N/A"}</p>
            
            {data?.videoLinks?.length > 0 && (
              <div>
                <strong>Video Links:</strong>
                <ul className="list-disc ml-5 mt-1 space-y-1">
                  {data.videoLinks.map((link, i) => (
                    <li key={i}>
                      <a href={link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline break-all">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {data?.studyMaterials?.length > 0 && (
              <div>
                <strong>Study Materials:</strong>
                <ul className="list-disc ml-5 mt-1 space-y-1">
                  {data.studyMaterials.map((mat, i) => (
                    <li key={i}>
                      <a href={mat.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        {mat.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewCourseInformation;
