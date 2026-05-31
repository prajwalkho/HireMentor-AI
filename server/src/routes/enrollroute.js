const { enrollCourse, completeExam, getCoursesByUser } = require("../controller/enrollcontroller");
const { auth } = require("../middleware/authenticate");

const router=require("express").Router();
// Route to enroll a user in a course
router.post('/enroll',auth, enrollCourse);
// Route to get all courses for a specific user
router.get('/getenroll',auth, getCoursesByUser);
// Route to update the exam status (theory or practical)
router.put('/complete-exam/:id', auth,completeExam);
module.exports=router;