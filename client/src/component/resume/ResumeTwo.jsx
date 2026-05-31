import React, { useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import email from "../../../public/assets/email.svg";
import call from "../../../public/assets/call.svg";
import locationicon from "../../../public/assets/location.svg";
import gender from "../../../public/assets/gender.svg";
import link from "../../../public/assets/link.svg";

const ResumeTwo = () => {
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
        className="w-[900px] mx-auto shadow-xl border flex flex-col md:flex-row bg-white"
        ref={resumeRef}
      >
        {/* Left Sidebar */}
        <div className="w-full md:w-1/2 bg-[#8C6C44] text-white p-6">
          {/* Profile Image */}
          <div className="flex justify-center mb-6">
            <img
              src={
                formData.profile_photo
                  ? URL.createObjectURL(formData.profile_photo)
                  : "https://via.placeholder.com/150"
              }
              alt="Profile"
              className="rounded-full w-32 h-32 object-cover border-4 border-white"
            />
          </div>
          <h1 className="text-3xl font-semibold text-center capitalize">
            {formData.name || "user"}
          </h1>
          <p className="text-center text-xl capitalize">
            {formData.role || "Your Role"}
          </p>

          {/* Contact */}
          <div className="mt-6">
            <h3 className="text-xl font-bold mt-6 mb-3">CONTACT</h3>
            <p className="py-1 flex">
              <img src={call} width={18} className="me-1" />{" "}
              {formData.phone || "+91 37248 34556"}
            </p>
            <p className="py-1 flex ">
              <img src={email} width={18} className="me-1" /> {formData.email}
            </p>
            <p className="py-1 flex ">
              <img src={locationicon} width={18} className="me-1" />{" "}
              {formData.location}
            </p>
            <p className="py-1 flex">
              <img src={gender} width={18} className="me-1" /> {formData.gender}{" "}
            </p>
            <Link to={formData.website} target="_blank" className="py-1 flex">
              <img src={link} width={18} className="me-1" /> {formData.website}
            </Link>
          </div>

          <section className="mt-6">
            <h3 className="text-2xl font-bold mb-3">OBJECTIVE</h3>
            <p className=" leading-relaxed">{formData.objective}</p>
          </section>

          {/* Technical Skills */}
          {formData.skills.length > 0 && (
            <div className="mt-6">
              <h3 className="text-xl font-bold mt-6 mb-3">TECHNICAL SKILLS</h3>
              <ul className="mt-2  list-disc pl-5">
                {formData?.skills?.map((skill, index) => (
                  <li key={index}>{skill.name}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Languages */}
          {formData.languages.length > 0 && (
            <div>
              <h3 className="text-xl font-bold mt-6 mb-3">Languages</h3>
              <ul className="mt-2">
                {formData?.languages?.map((skill, index) => (
                  <li key={index}>{skill.name}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Right Content */}
        <div className="w-full md:w-2/3 p-6">
          {/* Work Experience */}
          {formData.workExperience.length > 0 && (
            <div>
              <h3 className="text-xl font-bold mt-6 mb-3">Work Experience</h3>
              {formData.workExperience.map((work, index) => (
                <div key={index} className="mb-4">
                  <h4 className="font-semibold capitalize mb-2">
                    {work?.jobTitle} {` - (${work?.company})`}
                  </h4>
                  <p className="text-sm text-gray-500">
                    {new Date(work?.startDate).toLocaleString("en-GB", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric"
                    })}{" "}
                    -{" "}
                    {new Date(work?.endDate).toLocaleString("en-GB", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric"
                    })}
                  </p>
                  <p className="text-gray-600">{work?.location}</p>
                  <p className="text-gray-600">{work?.description}</p>
                </div>
              ))}
            </div>
          )}
          <hr />

          {/* Projects */}
          {formData.projects.length > 0 && (
            <div>
              <h3 className="text-xl font-bold mt-6 mb-3">Projects</h3>
              {formData?.projects?.map((projects, index) => (
                <div key={index} className="mb-4">
                  <h4 className="font-semibold capitalize">
                    {projects?.projectName}
                  </h4>
                  <p className="text-gray-600">{projects?.description}</p>
                  <p className="text-sm text-gray-500 pb-3">
                    Date:{" "}
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
          )}
          <hr />

          {/* Education */}
          {formData.education.length > 0 && (
            <div>
              <h3 className="text-xl font-bold mt-6 mb-3">Education</h3>
              {formData.education.map((edu, index) => (
                <div key={index} className="mb-4">
                  <h4 className="font-semibold capitalize">
                    {edu?.degree}{" "}
                    <span className="text-sm font-normal">
                      {new Date(edu?.startDate).toLocaleString("en-GB", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric"
                      })}{" "}
                      -{" "}
                      {new Date(edu?.endDate).toLocaleString("en-GB", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric"
                      })}
                    </span>
                  </h4>
                  <p className="text-gray-600">
                    {edu?.school} {` - (${edu?.location})`}
                  </p>
                </div>
              ))}
            </div>
          )}
          <hr />

          {/* Certificate Section */}
          {formData.certificates.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-bold mt-6 mb-3">Certificates</h2>
              <div className="space-y-3">
                {formData?.certificates?.map((certificate, index) => (
                  <div className="mt-2" key={index}>
                    <h4 className="font-medium text-gray-800 capitalize">
                      {certificate?.name}
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
                      {new Date(certificate?.endDate).toLocaleString("en-GB", {
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
          <hr />

          {/* Hobbies Section */}
          {formData.interests.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-bold mt-6 mb-3">Hobbies</h2>
              <ul className="mt-2 list-disc pl-5">
                {formData?.interests?.map((skill, index) => (
                  <li key={index} className="text-md font-medium text-gray-800">
                    {skill.name}
                  </li>
                ))}
              </ul>
            </div>
          )}
          <hr />

          {/* Featured Skills */}
          {formData.featuredSkills.length > 0 && (
            <div className="mt-6">
              <h3 className="text-xl font-bold mt-6 mb-3">Featured Skills</h3>
              <ul className="mt-2 list-disc pl-5">
                {formData?.featuredSkills?.map((skill, index) => (
                  <li key={index} className="text-md font-medium text-gray-800">
                    {skill.name}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ResumeTwo;
