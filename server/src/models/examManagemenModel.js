// const mongoose = require('mongoose');

// const examSchema = new mongoose.Schema({
//     role: {
//         type: String,
//         type:mongoose.Schema.ObjectId,
//         ref:"Role",
//     },
//     course: {
//         type: String,
//          type:mongoose.Schema.ObjectId,
//         ref:"Course",
//     },
//     question: {
//         type: String,
//     },
//     options: {
//         type: [String],
//     },
//     rightAnswer: {
//         type: String,
//     },
//     description: {
//         type: String
//     },
//     examType: {
//          type:String,
//         enum: ["Theory", "Practical"],
//     }
// }, {
//     timestamps: true
// });

// const Exam = mongoose.model('Exam', examSchema);

// module.exports = Exam;

const mongoose = require("mongoose");

const examSchema = new mongoose.Schema(
  {
    questions: {
      type: String,
    },
    course: {
      type: String,
      type: mongoose.Schema.ObjectId,
      ref: "CourseInfo",
    },
    user: {
      type: String,
      type: mongoose.Schema.ObjectId,
      ref: "Auth",
    },
    userAnswer: [
      {
        question: { type: String, required: true },
        userAnswer: { type: String, required: true },
        rightAnswer: { type: Boolean, required: true },
      },
    ],
    status: {
      type: String,
      enum: ["pending", "completed"],
    },
    result: {
      type: String,
      enum: ["Pass", "Fail"],
    },
    Score: {
      type: String,
    },
    examLaval: {
      type: String,
    },
    jobExperience: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Exam = mongoose.model("Exam", examSchema);

module.exports = Exam;
