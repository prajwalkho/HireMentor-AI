import React, { useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import email from "../../../public/assets/email.svg";
import call from "../../../public/assets/call.svg";
import locationicon from "../../../public/assets/location.svg";
import gender from "../../../public/assets/gender.svg";
import link from "../../../public/assets/link.svg";

const ResumeNine = () => {
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
        className="w-[900px] shadow-xl mx-auto p-8 bg-white border-2 border-gray-200"
        ref={resumeRef}
      >
        {/* Header Section */}
        <div className="flex flex-col md:flex-row gap-8 mb-12 bg-blue-50 p-6 rounded-lg max-sm:mb-8">
          <div className="w-40 h-40 rounded-full border-4 border-blue-200 overflow-hidden">
            <img
              src={
                formData.profile_photo
                  ? URL.createObjectURL(formData.profile_photo)
                  : "https://via.placeholder.com/150"
              }
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="text-start ms-10">
            <h1 className="text-4xl font-bold text-gray-800 capitalize">
              {formData.name || "user"}
            </h1>
            <h2 className="text-xl text-gray-600 mt-2 capitalize">
              {formData.role || "Your Role"}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="flex items-center gap-1">
                <span>
                  <img src={call} width={18} className="me-1 invert" />
                </span>
                <span className="text-lg">
                  {formData.phone || "+91 37248 34556"}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <span>
                  <img src={email} width={18} className="me-1 invert" />
                </span>
                <span className="text-lg">{formData.email}</span>
              </div>
              <div className="flex items-center gap-1">
                <span>
                  <img src={locationicon} width={18} className="me-1 invert" />
                </span>
                <span className="text-lg">{formData.location}</span>
              </div>
              <div className="flex items-center gap-1">
                <span>
                  <img src={gender} width={18} className="me-1 invert" />
                </span>
                <span className="text-lg"> {formData.gender}</span>
              </div>
              <div className="flex items-end gap-2">
                <span>
                  <img src={link} width={18} className="me-1 invert" />
                </span>
                <Link to={formData.website} target="_blank">
                  {" "}
                  {formData.website}
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-col md:flex-row gap-8 text-start">
          {/* Left Sidebar */}
          <div className="w-full md:w-1/3 bg-gray-50 p-4 rounded-lg">
            {formData.skills.length > 0 && (
              <section className="mb-8">
                <h3 className="text-xl font-bold mb-4">SKILLS</h3>
                <ul className="space-y-2 text-lg">
                  {formData?.skills?.map((skill, index) => (
                    <li key={index}>{skill.name}</li>
                  ))}
                </ul>
              </section>
            )}

            {formData.featuredSkills.length > 0 && (
              <section className="mb-8">
                <h3 className="text-xl font-bold mb-4">FEATURED SKILLS</h3>
                <ul className="space-y-2 text-lg">
                  {formData?.featuredSkills?.map((skill, index) => (
                    <li key={index}>{skill.name}</li>
                  ))}
                </ul>
              </section>
            )}

            {formData.languages.length > 0 && (
              <section className="mb-8">
                <h3 className="text-xl font-bold mb-4">LANGUAGES</h3>
                <ul className="space-y-2 text-lg">
                  {formData?.languages?.map((skill, index) => (
                    <li key={index}>{skill.name}</li>
                  ))}
                </ul>
              </section>
            )}

            {formData.interests.length > 0 && (
              <section>
                <h3 className="text-xl font-bold mb-4">HOBBIES</h3>
                <ul className="space-y-2 text-lg">
                  {formData?.interests?.map((skill, index) => (
                    <li key={index}>{skill.name}</li>
                  ))}
                </ul>
              </section>
            )}
          </div>

          {/* Right Content */}
          <div className="w-full md:w-2/3 border-l-2 border-gray-100 text-start bg-gray-50 p-4 rounded-lg">
            <section className="mb-8">
              <h3 className="text-xl font-bold mb-4">OBJECTIVE</h3>
              <p className="text-gray-600 leading-relaxed text-lg">
                {formData.objective}
              </p>
            </section>

            {formData.workExperience.length > 0 && (
              <section className="mb-8">
                <h3 className="text-xl font-bold mb-4">WORK EXPERIENCE</h3>
                {formData?.workExperience?.map((experience, index) => (
                  <div key={index} className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-semibold text-lg capitalize">
                        {experience?.jobTitle} {` - (${experience?.company})`}
                      </h4>
                      <span className="text-gray-500 text-lg">
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
                      </span>
                    </div>
                    <p className="font-medium text-gray-600 text-lg">
                      {experience?.location}
                    </p>
                    <p className="text-gray-600 mt-2 text-lg">
                      {experience?.description}
                    </p>
                  </div>
                ))}
              </section>
            )}

            {formData.projects.length > 0 && (
              <section className="mb-8">
                <h3 className="text-xl font-bold mb-4">PROJECTS</h3>
                <div className="grid grid-cols-2 gap-8">
                  {formData?.projects?.map((projects, index) => (
                    <div>
                      <h4 className="font-semibold text-lg capitalize">
                        {projects?.projectName}
                      </h4>
                      <p className="text-gray-600 text-lg">
                        {projects?.description}
                      </p>
                      <p className="text-gray-500">{projects?.location}</p>
                      <p className="text-gray-500 pb-3">
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

            {formData.education.length > 0 && (
              <section className="mb-8">
                <h3 className="text-xl font-bold mb-4">EDUCATION</h3>
                {formData?.education?.map((education, index) => (
                  <div key={index} className="mb-6">
                    <h4 className="font-semibold text-lg capitalize">
                      {education?.degree}
                    </h4>
                    <p className="text-gray-600 text-lg">
                      {education?.school}
                      {` - (${education?.location})`}
                    </p>
                    <p className="text-gray-500">
                      {new Date(education?.startDate).toLocaleString("en-GB", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric"
                      })}{" "}
                      -{" "}
                      {new Date(education?.endDate).toLocaleString("en-GB", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric"
                      })}
                    </p>
                  </div>
                ))}
              </section>
            )}

            {formData.certificates.length > 0 && (
              <section className="mb-8">
                <h3 className="text-xl font-bold mb-4">Certificates</h3>
                {formData?.certificates?.map((certificate, index) => (
                  <div key={index} className="mb-6">
                    <h4 className="font-semibold text-lg capitalize">
                      {certificate?.name}
                    </h4>
                    <p className="text-gray-600 text-lg">
                      {certificate?.location}
                      {` - (${certificate?.location})`}
                    </p>
                    <p className="text-gray-500">
                      {new Date(certificate?.startDate).toLocaleString(
                        "en-GB",
                        {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric"
                        }
                      )}{" "}
                      -{" "}
                      {new Date(certificate?.endDate).toLocaleString("en-GB", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric"
                      })}
                    </p>
                  </div>
                ))}
              </section>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ResumeNine;
