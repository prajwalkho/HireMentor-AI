import React, { useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import email from "../../../public/assets/email.svg";
import call from "../../../public/assets/call.svg";
import locationicon from "../../../public/assets/location.svg";
import gender from "../../../public/assets/gender.svg";
import link from "../../../public/assets/link.svg";

const ResumeSix = () => {
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
        className="bg-white p-8 w-[900px] mx-auto rounded-lg shadow-xl"
        ref={resumeRef}
      >
        {/* Main Content Section */}
        {/* Header Section */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold  text-[#2F0909] capitalize">
            {formData.name || "user"}
          </h1>
          <p className="text-xl text-gray-500 capitalize">
            {formData.role || "Your Role"}
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[2fr,3fr] gap-8">
          {/* Left Column with Background Color */}
          <div className="bg-[#FFE6E6] py-6 px-4 rounded-lg">
            {/* About Me Section */}
            <div className="mb-8">
              <h2 className="text-lg font-bold  mb-3 text-[#2F0909]">
                Objective
              </h2>
              <p className="text-gray-600 leading-relaxed">
                {formData.objective}
              </p>
            </div>

            {/* Contact Section */}
            <div className="mb-8">
              <h2 className="text-lg font-bold  mb-3 text-[#2F0909]">
                Contact
              </h2>
              <p className="py-1 flex text-gray-600">
                <img src={call} width={18} className="me-1 invert" />{" "}
                {formData.phone || "+91 37248 34556"}
              </p>
              <p className="py-1 flex text-gray-600">
                <img src={email} width={18} className="me-1 invert" />{" "}
                {formData.email}
              </p>
              <p className="py-1 flex text-gray-600">
                <img src={locationicon} width={18} className="me-1 invert" />{" "}
                {formData.location}
              </p>
              <p className="py-1 flex text-gray-600">
                <img src={gender} width={18} className="me-1 invert" />{" "}
                {formData.gender}{" "}
              </p>
              <Link
                to={formData.website}
                target="_blank"
                className="py-1 flex text-gray-600"
              >
                <img src={link} width={18} className="me-1 invert" />{" "}
                {formData.website}
              </Link>
            </div>

            {/* Skills Section */}
            {formData.skills.length > 0 && (
              <div className="mb-8">
                <h2 className="text-lg font-bold  mb-3 text-[#2F0909]">
                  Skills
                </h2>
                {formData?.skills?.map((skill, index) => (
                  <p key={index} className="text-gray-700 py-1">
                    {skill.name}
                  </p>
                ))}
              </div>
            )}

            {/* Languages Section */}
            {formData.languages.length > 0 && (
              <div className="mb-8">
                <h2 className="text-lg font-bold  mb-3 text-[#2F0909]">
                  Languages
                </h2>
                {formData?.languages?.map((skill, index) => (
                  <p key={index} className="text-gray-700 py-1">
                    {skill.name}
                  </p>
                ))}
              </div>
            )}
          </div>

          {/* Right Column */}
          <div className=" py-6 px-4">
            {/* Education Section */}
            {formData.education.length > 0 && (
              <div className="mb-8">
                <h2 className="text-lg font-bold  mb-3 text-[#2F0909]">
                  Education
                </h2>
                <div className="space-y-3">
                  {formData?.education?.map((education, index) => (
                    <div>
                      <h3 className="text-md font-medium text-gray-700 capitalize">
                        ★ {education?.school}
                        {` - (${education?.location})`}
                      </h3>
                      <p className="text-gray-600">{education?.degree}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(education?.startDate).toLocaleString(
                          "en-GB",
                          {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric"
                          }
                        )}{" "}
                        -{" "}
                        {new Date(education?.endDate).toLocaleString("en-GB", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric"
                        })}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Certificates Section */}
            {formData.certificates.length > 0 && (
              <div className="mb-8">
                <h2 className="text-lg font-bold  mb-3 text-[#2F0909]">
                  Certificates
                </h2>
                <div className="space-y-3">
                  {formData?.certificates?.map((certificate, index) => (
                    <div>
                      <h3 className="text-md font-medium text-gray-700 capitalize">
                        ★ {certificate?.name}
                        {` - (${certificate?.location})`}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {new Date(certificate?.startDate).toLocaleString(
                          "en-GB",
                          {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric"
                          }
                        )}{" "}
                        -{" "}
                        {new Date(certificate?.endDate).toLocaleString(
                          "en-GB",
                          {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric"
                          }
                        )}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Featured Section */}
            {formData.featuredSkills.length > 0 && (
              <div className="mb-8">
                <h2 className="text-lg font-bold  mb-3 text-[#2F0909]">
                  Featured Skills
                </h2>
                {formData?.featuredSkills?.map((skill, index) => (
                  <p key={index} className="text-gray-700 py-1">
                    {skill.name}
                  </p>
                ))}
              </div>
            )}

            {/* Experience Section */}
            {formData.workExperience.length > 0 && (
              <div className="mb-8">
                <h2 className="text-lg font-bold  mb-3 text-[#2F0909]">
                  Experience
                </h2>
                <div className="space-y-4">
                  {formData?.workExperience?.map((experience, index) => (
                    <div key={index}>
                      <h3 className="text-md font-medium text-gray-700 capitalize">
                        ★ {experience?.jobTitle} {` - (${experience?.company})`}
                      </h3>
                      <p className="text-gray-600">
                        {new Date(experience?.startDate).toLocaleString(
                          "en-GB",
                          {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric"
                          }
                        )}{" "}
                        -{" "}
                        {new Date(experience?.endDate).toLocaleString("en-GB", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric"
                        })}
                      </p>
                      <p className="text-gray-600">{experience?.location}</p>
                      <p className="text-gray-600">{experience?.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Project Section */}
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

            {/* Hobbies Section */}
            {formData.interests.length > 0 && (
              <div className="mb-8">
                <h2 className="text-lg font-bold  mb-3 text-[#2F0909]">
                  Hobbies
                </h2>
                {formData?.interests?.map((skill, index) => (
                  <p key={index} className="text-gray-700 py-1">
                    {skill.name}
                  </p>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ResumeSix;
