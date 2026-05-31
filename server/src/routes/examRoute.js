// const { createExam, updateExam, deleteExam, viewExams } = require("../controller/examcontroller");

// const router=require("express").Router();
// router.post('/exams', createExam);
// router.put('/exams/:id', updateExam);
// router.delete('/exams/:id', deleteExam);
// router.get('/exams', viewExams);
// module.exports=router;

const { createExam, completeExam, getExamsByUser, getExamById, getLatestExams } = require("../controller/examcontroller");
const { auth } = require("../middleware/authenticate");
const router = require("express").Router();

router.post("/exams", createExam);
router.put("/exam/complete", completeExam);
router.get("/exam", auth, getExamsByUser);
router.get("/exams/:examId", getExamById);
router.get("/latest-exams", auth, getLatestExams);
module.exports = router;
