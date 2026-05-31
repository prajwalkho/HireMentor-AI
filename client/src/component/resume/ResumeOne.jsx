import React, { useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import email from "../../../public/assets/email.svg";
import call from "../../../public/assets/call.svg";
import locationicon from "../../../public/assets/location.svg";
import gender from "../../../public/assets/gender.svg";
import link from "../../../public/assets/link.svg";

const ResumeOne = () => {
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
      <div className=" w-[900px] mx-auto  items-center mt-6" ref={resumeRef}>
        <div className="w-full max-w-5xl bg-white rounded-lg overflow-hidden shadow-xl print:shadow-none">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_1.8fr]">
            {/* Sidebar */}
            <aside className="bg-[rgb(68,77,94)] p-8 text-white">
              <div className="flex flex-col items-center mb-8">
                <img
                  src={
                    formData.profile_photo
                      ? URL.createObjectURL(formData.profile_photo)
                      : "https://via.placeholder.com/150"
                  }
                  alt="Profile"
                  className="w-32 h-32 rounded-full mb-4 object-cover border-4 border-slate-600"
                />
                <h1 className="text-3xl font-bold mb-1 text-center capitalize">
                  {formData.name || "user"}
                </h1>
                <h2 className="text-xl text-slate-300 capitalize">
                  {formData.role || "Your Role"}
                </h2>
              </div>

              <section className="mb-8">
                <h3 className="text-xl font-semibold mb-2">CONTACT</h3>
                <div className=" text-slate-300 space-y-2">
                  <div>
                    <p className="py-1 flex ">
                      <img src={call} width={18} className="me-1" />{" "}
                      {formData.phone || "+91 37248 34556"}
                    </p>
                    <p className="py-1 flex">
                      <img src={email} width={18} className="me-1" />{" "}
                      {formData.email}
                    </p>
                    <p className="py-1 flex ">
                      <img src={locationicon} width={18} className="me-1" />{" "}
                      {formData.location}
                    </p>
                    <p className="py-1 flex ">
                      <img src={gender} width={18} className="me-1" />{" "}
                      {formData.gender}{" "}
                    </p>
                    <Link
                      to={formData.website}
                      target="_blank"
                      className="py-1 flex"
                    >
                      <img src={link} width={18} className="me-1" />{" "}
                      {formData.website}
                    </Link>
                  </div>
                </div>
              </section>

              {formData.skills.length > 0 && (
                <section className="mb-8">
                  <h3 className="text-xl font-semibold mb-1">SKILLS</h3>
                  <div className=" text-slate-300 leading-relaxed">
                    <ul className="mt-2 list-disc pl-5">
                      {formData?.skills?.map((skill, index) => (
                        <li key={index}>{skill.name}</li>
                      ))}
                    </ul>
                  </div>
                </section>
              )}

              {formData.interests.length > 0 && (
                <section className="mb-8">
                  <h3 className="text-xl font-bold mb-3 py-2">HOBBIES</h3>
                  <div className="  space-y-2">
                    <div>
                      <ul className="mt-2 list-disc pl-5">
                        {formData?.interests?.map((skill, index) => (
                          <li key={index}>{skill.name}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </section>
              )}

              {formData.featuredSkills.length > 0 && (
                <section>
                  <h3 className="text-xl font-bold mb-3 py-2">
                    Featured Skills
                  </h3>
                  <div className="  space-y-2">
                    <div>
                      <ul className="mt-2  list-disc pl-5">
                        {formData?.featuredSkills?.map((skill, index) => (
                          <li key={index}>{skill.name}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </section>
              )}
            </aside>

            {/* Main Content */}
            <main className="p-8">
              <section className="mb-8">
                <h3 className="text-2xl font-bold mb-4 max-md:text-xl max-sm:text-[18px] max-lg:text-xl border-b-2 inline-block">
                  OBJECTIVE
                </h3>
                <p className="leading-relaxed">{formData.objective}</p>
              </section>

              {formData.workExperience.length > 0 && (
                <section className="mb-8">
                  <h3 className="text-2xl font-bold mb-4 rounded">
                    WORK EXPERIENCE
                  </h3>
                  <div className="space-y-6">
                    <ul className="list-disc pl-6">
                      {formData?.workExperience?.map((experience, index) => (
                        <li key={index} className="pb-4">
                          <h3 className="font-bold text-gray-800 capitalize">
                            {experience?.jobTitle}{" "}
                            {` - (${experience?.company})`}
                          </h3>
                          <p className="text-gray-600">
                            {experience?.location}
                          </p>
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
                            {new Date(experience?.endDate).toLocaleString(
                              "en-GB",
                              {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric"
                              }
                            )}
                          </p>
                          <p className="text-gray-600">
                            {" "}
                            {experience?.description}
                          </p>
                        </li>
                      ))}
                    </ul>
                  </div>
                </section>
              )}

              {formData.projects.length > 0 && (
                <section className="mb-8">
                  <h3 className="text-2xl font-bold mb-4 rounded">PROJECTS</h3>
                  <ul className="list-disc pl-6">
                    {formData?.projects?.map((projects, index) => (
                      <li className="mt-2" key={index}>
                        <h4 className="text-md font-medium text-gray-800 capitalize">
                          {projects?.projectName}
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
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {formData.languages.length > 0 && (
                <section className="mb-8">
                  <h3 className="text-2xl font-bold mb-4 rounded">LANGUAGES</h3>
                  <ul className="list-disc pl-6">
                    {formData?.languages?.map((skill, index) => (
                      <li key={index} className="text-gray-600 mb-[6px]">
                        {skill.name}
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {formData.education.length > 0 && (
                <section className="mb-8">
                  <h3 className="text-2xl font-bold mb-4 rounded">EDUCATION</h3>
                  <ul className="list-disc pl-6">
                    {formData?.education?.map((education, index) => (
                      <li key={index} className="pb-2">
                        <h3 className="font-bold text-gray-800 capitalize">
                          {education?.school}
                        </h3>
                        <p className="text-gray-600  ">{education?.degree}</p>
                        <p className="text-gray-600  ">{education?.location}</p>
                        <p className="text-gray-600 ">
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
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {formData.certificates.length > 0 && (
                <section>
                  <h3 className="text-2xl font-bold mb-4 rounded">
                    CERTIFICATE
                  </h3>
                  <ul className="list-disc pl-6">
                    {formData?.certificates?.map((certificates, index) => (
                      <li key={index} className="pb-2">
                        <h3 className="font-bold text-gray-800 capitalize">
                          {certificates?.name}
                        </h3>
                        <p className="text-gray-600">
                          {certificates?.location}
                        </p>
                        <p className="text-gray-600  ">
                          {new Date(certificates?.startDate).toLocaleString(
                            "en-GB",
                            {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric"
                            }
                          )}{" "}
                          -{" "}
                          {new Date(certificates?.endDate).toLocaleString(
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
                </section>
              )}
            </main>
          </div>
        </div>
      </div>
    </>
  );
};

export default ResumeOne;
