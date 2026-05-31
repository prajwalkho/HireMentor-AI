const Certificate = require('../models/certificateModel');
const Exam        = require('../models/examManagemenModel');
const Auth        = require('../models/authmodel');

// Unique cert ID: CERT-XXXXXX-YYYY
const generateCertId = () => {
  const part1 = Math.random().toString(36).substring(2, 8).toUpperCase();
  const part2 = Date.now().toString(36).toUpperCase().slice(-4);
  return `CERT-${part1}-${part2}`;
};

// Auto-called from examcontroller after a Pass result
exports.issueCertificate = async ({ userId, examId, studentName, courseTitle, score }) => {
  // Avoid duplicate certificate for the same exam
  const existing = await Certificate.findOne({ examId });
  if (existing) return existing;

  const cert = await Certificate.create({
    certificateId: generateCertId(),
    userId,
    examId,
    studentName,
    courseTitle,
    score,
    issuedAt: new Date(),
  });
  return cert;
};

// GET /api/v2/certificates/user  — all certs for logged-in user
exports.getUserCertificates = async (req, res) => {
  try {
    const userId = req.user._id;
    const certs  = await Certificate.find({ userId, isActive: true })
      .sort({ issuedAt: -1 });

    res.status(200).json({ success: true, data: certs, count: certs.length });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/v2/certificates/:id  — single cert by MongoDB _id
exports.getCertificateById = async (req, res) => {
  try {
    const cert = await Certificate.findById(req.params.id);
    if (!cert) return res.status(404).json({ success: false, message: 'Certificate not found' });
    res.status(200).json({ success: true, data: cert });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/v2/certificates/verify/:certId  — public verification by cert string ID
exports.verifyCertificate = async (req, res) => {
  try {
    const cert = await Certificate.findOne({ certificateId: req.params.certId });
    if (!cert || !cert.isActive) {
      return res.status(404).json({ success: false, message: 'Invalid or revoked certificate' });
    }
    res.status(200).json({ success: true, data: cert });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Admin: GET /api/v2/certificates/all  — all certs
exports.getAllCertificates = async (req, res) => {
  try {
    const certs = await Certificate.find({ isActive: true })
      .populate('userId', 'first_Name last_Name email')
      .sort({ issuedAt: -1 });
    res.status(200).json({ success: true, data: certs, count: certs.length });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/v2/certificates/exam/:examId  — cert for a specific exam
exports.getCertificateByExam = async (req, res) => {
  try {
    const cert = await Certificate.findOne({ examId: req.params.examId, isActive: true });
    if (!cert) return res.status(404).json({ success: false, message: 'No certificate for this exam' });
    res.status(200).json({ success: true, data: cert });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
