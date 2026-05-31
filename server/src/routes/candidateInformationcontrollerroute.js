const express = require('express');
const {  viewCandidates, findCandidateById, deleteCandidate, updateCandidate, createCandidateInfo } = require('../controller/candidateInformationcontroller');
const { auth } = require('../middleware/authenticate');
const upload=require("../middleware/uploadMiddleware")
const router = express.Router();

router.post("/addcandidateinfo",auth,upload.fields([
    { name: 'file', maxCount: 1 },
    {name:"profile",maxCount:1}
]),createCandidateInfo)
router.get("/viewallinfo",auth,viewCandidates)
router.get("/viewinfo/:id",findCandidateById)
router.delete("/:id",deleteCandidate)
router.put("/:id",auth,upload.fields([
    { name: 'file', maxCount: 1 },
    {name:"profile",maxCount:1}
]),updateCandidate)
module.exports = router; 