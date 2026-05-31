import React, { useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import email from "../../../public/assets/email.svg";
import call from "../../../public/assets/call.svg";
import locationicon from "../../../public/assets/location.svg";
import gender from "../../../public/assets/gender.svg";
import link from "../../../public/assets/link.svg";

function ResumeEight() {
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
      <div className="min-h-screen md:p-8" ref={resumeRef}>
        <div className="mx-auto w-[900px] bg-white shadow-xl">
          <div className="grid grid-cols-2 max-sm:grid-cols-1 gap-8">
            {/* Left Sidebar */}
            <div className="bg-[#696969e3] p-8 text-white md:w-full">
              {/* Profile Image */}
              <div className="mx-auto mb-8 h-48 w-48 overflow-hidden rounded-full border-4 border-white">
                <img
                  src={
                    formData.profile_photo
                      ? URL.createObjectURL(formData.profile_photo)
                      : "https://via.placeholder.com/150"
                  }
                  alt="Profile"
                  className="h-full w-full object-cover"
                />
              </div>

              {/* Contact Section */}
              <div className="mb-8">
                <h2 className="mb-4 border-b border-white pb-2 text-xl font-bold">
                  CONTACT
                </h2>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="flex">
                      <img src={call} width={18} className="me-1" />{" "}
                      {formData.phone || "+91 37248 34556"}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="flex">
                      <img src={email} width={18} className="me-1" />{" "}
                      {formData.email}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="flex">
                      <img src={locationicon} width={18} className="me-1" />{" "}
                      {formData.location}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="flex">
                      <img src={gender} width={18} className="me-1" />{" "}
                      {formData.gender}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Link
                      to={formData.website}
                      target="_blank"
                      className="flex"
                    >
                      <img src={link} width={18} className="me-1" />
                      {formData.website}
                    </Link>
                  </div>
                </div>
              </div>

              {/* Skills Section */}
              {formData.skills.length > 0 && (
                <div className="mb-8">
                  <h2 className="mb-4 border-b border-white pb-2 text-xl font-bold">
                    SKILLS
                  </h2>
                  <ul className="list-inside space-y-2">
                    {formData?.skills?.map((skill, index) => (
                      <li key={index}>{skill.name}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Language Section */}
              {formData.languages.length > 0 && (
                <div className="mb-8">
                  <h2 className="mb-4 border-b border-white pb-2 text-xl font-bold">
                    LANGUAGE
                  </h2>
                  <ul className="list-inside space-y-2">
                    {formData?.languages?.map((skill, index) => (
                      <li key={index}>{skill.name}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Featured Section */}
              {formData.featuredSkills.length > 0 && (
                <div>
                  <h2 className="mb-4 border-b border-white pb-2 text-xl font-bold">
                    Featured Skills
                  </h2>
                  <ul className="list-inside space-y-2">
                    {formData?.featuredSkills?.map((skill, index) => (
                      <li key={index}>{skill.name}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Main Content */}
            <div className="p-8 md:w-2/3">
              {/* Header */}
              <div className="mb-8 text-center md:text-left">
                <h1 className="mb-2 text-4xl font-bold capitalize">
                  {formData.name || "user"}
                </h1>
                <h2 className="text-xl text-gray-600 capitalize">
                  {formData.role || "Your Role"}
                </h2>
              </div>

              {/* Professional Profile */}
              <div className="mb-8">
                <h2 className="mb-4 border-b-2 border-gray-900 pb-2 text-2xl font-bold">
                  OBJECTIVE
                </h2>
                <p className="text-gray-700">{formData.objective}</p>
              </div>

              {/* Work Experience */}
              {formData.workExperience.length > 0 && (
                <div className="mb-8">
                  <h2 className="mb-4 border-b-2 border-gray-900 pb-2 text-2xl font-bold">
                    WORK EXPERIENCE
                  </h2>
                  <div className="space-y-4">
                    {formData?.workExperience?.map((experience, index) => (
                      <div className="mb-6">
                        <h3 className="text-xl font-semibold capitalize">
                          {experience?.jobTitle} {` - (${experience?.company})`}
                        </h3>
                        <p className=" text-gray-600">
                          {new Date(experience?.startDate).toLocaleString(
                            "en-GB",
                            {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric"
                            }
                          )}{" "}
                          -{" "}
                          {new Date(experience?.endDate).toLocaleString(
                            "en-GB",
                            {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric"
                            }
                          )}
                        </p>
                        <p className="text-gray-700">{experience?.location}</p>
                        <p className="text-gray-700">
                          {experience?.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Education */}
              {formData.education.length > 0 && (
                <div className="mb-8">
                  <h2 className="mb-4 border-b-2 border-gray-900 pb-2 text-2xl font-bold">
                    EDUCATION
                  </h2>
                  <div className="space-y-3">
                    {formData?.education?.map((education, index) => (
                      <div>
                        <h3 className="text-xl font-semibold capitalize">
                          {" "}
                          {education?.degree}
                        </h3>
                        <p className="text-gray-700">
                          {education?.school}
                          {` - (${education?.location})`}
                        </p>
                        <p className="text-gray-700">
                          {new Date(education?.startDate).toLocaleString(
                            "en-GB",
                            {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric"
                            }
                          )}{" "}
                          -{" "}
                          {new Date(education?.endDate).toLocaleString(
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

              {/* Project */}
              {formData.projects.length > 0 && (
                <div className="mb-8">
                  <h2 className="mb-4 border-b-2 border-gray-900 pb-2 text-2xl font-bold">
                    Projects
                  </h2>
                  <div className="space-y-3">
                    {formData?.projects?.map((projects, index) => (
                      <div>
                        <h3 className="text-xl font-semibold capitalize">
                          {projects?.projectName}
                        </h3>
                        <p className="text-gray-700">{projects?.location}</p>
                        <p className="text-gray-700">
                          {new Date(projects?.date).toLocaleString("en-GB", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric"
                          })}{" "}
                        </p>
                        <p className="text-gray-700 pb-3">
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
                <div className="mb-8">
                  <h2 className="mb-4 border-b-2 border-gray-900 pb-2 text-2xl font-bold">
                    Certificates
                  </h2>
                  <div className="space-y-3">
                    {formData?.certificates?.map((certificate, index) => (
                      <div>
                        <h3 className="text-xl font-semibold capitalize">
                          {certificate?.name}
                        </h3>
                        <p className="text-gray-700">{certificate?.location}</p>
                        <p className="text-gray-700">
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

              {/* Hobbies Section */}
              {formData.interests.length > 0 && (
                <div>
                  <h2 className="mb-4 border-b-2 border-gray-900 pb-2 text-2xl font-bold">
                    Hobbies
                  </h2>
                  <ul className="list-inside space-y-2">
                    {formData?.interests?.map((skill, index) => (
                      <li key={index}>{skill.name}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ResumeEight;
