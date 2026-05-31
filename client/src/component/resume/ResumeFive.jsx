import React, { useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import email from "../../../public/assets/email.svg";
import call from "../../../public/assets/call.svg";
import locationicon from "../../../public/assets/location.svg";
import gender from "../../../public/assets/gender.svg";
import link from "../../../public/assets/link.svg";

const ResumeFive = () => {
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
        className="max-w-4xl mx-auto bg-gradient-to-r from-gray-100 to-blue-50 shadow-lg border"
        ref={resumeRef}
      >
        {/* Header Section */}
        <header className="relative h-40 bg-gradient-to-r from-gray-500 to-blue-400 text-white p-8 rounded-t-lg max-sm:p-4">
          <div className="relative z-10">
            <h1 className="text-4xl font-bold tracking-wide max-sm:text-3xl">
              {formData.name || "user"}
            </h1>
            <h2 className="text-xl mt-2">{formData.role || "Your Role"}</h2>
          </div>
        </header>

        <div className="grid md:grid-cols-[2fr_3fr] gap-6 p-8 text-gray-900">
          {/* Left Column */}
          <div className="space-y-8">
            {/* Contact Section */}
            <section>
              <h3 className="text-lg font-semibold border-b border-gray-300 pb-2 mb-4">
                CONTACT
              </h3>
              <div className="space-y-2">
                <p className="flex items-center gap-2 hover:bg-gray-200 p-2  pb-0 rounded transition">
                  <img src={call} width={18} className="me-1 invert" />{" "}
                  {formData.phone || "+91 37248 34556"}
                </p>
                <p className="flex items-center gap-2 hover:bg-gray-200 p-2  pb-0 rounded transition">
                  <img src={email} width={18} className="me-1 invert" />{" "}
                  {formData.email}
                </p>
                <p className="flex items-center gap-2 hover:bg-gray-200 p-2 pb-0 rounded transition">
                  <img src={locationicon} width={18} className="me-1 invert" />{" "}
                  {formData.location}
                </p>
                <p className="flex items-center gap-2 hover:bg-gray-200 p-2 pb-0 rounded transition">
                  <img src={gender} width={18} className="me-1 invert" />{" "}
                  {formData.gender}{" "}
                </p>
                <Link
                  to={formData.website}
                  target="_blank"
                  className="flex items-center gap-2 hover:bg-gray-200 p-2 pb-0 rounded transition"
                >
                  <img src={link} width={18} className="me-1 invert" />{" "}
                  {formData.website}
                </Link>
              </div>
            </section>

            {formData.certificates.length > 0 && (
              <section>
                <h3 className="text-lg font-semibold border-b border-gray-300 pb-2 mb-4">
                  CERTIFICATES
                </h3>
                <div className="space-y-4">
                  {formData?.certificates?.map((certificate, index) => (
                    <div key={index}>
                      <h4 className="font-medium capitalize">
                        {certificate?.name}
                      </h4>
                      <p className=" text-gray-600">
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
                      <p className="text-gray-600">{certificate?.location}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Projects Section */}
            {formData.projects.length > 0 && (
              <section>
                <h3 className="text-lg font-semibold border-b border-gray-300 pb-2 mb-4">
                  PROJECTS
                </h3>
                <div className="space-y-4">
                  {formData?.projects?.map((projects, index) => (
                    <div key={index}>
                      <h4 className="font-medium capitalize">
                        {projects?.projectName}
                      </h4>
                      <p className="text-gray-600"> {projects?.location}</p>
                      <p className=" text-gray-600">{projects?.description}</p>
                      <p className=" text-gray-600 pb-3">
                        {new Date(projects?.date).toLocaleString("en-GB", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric"
                        })}{" "}
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
              </section>
            )}

            {formData.workExperience.length > 0 && (
              <section>
                <h3 className="text-lg font-semibold border-b border-gray-300 pb-2 mb-4">
                  EXPERIENCE
                </h3>
                <div className="space-y-4">
                  {formData?.workExperience?.map((experience, index) => (
                    <div key={index}>
                      <h4 className="font-medium capitalize">
                        {experience?.jobTitle} {` - (${experience?.company})`}
                      </h4>
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
              </section>
            )}

            {formData.education.length > 0 && (
              <section>
                <h3 className="text-lg font-semibold border-b border-gray-300 pb-2 mb-4">
                  EDUCATION
                </h3>
                <div className="space-y-4">
                  {formData?.education?.map((education, index) => (
                    <div key={index}>
                      <h4 className="font-medium">{education?.degree}</h4>
                      <p className=" text-gray-600">
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
                      <p className=" text-gray-600">
                        {education?.school}
                        {` - (${education?.location})`}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Objective Section */}
            <section>
              <h3 className="text-lg font-semibold border-b border-gray-300 pb-2 mb-4">
                OBJECTIVE
              </h3>
              <p className="">{formData.objective}</p>
            </section>

            {/* Languages Section */}
            {formData.languages.length > 0 && (
              <section>
                <h3 className="text-lg font-semibold border-b border-gray-300 pb-2 mb-4">
                  LANGUAGES
                </h3>
                <div className="space-y-4">
                  {formData?.languages?.map((skill, index) => (
                    <div key={index}>
                      <p className=" text-gray-600">{skill.name}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Interests Section */}
            {formData.interests.length > 0 && (
              <section>
                <h3 className="text-lg font-semibold border-b-2 border-gray-300 pb-2 mb-4">
                  INTERESTS
                </h3>
                <ul className="list-disc list-inside space-y-1 ">
                  {formData?.interests?.map((skill, index) => (
                    <li key={index} className="text-gray-600">
                      {skill.name}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {formData.skills.length > 0 && (
              <section>
                <h3 className="text-lg font-semibold border-b-2 border-gray-300 pb-2 mb-4">
                  SKILLS
                </h3>
                <ul className="list-disc list-inside space-y-1">
                  {formData?.skills?.map((skill, index) => (
                    <li className="text-gray-600">{skill.name}</li>
                  ))}
                </ul>
              </section>
            )}

            {/* Featured Skills Section */}
            {formData.featuredSkills.length > 0 && (
              <section>
                <h3 className="text-lg font-semibold border-b-2 border-gray-300 pb-2 mb-4">
                  FEATURED SKILLS
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <ul className="list-disc list-inside space-y-1">
                    {formData?.featuredSkills?.map((skill, index) => (
                      <li key={index} className="text-gray-600">
                        {skill.name}
                      </li>
                    ))}
                  </ul>
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ResumeFive;
