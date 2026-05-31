import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { axiosInstance, endPoints } from "../../api/axios";
import Certificate from "../../component/Certificate";
import PageLoader from "../../component/PageLoader";
import toast from "react-hot-toast";
import { MdArrowBack } from "react-icons/md";

const CertificateView = () => {
  const { id }      = useParams();
  const navigate    = useNavigate();
  const [cert, setCert]   = useState(null);
  const [loader, setLoader] = useState(true);

  useEffect(() => {
    axiosInstance.get(endPoints.certificates.getById(id))
      .then(r => setCert(r.data?.data))
      .catch(() => { toast.error("Certificate not found."); navigate("/user/certificates"); })
      .finally(() => setLoader(false));
  }, [id]);

  if (loader) return <div className="flex justify-center items-center min-h-[60vh]"><PageLoader /></div>;

  return (
    <div className="max-w-5xl mx-auto space-y-5">
      <button onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-500 hover:text-indigo-600 text-sm font-medium transition-colors">
        <MdArrowBack size={18} /> Back to Certificates
      </button>
      <div className="overflow-x-auto pb-4">
        <Certificate cert={cert} />
      </div>
    </div>
  );
};

export default CertificateView;
