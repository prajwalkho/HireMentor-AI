import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const SelectResume = () => {
  const location = useLocation();

  const formData = location.state?.formData;

  const navigate = useNavigate();

  const allResume = [
    {
      img: "/assets/resume-one.png",
      name: "Resume 1",
      link: "/user/resume-one",
    },
    {
      img: "/assets/resume-two.png",
      name: "Resume 2",
      link: "/user/resume-two",
    },
    {
      img: "/assets/resume-three.png",
      name: "Resume 3",
      link: "/user/resume-three",
    },
    {
      img: "/assets/resume-four.png",
      name: "Resume 4",
      link: "/user/resume-four",
    },
    {
      img: "/assets/resume-five.png",
      name: "Resume 5",
      link: "/user/resume-five",
    },
    {
      img: "/assets/resume-six.png",
      name: "Resume 6",
      link: "/user/resume-six",
    },
    {
      img: "/assets/resume-seven.png",
      name: "Resume 7",
      link: "/user/resume-seven",
    },
    {
      img: "/assets/resume-eight.png",
      name: "Resume 8",
      link: "/user/resume-eight",
    },
    {
      img: "/assets/resume-nine.png",
      name: "Resume 9",
      link: "/user/resume-nine",
    },
  ];
  const handelSelectResume = (resume) => {
    // navigate(resume);
    navigate(resume.link, { state: { formData } });
  };

  return (
    <div className="">
      <h2 className="text-2xl font-semibold mb-4">Select a Resume</h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {allResume.length > 0 ? (
          allResume.map((resume, index) => (
            <div
              key={index}
              className="border border-gray-300 p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 relative group"
            >
              <img
                src={resume.img || "https://via.placeholder.com/150"}
                alt={resume.name || "Resume Thumbnail"}
                className="w-full object-cover mb-4 rounded-md"
              />
              {/* Absolute div that shows on hover */}
              <div className="absolute w-full h-full top-0 left-0 bg-[#0000003d] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center text-white">
                <button
                  type="submit"
                  className="text-white bg-[#005151] font-semibold py-2 px-6 rounded-xl transition-opacity"
                  onClick={() => handelSelectResume(resume)}
                >
                  Select Resume
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>No resumes available.</p>
        )}
      </div>
    </div>
  );
};

export default SelectResume;
