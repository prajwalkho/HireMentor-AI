import React, { useRef } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { MdDownload, MdVerified, MdShare } from "react-icons/md";
import { FiAward } from "react-icons/fi";
import toast from "react-hot-toast";

// ── Decorative SVG ornament ──────────────────────────
const Ornament = ({ flip = false }) => (
  <svg
    width="80" height="20" viewBox="0 0 80 20"
    style={{ transform: flip ? "scaleX(-1)" : "none" }}
    className="text-yellow-600 opacity-70"
    fill="currentColor"
  >
    <path d="M0 10 Q10 2 20 10 Q30 18 40 10 Q50 2 60 10 Q70 18 80 10" stroke="currentColor" strokeWidth="1.5" fill="none" />
    <circle cx="0"  cy="10" r="2" />
    <circle cx="20" cy="10" r="2" />
    <circle cx="40" cy="10" r="2" />
    <circle cx="60" cy="10" r="2" />
    <circle cx="80" cy="10" r="2" />
  </svg>
);

// ── Corner ornament ──────────────────────────────────
const Corner = ({ rotate = 0 }) => (
  <div style={{ transform: `rotate(${rotate}deg)` }} className="absolute">
    <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
      <path d="M4 4 L4 24 M4 4 L24 4" stroke="#b7791f" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M4 4 L16 16" stroke="#b7791f" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="2 3" />
      <circle cx="4"  cy="4"  r="3" fill="#b7791f" />
      <circle cx="28" cy="4"  r="1.5" fill="#d97706" />
      <circle cx="4"  cy="28" r="1.5" fill="#d97706" />
    </svg>
  </div>
);

// ── Certificate seal ─────────────────────────────────
const Seal = ({ score }) => (
  <div className="relative flex items-center justify-center">
    <svg width="90" height="90" viewBox="0 0 90 90">
      {/* Outer star ring */}
      {Array.from({ length: 12 }, (_, i) => {
        const angle  = (i * 30 * Math.PI) / 180;
        const x = 45 + 40 * Math.cos(angle);
        const y = 45 + 40 * Math.sin(angle);
        return <circle key={i} cx={x} cy={y} r="3" fill="#b7791f" opacity="0.8" />;
      })}
      {/* Rings */}
      <circle cx="45" cy="45" r="37" fill="#fef3c7" stroke="#d97706" strokeWidth="2" />
      <circle cx="45" cy="45" r="32" fill="none"    stroke="#b7791f" strokeWidth="1" strokeDasharray="3 2" />
      <circle cx="45" cy="45" r="26" fill="#fde68a" stroke="#d97706" strokeWidth="1.5" />
      {/* Inner content */}
      <text x="45" y="40" textAnchor="middle" fontSize="9" fill="#92400e" fontWeight="bold" fontFamily="serif">SCORE</text>
      <text x="45" y="54" textAnchor="middle" fontSize="14" fill="#78350f" fontWeight="bold" fontFamily="serif">{score}%</text>
      <text x="45" y="64" textAnchor="middle" fontSize="6"  fill="#92400e" fontFamily="serif">CERTIFIED</text>
    </svg>
  </div>
);

// ── Main Certificate Component ───────────────────────
const Certificate = ({ cert }) => {
  const certRef = useRef(null);

  if (!cert) return null;

  const {
    certificateId,
    studentName,
    courseTitle,
    score,
    issuedAt,
  } = cert;

  const formattedDate = new Date(issuedAt).toLocaleDateString("en-US", {
    day: "numeric", month: "long", year: "numeric",
  });

  // ── Download as PDF ──────────────────────────────
  const downloadPDF = async () => {
    const toastId = toast.loading("Generating PDF…");
    try {
      const el      = certRef.current;
      const canvas  = await html2canvas(el, { scale: 2, useCORS: true, backgroundColor: "#fff" });
      const imgData = canvas.toDataURL("image/png");

      // A4 landscape: 297 × 210 mm
      const pdf = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
      const pdfW = pdf.internal.pageSize.getWidth();
      const pdfH = pdf.internal.pageSize.getHeight();
      pdf.addImage(imgData, "PNG", 0, 0, pdfW, pdfH);
      pdf.save(`Certificate-${studentName.replace(/\s+/g, "_")}-${certificateId}.pdf`);
      toast.success("Certificate downloaded!", { id: toastId });
    } catch {
      toast.error("Download failed. Please try again.", { id: toastId });
    }
  };

  // ── Share / Copy link ────────────────────────────
  const copyLink = () => {
    const url = `${window.location.origin}/certificate/verify/${certificateId}`;
    navigator.clipboard.writeText(url).then(() => toast.success("Verification link copied!"));
  };

  return (
    <div className="flex flex-col items-center gap-6">
      {/* ── The actual certificate (captured by html2canvas) ── */}
      <div
        ref={certRef}
        style={{
          width: "842px",          // ~A4 landscape width at 96dpi
          minHeight: "595px",
          background: "linear-gradient(135deg, #fffbeb 0%, #ffffff 40%, #eff6ff 100%)",
          position: "relative",
          fontFamily: "'Georgia', serif",
          padding: "0",
          boxShadow: "0 25px 60px rgba(0,0,0,0.15)",
          border: "1px solid #e5e7eb",
        }}
        className="rounded-2xl overflow-hidden"
      >
        {/* Outer border line */}
        <div style={{
          position: "absolute", inset: "12px",
          border: "2.5px solid #b7791f",
          borderRadius: "12px",
          pointerEvents: "none",
          zIndex: 1,
        }} />
        {/* Inner border line */}
        <div style={{
          position: "absolute", inset: "18px",
          border: "1px solid #d97706",
          borderRadius: "8px",
          pointerEvents: "none",
          zIndex: 1,
        }} />

        {/* Corner ornaments */}
        <div className="absolute top-3 left-3"    style={{ zIndex: 2 }}><Corner rotate={0}   /></div>
        <div className="absolute top-3 right-3"   style={{ zIndex: 2 }}><Corner rotate={90}  /></div>
        <div className="absolute bottom-3 right-3" style={{ zIndex: 2 }}><Corner rotate={180} /></div>
        <div className="absolute bottom-3 left-3" style={{ zIndex: 2 }}><Corner rotate={270} /></div>

        {/* Content */}
        <div className="flex flex-col items-center justify-center h-full py-10 px-16 relative z-10" style={{ minHeight: "595px" }}>

          {/* Header */}
          <div className="flex items-center gap-3 mb-1">
            <div style={{
              width: 48, height: 48,
              background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
              borderRadius: 12,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <FiAward size={26} color="white" />
            </div>
            <div>
              <p style={{ fontSize: 13, color: "#6b7280", letterSpacing: 4, textTransform: "uppercase", fontFamily: "Georgia, serif" }}>
               HireMentor AI Suite
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 my-3">
            <Ornament />
            <p style={{ fontSize: 11, color: "#9ca3af", letterSpacing: 6, textTransform: "uppercase" }}>
              presents
            </p>
            <Ornament flip />
          </div>

          {/* Main title */}
          <h1 style={{
            fontSize: 38, fontWeight: "bold", color: "#1e1b4b",
            letterSpacing: 3, textTransform: "uppercase",
            fontFamily: "Georgia, serif",
            textShadow: "0 1px 2px rgba(0,0,0,0.08)",
          }}>
            Certificate of Completion
          </h1>

          <div className="flex items-center gap-3 my-4">
            <div style={{ flex: 1, height: 1, background: "linear-gradient(to right, transparent, #d97706)" }} />
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#d97706" }} />
            <div style={{ flex: 1, height: 1, background: "linear-gradient(to left, transparent, #d97706)" }} />
          </div>

          {/* Body */}
          <p style={{ fontSize: 15, color: "#6b7280", letterSpacing: 1 }}>
            This is to certify that
          </p>

          <h2 style={{
            fontSize: 42, color: "#312e81", fontFamily: "Georgia, serif",
            fontWeight: "bold", margin: "10px 0 4px",
            borderBottom: "2px solid #d97706", paddingBottom: 6,
          }}>
            {studentName}
          </h2>

          <p style={{ fontSize: 15, color: "#6b7280", margin: "12px 0 4px" }}>
            has successfully completed the course
          </p>

          <h3 style={{
            fontSize: 22, color: "#1e40af", fontWeight: "bold",
            fontFamily: "Georgia, serif", margin: "4px 0 16px",
            textAlign: "center", maxWidth: 500,
          }}>
            {courseTitle}
          </h3>

          {/* Score + Date row */}
          <div className="flex items-center justify-center gap-12 mt-2">
            {/* Seal */}
            <Seal score={score} />

            {/* Divider */}
            <div style={{ width: 1, height: 80, background: "#d97706", opacity: 0.4 }} />

            {/* Details */}
            <div style={{ textAlign: "left" }}>
              <div style={{ marginBottom: 10 }}>
                <p style={{ fontSize: 10, color: "#9ca3af", textTransform: "uppercase", letterSpacing: 2 }}>Date of Issue</p>
                <p style={{ fontSize: 16, color: "#1f2937", fontWeight: "bold" }}>{formattedDate}</p>
              </div>
              <div>
                <p style={{ fontSize: 10, color: "#9ca3af", textTransform: "uppercase", letterSpacing: 2 }}>Certificate ID</p>
                <p style={{ fontSize: 13, color: "#4f46e5", fontWeight: "bold", fontFamily: "monospace" }}>{certificateId}</p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center gap-3 mt-8">
            <Ornament />
            <p style={{ fontSize: 10, color: "#9ca3af", letterSpacing: 3, textTransform: "uppercase" }}>
             HireMentor AI Suite · BCA 2026
            </p>
            <Ornament flip />
          </div>
        </div>
      </div>

      {/* Action buttons — outside the captured area */}
      <div className="flex flex-wrap gap-3 justify-center">
        <button
          onClick={downloadPDF}
          className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-indigo-700 transition-colors shadow-md"
        >
          <MdDownload size={18} /> Download PDF
        </button>
        <button
          onClick={copyLink}
          className="flex items-center gap-2 bg-white text-gray-700 border border-gray-200 px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-gray-50 transition-colors shadow-sm"
        >
          <MdShare size={18} /> Copy Verify Link
        </button>
        <div className="flex items-center gap-1.5 px-4 py-2.5 bg-emerald-50 text-emerald-700 rounded-xl text-sm font-semibold border border-emerald-100">
          <MdVerified size={18} /> ID: {certificateId}
        </div>
      </div>
    </div>
  );
};

export default Certificate;
