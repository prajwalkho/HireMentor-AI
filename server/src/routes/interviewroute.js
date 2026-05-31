const express = require("express");
const {
  createMockInterview,
  getMockInterviewByMockId,
  createUserAnswer,
  getUserAnswersByMockIdRef,
  getMockInterviewsByCreatedBy,
  scheduleInterview,
getInterviewData,
updateInterviewStatus,
getCandidateInterviews,
getCandidateInterviewsByID,
getInterviews
} = require("../controller/interviewController");
const { auth, IsRecruiter } = require("../middleware/authenticate");
const router = express.Router();

// Role routes
router.post("/mock-interview",createMockInterview);
router.get("/mock-interview/:mockId", getMockInterviewByMockId);
router.post("/user-answer", createUserAnswer);
router.get("/user-answer/:mockIdRef", getUserAnswersByMockIdRef);
router.get("/created-by/:createdBy", getMockInterviewsByCreatedBy); 

router.post("/schedule",auth,scheduleInterview)
router.get("/viewschedule",auth,getCandidateInterviews)
router.get("/all/viewschedule",getInterviews)
router.get("/:id",getCandidateInterviewsByID)
//change interview status
router.put('/:id/changestatus',updateInterviewStatus);

module.exports = router;