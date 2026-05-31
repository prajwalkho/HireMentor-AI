import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { axiosInstance, endPoints } from "../../api/axios";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import PageLoader from "../../component/PageLoader";
import { MdEmojiEvents, MdDownload, MdVerified, MdShare } from "react-icons/md";
import { FiAward } from "react-icons/fi";

const CertificateGallery = () => {
  const [certs, setCerts]   = useState([]);
  const [loader, setLoader] = useState(true);

  useEffect(() => {
    axiosInstance.get(endPoints.certificates.getUser)
      .then(r => setCerts(r.data?.data || []))
      .catch(() => toast.error("Failed to load certificates."))
      .finally(() => setLoader(false));
  }, []);

  const copyLink = (certId) => {
    const url = `${window.location.origin}/certificate/verify/${certId}`;
    navigator.clipboard.writeText(url).then(() => toast.success("Verification link copied!"));
  };

  if (loader) return <div className="flex justify-center items-center min-h-[60vh]"><PageLoader /></div>;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <FiAward size={26} className="text-amber-500" /> My Certificates
        </h1>
        <p className="text-gray-500 text-sm mt-0.5">
          {certs.length} certificate{certs.length !== 1 ? "s" : ""} earned
        </p>
      </motion.div>

      {certs.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 py-20 flex flex-col items-center gap-4">
          <div className="w-20 h-20 bg-amber-50 rounded-2xl flex items-center justify-center">
            <FiAward size={36} className="text-amber-300" />
          </div>
          <p className="font-semibold text-gray-600">No certificates yet</p>
          <p className="text-sm text-gray-400 text-center max-w-xs">
            Pass a course exam to earn your first certificate!
          </p>
          <Link to="/user/enroll-course"
            className="px-5 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 transition-colors">
            Browse Courses
          </Link>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {certs.map((cert, i) => (
            <motion.div
              key={cert._id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
            >
              {/* Card top gradient */}
              <div className="h-2 bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-400" />

              <div className="p-5">
                <div className="flex items-start gap-4">
                  {/* Seal icon */}
                  <div className="w-14 h-14 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                    <FiAward size={26} className="text-white" />
                  </div>

                  <div className="flex-1 overflow-hidden">
                    <h3 className="font-bold text-gray-800 truncate">{cert.courseTitle}</h3>
                    <p className="text-sm text-gray-500 mt-0.5">
                      {new Date(cert.issuedAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-full border border-emerald-100 flex items-center gap-1">
                        <MdVerified size={13} /> Score: {cert.score}%
                      </span>
                      <span className="px-2.5 py-1 bg-indigo-50 text-indigo-600 text-xs font-mono rounded-full">
                        {cert.certificateId}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
                  <Link
                    to={`/user/certificate/${cert._id}`}
                    className="flex-1 flex items-center justify-center gap-1.5 bg-indigo-600 text-white text-sm font-semibold py-2 rounded-xl hover:bg-indigo-700 transition-colors"
                  >
                    <MdDownload size={16} /> View & Download
                  </Link>
                  <button
                    onClick={() => copyLink(cert.certificateId)}
                    className="flex items-center justify-center gap-1.5 bg-gray-50 text-gray-600 text-sm font-semibold py-2 px-3 rounded-xl hover:bg-gray-100 transition-colors border border-gray-200"
                  >
                    <MdShare size={16} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CertificateGallery;
