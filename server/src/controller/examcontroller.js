const Exam = require("../models/examManagemenModel");
const { issueCertificate } = require("./certificateController");

// Create a new exam
// exports.createExam = async (req, res) => {
//   try {

//     const { role, course, question, options, rightAnswer, description, examType } = req.body;
//     const newExam = new Exam({ role, course, question, options, rightAnswer, description, examType });
//     const savedExam = await newExam.save();

//     res.status(201).json(
//         { message: 'Exam created successfully.' });
//   } catch (error) {
//     res.status(500).json(
//         { error: 'Failed to create exam.', details: error.message });
//   }
// };

// Update an existing exam
// exports.updateExam = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const {
//       role,
//       course,
//       question,
//       options,
//       rightAnswer,
//       description,
//       examType,
//     } = req.body;

//     if (options && !options.includes(rightAnswer)) {
//       return res
//         .status(400)
//         .json({ error: "Right answer must be one of the provided options." });
//     }

//     const updatedExam = await Exam.findByIdAndUpdate(
//       id,
//       { role, course, question, options, rightAnswer, description, examType },
//       { new: true, runValidators: true }
//     );

//     if (!updatedExam) {
//       return res.status(404).json({ error: "Exam not found." });
//     }

//     res.status(200).json({ message: "Exam updated successfully." });
//   } catch (error) {
//     res
//       .status(500)
//       .json({ error: "Failed to update exam.", details: error.message });
//   }
// };

// Delete an exam
// exports.deleteExam = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const deletedExam = await Exam.findByIdAndDelete(id);

//     if (!deletedExam) {
//       return res.status(404).json({ error: "Exam not found." });
//     }

//     res.status(200).json({ message: "Exam deleted successfully." });
//   } catch (error) {
//     res.status(500).json({ error: "Failed to delete exam." });
//   }
// };

// View (list) exams
// exports.viewExams = async (req, res) => {
//   try {
//     const exams = await Exam.find()
//       .populate("role", "roleName")
//       .populate("course")
//       .lean();

//     res.status(200).json({ exams });
//   } catch (error) {
//     res
//       .status(500)
//       .json({ error: "Failed to fetch exams.", details: error.message });
//   }
// };

exports.createExam = async (req, res) => {
  const { questions, course, user, status, examLaval, jobExperience } =
    req.body;

  // Validate required fields
  if (!questions || !course || !user || !status) {
    return res.status(400).json({ message: "All fields are required." });
  }
  try {
    const newExam = new Exam({
      questions,
      course,
      user,
      status,
      examLaval,
      jobExperience,
    });
    await newExam.save();

    return res.status(201).json({
      message: "Exam created successfully.",
      data: newExam,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

exports.completeExam = async (req, res) => {
  const { examId, userAnswer, status, result, Score } = req.body;

  if (!examId || !userAnswer || !status || !result || !Score) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    const exam = await Exam.findById(examId);

    if (!exam) {
      return res.status(404).json({ message: "Exam not found." });
    }

    exam.userAnswer = userAnswer;
    exam.status = status;
    exam.result = result;
    exam.Score = Score;

    await exam.save();

    // Auto-issue certificate when student passes
    let certificate = null;
    if (result === "Pass") {
      try {
        const Auth = require("../models/authmodel");
        const CourseInfo = require("../models/courseInfoModel");
        const [student, courseInfo] = await Promise.all([
          Auth.findById(exam.user),
          CourseInfo.findById(exam.course),
        ]);
        const studentName = student
          ? `${student.first_Name} ${student.last_Name}`
          : "Student";
        const courseTitle = courseInfo?.title || "Course";

        certificate = await issueCertificate({
          userId:      exam.user,
          examId:      exam._id,
          studentName,
          courseTitle,
          score:       Score,
        });
      } catch (certErr) {
        console.error("Certificate generation failed:", certErr.message);
      }
    }

    return res.status(200).json({
      message: "Exam completed successfully.",
      data: exam,
      certificate,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

exports.getExamsByUser = async (req, res) => {
  const userId = req.user.id;
  try {
    const exams = await Exam.find({ user: userId }).populate({
      path: "course",
      populate: {
        path: "roleId",
      },
    });

    return res.status(200).json({
      message: "Exams retrieved successfully.",
      data: exams,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({ message: "Internal server error." });
  }
};

exports.getExamById = async (req, res) => {
  const { examId } = req.params;

  try {
    const exam = await Exam.findById(examId);

    if (!exam) {
      return res.status(404).json({
        message: "Exam not found.",
      });
    }

    return res.status(200).json({
      message: "Exam retrieved successfully.",
      data: exam,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

exports.getLatestExams = async (req, res) => {
  const userId = req.user.id;

  try {
    const exams = await Exam.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate({
        path: "course",
        populate: {
          path: "roleId",
        },
      });

    return res.status(200).json({
      message: "Exams retrieved successfully.",
      data: exams,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error." });
  }
};
