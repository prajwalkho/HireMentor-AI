import React, { useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import email from "../../../public/assets/email.svg";
import call from "../../../public/assets/call.svg";
import locationicon from "../../../public/assets/location.svg";
import gender from "../../../public/assets/gender.svg";
import link from "../../../public/assets/link.svg";

const ResumeThree = () => {
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
        className="bg-white p-8 w-[900px] mx-auto  rounded-lg shadow-xl"
        ref={resumeRef}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[2fr,3fr] gap-8">
          <div className="bg-gray-100 py-6 px-4 rounded-lg">
            <div className="mb-8 flex justify-center">
              <img
                src={
                  formData.profile_photo
                    ? URL.createObjectURL(formData.profile_photo)
                    : "https://via.placeholder.com/150"
                }
                alt="Profile"
                className="w-40 h-40 rounded-full object-cover border border-gray-300"
              />
            </div>

            <div className="mb-8">
              <h2 className="text-lg font-bold text-gray-800 mb-3">Contact</h2>
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

            {formData.skills.length > 0 && (
              <div className="mb-8">
                <h2 className="text-lg font-bold text-gray-800 mb-3">Skills</h2>
                <ul className="mt-2 text-gray-600 list-disc pl-5">
                  {formData?.skills?.map((skill, index) => (
                    <li key={index}>{skill.name}</li>
                  ))}
                </ul>
              </div>
            )}

            {formData.languages.length > 0 && (
              <div className="mb-8">
                <h2 className="text-lg font-bold text-gray-800 mb-3">
                  Languages
                </h2>
                <ul className="mt-2 text-gray-600 list-disc pl-5">
                  {formData?.languages?.map((skill, index) => (
                    <li key={index}>{skill.name}</li>
                  ))}
                </ul>
              </div>
            )}

            {formData.featuredSkills.length > 0 && (
              <div className="mb-8">
                <h2 className="text-lg font-bold text-gray-800 mb-3">
                  Featured Skills
                </h2>
                <ul className="mt-2 text-gray-600 list-disc pl-5">
                  {formData?.featuredSkills?.map((skill, index) => (
                    <li key={index}>{skill.name}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className=" py-6">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-800 capitalize">
                {formData.name || "user"}
              </h1>
              <p className="text-lg text-gray-500 capitalize">
                {formData.role || "Your Role"}
              </p>
            </div>

            <div className="mb-8">
              <h2 className="text-lg font-bold text-gray-800">Objective</h2>
              <p className="text-gray-600 leading-relaxed">
                {formData.objective}
              </p>
            </div>

            {formData.education.length > 0 && (
              <div className="mb-8">
                <h2 className="text-lg font-bold text-gray-800 mb-3">
                  Education
                </h2>
                <div className="space-y-3">
                  {formData?.education?.map((education, index) => (
                    <div>
                      <h3 className="text-md font-medium text-gray-700 capitalize">
                        - {education?.degree}
                      </h3>
                      <p className="text-gray-600">
                        {education?.school}
                        {` - (${education?.location})`}
                      </p>
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

            {formData.certificates.length > 0 && (
              <div className="mb-8">
                <h2 className="text-lg font-bold text-gray-800 mb-3">
                  Certificates
                </h2>
                <div className="space-y-3">
                  {formData?.certificates?.map((certificate, index) => (
                    <div className="mt-2" key={index}>
                      <h4 className="text-md font-medium text-gray-800 capitalize">
                        - {certificate?.name}
                      </h4>
                      <p className="text-gray-600">{certificate?.location}</p>
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

            {formData.workExperience.length > 0 && (
              <div className="mb-8">
                <h2 className="text-lg font-bold text-gray-800 mb-3">
                  Experience
                </h2>
                <div className="space-y-4">
                  {formData?.workExperience?.map((experience, index) => (
                    <div className="mt-2" key={index}>
                      <h4 className="text-md font-medium text-gray-800 capitalize">
                        - {experience?.jobTitle} {` - (${experience?.company})`}
                      </h4>
                      <p className="text-gray-600">{experience?.location}</p>
                      <p className="text-sm text-gray-500">
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
                      <p className="text-gray-600 list-disc">
                        {experience?.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {formData.projects.length > 0 && (
              <div className="mb-8">
                <h2 className="text-lg font-bold text-gray-800 mb-3">
                  Projects
                </h2>
                <div className="space-y-4">
                  {formData?.projects?.map((projects, index) => (
                    <div className="mt-2" key={index}>
                      <h4 className="text-md font-medium text-gray-800 capitalize">
                        - {projects?.projectName}
                      </h4>
                      <p className="text-gray-600">{projects?.location}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(projects?.date).toLocaleString("en-GB", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric"
                        })}{" "}
                      </p>
                      <p className="text-gray-600 list-disc pb-3">
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

            {formData.interests.length > 0 && (
              <div className="mb-8">
                <h2 className="text-lg font-bold text-gray-800 mb-3">
                  Hobbies
                </h2>
                <ul className="mt-2 text-gray-600 list-disc pl-5">
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

export default ResumeThree;
