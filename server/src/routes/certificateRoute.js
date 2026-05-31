const express = require('express');
const router  = express.Router();
const {
  getUserCertificates,
  getCertificateById,
  verifyCertificate,
  getAllCertificates,
  getCertificateByExam,
} = require('../controller/certificateController');
const { auth } = require('../middleware/authenticate');

router.get('/user',           auth, getUserCertificates);
router.get('/all',            auth, getAllCertificates);
router.get('/exam/:examId',   auth, getCertificateByExam);
router.get('/verify/:certId', verifyCertificate);        // public
router.get('/:id',            auth, getCertificateById);

module.exports = router;
