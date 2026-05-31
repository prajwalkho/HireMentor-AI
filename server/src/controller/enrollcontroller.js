const courseModel = require("../models/courseModel");
const Enroll = require("../models/enrollCoursemodel");
const CourseInfo = require("../models/courseInfoModel")

// Enroll a User in a Course
exports.enrollCourse = async (req, res) => {
    const userId = req.user.id


    try {
        const { role, course, courseOverview } = req.body;

        const newEnrollCourse = new Enroll({
            role,
            course,
            user: userId,
            courseOverview
        });

        await newEnrollCourse.save();

        res.status(201).json({
            message: "User enrolled in course successfully.",
            data: newEnrollCourse
        });
    } catch (error) {
        res.status(500).json({ error: "Failed to enroll user in course.", details: error.message });
    }
};
// View Courses for a User
exports.getCoursesByUser = async (req, res) => {
    try {

        const userId = req.user.id;


        const enrollments = await Enroll.find({ user: userId })
            .populate("role")
            .populate("course")
            .populate("courseOverview");



        res.status(200).json({ success: true, enrollments });
    } catch (error) {

        res.status(500).json({ success: false, message: "Server error. Please try again later." });
    }
};


// Mark Theory or Practical Exam as Completed
exports.completeExam = async (req, res) => {
    try {
        debugger
        const { examType, result } = req.body;

        const course = await Enroll.findById(req.params.id);
        console.log(course);



        if (examType === "Theory") {
            course.theoryExamStatus = "completed";
            course.result = result ? result : 0;
        } else if (examType === "Practical") {
            course.practicalExamStatus = "completed";
        } else {
            return res.status(400).json({ error: "Invalid exam type." });
        }

        // Check if both exams are completed
        if (course.theoryExamStatus === "completed" && course.practicalExamStatus === "completed") {
            course.status = "Pass";
            course.resultDate = new Date();
        }

        await course.save();

        res.status(200).json({
            message: `${examType.charAt(0).toUpperCase() + examType.slice(1)} exam marked as completed.`,
            course
        });
    } catch (error) {
        console.log(error);

        res.status(500).json({ error: "Failed to update exam status.", details: error.message });
    }
};