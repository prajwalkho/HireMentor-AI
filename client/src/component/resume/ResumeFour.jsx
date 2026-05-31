import React, { useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import email from "../../../public/assets/email.svg";
import call from "../../../public/assets/call.svg";
import locationicon from "../../../public/assets/location.svg";
import gender from "../../../public/assets/gender.svg";
import link from "../../../public/assets/link.svg";

const ResumeFour = () => {
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
        className="p-6 w-[900px] mx-auto  bg-white shadow-xl rounded-lg"
        ref={resumeRef}
      >
        {/* Header */}
        <div className="flex justify-between mb-8 max-sm:flex-col">
          <div>
            <h1 className="text-4xl font-semibold text-gray-800 mb-3 capitalize">
              {formData.name || "user"}
            </h1>
            <p className="text-gray-600 text-xl capitalize">
              {formData.role || "Your Role"}
            </p>
          </div>
          <div>
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
        </div>
        <hr />

        {/* About Me Section */}
        <div className="my-4 border-b-2">
          <h2 className="text-xl font-bold text-gray-800 mb-2">OBJECTIVE</h2>
          <p className="text-gray-600 mb-3 leading-6 ">{formData.objective}</p>
        </div>

        {/* Project Summary Section */}
        {formData.projects.length > 0 && (
          <div className="mb-4 border-b-2 ">
            <h2 className="text-xl font-bold text-gray-800 mb-2">PROJECT</h2>
            {formData?.projects?.map((projects, index) => (
              <div key={index}>
                <p className="text-gray-600 leading-6 capitalize">
                  * {projects?.projectName}
                </p>
                <p className="text-gray-600 leading-6">{projects?.location}</p>
                <p className="text-gray-600 leading-6 ">
                  {new Date(projects?.date).toLocaleString("en-GB", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric"
                  })}{" "}
                </p>
                <p className="text-gray-600 pb-3 leading-6">
                  {projects?.description}
                </p>
                <div className="mb-3">
                  <Link
                    href={projects?.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {projects?.url}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Work Experience Section */}
        {formData.workExperience.length > 0 && (
          <div className="mb-4 border-b-2">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              WORK EXPERIENCE
            </h2>
            <ul>
              {formData?.workExperience?.map((experience, index) => (
                <li key={index} className="pb-4">
                  <h3 className="text-gray-600 capitalize">
                    * {experience?.jobTitle} {` - (${experience?.company})`}
                  </h3>
                  <p className="text-gray-600">{experience?.location}</p>
                  <p className="text-gray-600 ">
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
                  <p className="text-gray-600"> {experience?.description}</p>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Education and Skills Sections */}
        <div className="grid grid-cols-2">
          <div>
            {formData.education.length > 0 && (
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">
                  EDUCATION
                </h2>
                <ul>
                  {formData?.education?.map((education, index) => (
                    <li key={index} className="pb-2">
                      <h3 className=" text-gray-600 capitalize">
                        * {education?.school}
                      </h3>
                      <p className="text-gray-600 ">{education?.degree}</p>
                      <p className="text-gray-600">{education?.location}</p>
                      <p className="text-gray-600">
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
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {formData.certificates.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-800 mb-4">
                  CERTIFICATE
                </h2>
                <ul>
                  {formData?.certificates?.map((certificate, index) => (
                    <li key={index} className="pb-2">
                      <h3 className=" text-gray-600 capitalize">
                        * {certificate?.name}
                      </h3>
                      <p className="text-gray-600 mb-[6px]">
                        {certificate?.location}
                      </p>
                      <p className="text-gray-600 mb-[6px]">
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
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Languages Section */}
            {formData.languages.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-4">
                  LANGUAGES
                </h2>
                <ul className="list-disc pl-6">
                  {formData?.languages?.map((skill, index) => (
                    <li key={index} className="text-gray-600 mb-[6px]">
                      {skill.name}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div>
            {/* Skills Section */}
            {formData.skills.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-800 mb-4">SKILLS</h2>
                <ul className="grid grid-cols-3 gap-4 p-3">
                  {formData?.skills?.map((skill, index) => (
                    <li
                      key={index}
                      className="text-gray-600 border bg-gray-100 p-3 py-2 font-bold capitalize text-center rounded-full"
                    >
                      {skill.name}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Featured Section */}
            {formData.featuredSkills.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-800 mb-4">
                  FEATURED SKILLS
                </h2>
                <ul className="list-disc pl-6">
                  {formData?.featuredSkills?.map((skill, index) => (
                    <li key={index} className="text-gray-600 mb-[6px] ">
                      {skill.name}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Hobbies Section */}
            {formData.featuredSkills.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-800 mb-4">
                  HOBBIES
                </h2>
                <ul className="list-disc pl-6">
                  {formData?.interests?.map((skill, index) => (
                    <li key={index}>{skill.name}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ResumeFour;
