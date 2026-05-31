import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import React, { useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const ResumeSeven = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const formData = location.state?.formData;

  const resumeRef = useRef();

  const handleDownloadPDF = async () => {
    try {
      const element = resumeRef.current;

      if (!element) {
        console.error("Resume element not found.");
        return;
      }

      await new Promise((resolve) => setTimeout(resolve, 100));
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: false
      });
      const imageData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imgProps = pdf.getImageProperties(imageData);
      const imgHeight = (imgProps.height * pageWidth) / imgProps.width;

      pdf.addImage(imageData, "PNG", 0, 0, pageWidth, imgHeight);

      pdf.save("Resume.pdf");
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  return (
    <>
      <div className="flex justify-end max-sm:justify-center max-md:justify-center max-lg:justify-center resume-flex">
        <button
          className="bg-[#005151] text-white py-2 px-6 rounded-lg mb-5 mr-2 button-select"
          onClick={() =>
            navigate("/user/select-resume", { state: { formData } })
          }
        >
          Select Another Resume
        </button>
        <button
          className="bg-[#005151] text-white py-2 px-6 rounded-lg mb-5 ml-2 flex justify-center items-center max-sm:ml-0"
          onClick={handleDownloadPDF}
        >
          Download
          <img src="/assets/download.svg" className="ml-2" width={23} />
        </button>
      </div>

      <div
        className="flex w-[900px] mx-auto p-6 bg-white shadow-lg rounded-lg border"
        ref={resumeRef}
      >
        {/* Left Column */}
        <div className="w-2/3 p-6 space-y-1 overflow-auto">
          {/* Career Objective */}
          <div className="">
            <h3 className="text-2xl font-semibold text-gray-800 pb-1">
              Career Objective
            </h3>
            <p className="text-gray-600 mt-2">{formData?.objective || "-"} </p>
          </div>

          {/* education section */}
          {formData.education.length > 0 && (
            <div>
              <h3 className="text-2xl font-semibold text-gray-800 inline-block border-b-2 mt-4 pb-1">
                Education
              </h3>
              {formData.education.map((education, index) => (
                <div className="mt-2" key={index}>
                  <h4 className="text-md font-medium text-gray-800">
                    {education.degree}
                  </h4>
                  <p className="text-gray-600">
                    {education.school}
                    {education.location && ` - (${education.location})`}
                  </p>
                  <span>
                    {new Date(education.startDate).toLocaleString("en-GB", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric"
                    })}{" "}
                    -{" "}
                    {new Date(education.endDate).toLocaleString("en-GB", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric"
                    })}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Experience */}
          {formData.workExperience.length > 0 && (
            <div className="mt-2">
              <h3 className="text-2xl font-semibold text-gray-800 inline-block border-b-2 mt-4 pb-1">
                Experience
              </h3>
              {formData?.workExperience?.map((experience, index) => (
                <div className="mt-2" key={index}>
                  <h4 className="text-md font-medium text-gray-800">
                    {experience?.jobTitle} {` - (${experience?.company})`}
                  </h4>
                  <p className="text-gray-600">
                    {experience?.location} |{" "}
                    {new Date(experience?.startDate).toLocaleString("en-GB", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric"
                    })}{" "}
                    -{" "}
                    {new Date(experience?.endDate).toLocaleString("en-GB", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric"
                    })}
                  </p>
                  <p className="mt-2 text-gray-600 list-disc">
                    {experience?.description}
                  </p>
                </div>
              ))}
            </div>
          )}

          {formData.projects.length > 0 && (
            <div className="mb-8">
              <h2 className="text-lg font-bold  mb-3 text-[#2F0909]">
                Projects
              </h2>
              <div className="space-y-4">
                {formData?.projects?.map((projects, index) => (
                  <div key={index}>
                    <h3 className="text-md font-medium text-gray-700 capitalize">
                      ★ {projects?.projectName}
                    </h3>
                    <p className="text-gray-600">
                      {new Date(projects?.date).toLocaleString("en-GB", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric"
                      })}{" "}
                    </p>
                    <p className="text-gray-600 mt-1 pb-3">
                      {projects?.description}
                    </p>
                    <Link
                      href={projects?.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {projects?.url}
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}
          {/* Certificates */}
          {formData.certificates.length > 0 && (
            <div>
              <h3 className="text-2xl font-semibold text-gray-800 inline-block border-b-2 mt-4 pb-1">
                Certificates
              </h3>
              {formData?.certificates?.map((certificate, index) => (
                <div className="mt-2" key={index}>
                  <h4 className="text-md font-medium text-gray-800">
                    {certificate?.name}
                  </h4>
                  <p className="text-gray-600">{certificate?.location}</p>
                  <p className="text-gray-600">
                    {new Date(certificate?.startDate).toLocaleString("en-GB", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric"
                    })}{" "}
                    -{" "}
                    {new Date(certificate?.endDate).toLocaleString("en-GB", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric"
                    })}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Skills */}
          {formData.skills.length > 0 && (
            <div>
              <h3 className="text-2xl font-semibold text-gray-800 inline-block border-b-2 mt-4 pb-1">
                Skills
              </h3>
              <ul className="mt-2 text-gray-600 list-disc pl-5">
                {formData?.skills?.map((skill, index) => (
                  <li key={index}>{skill.name}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Featured Skills*/}
          {formData.featuredSkills.length > 0 && (
            <div>
              <h3 className="text-2xl font-semibold text-gray-800 inline-block border-b-2 mt-4 pb-1">
                Featured Skills
              </h3>
              <ul className="mt-2 text-gray-600 list-disc pl-5">
                {formData?.featuredSkills?.map((skill, index) => (
                  <li key={index}>{skill.name}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Right Column */}
        <div className="w-1/3 p-6 bg-gray-100 rounded-lg">
          <div className="flex flex-col items-center">
            <img
              src={
                formData.profile_photo
                  ? URL.createObjectURL(formData.profile_photo)
                  : "https://via.placeholder.com/150"
              }
              alt="Profile"
              className="w-32 h-32 rounded-full mb-4"
            />
            <h2 className="text-xl font-bold text-gray-800 capitalize">
              {formData.name || "user"}
            </h2>
            <p className="text-sm text-gray-600">
              {formData.role || "Your Role"}
            </p>
          </div>
          <div className="mt-6 space-y-4">
            <h3 className="text-md font-semibold text-gray-800">Contact</h3>
            <ul className="text-gray-600 space-y-2">
              <li>
                <span className="font-medium">Phone:</span>{" "}
                {formData.phone || "+91 00000 00000"}
              </li>
              <li>
                <span className="font-medium">Email:</span>{" "}
                {formData.email || "user@gmail.com"}
              </li>
              <li>
                <span className="font-medium capitalize">Gender: </span>{" "}
                {formData.gender || "user Gender"}
              </li>
              <li>
                <span className="font-medium capitalize">Location: </span>{" "}
                {formData.location || "user location"}
              </li>
              <li>
                <span className="font-medium capitalize">Website: </span>{" "}
                <Link
                  to={formData.website}
                  className="break-all"
                  target="_blank"
                >
                  {formData.website || "User Portfolio"}
                </Link>
              </li>
            </ul>
          </div>
          {formData.languages.length > 0 && (
            <div className="mt-6 space-y-4">
              <h3 className="text-md font-semibold text-gray-800">Languages</h3>
              <ul className="text-gray-600 space-y-2">
                {formData?.languages?.map((skill, index) => (
                  <li key={index}>{skill.name}</li>
                ))}
              </ul>
            </div>
          )}
          {formData.interests.length > 0 && (
            <div className="mt-6 space-y-4">
              <h3 className="text-md font-semibold text-gray-800">Interests</h3>
              <ul className="text-gray-600 space-y-2">
                {formData?.interests?.map((skill, index) => (
                  <li key={index}>{skill.name}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ResumeSeven;
