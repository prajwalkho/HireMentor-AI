const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    role: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Role",
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Auth",
        required: true
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
        required: true
    },
    courseOverview: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "CourseInfo",
        required: true
    },
    status: {
        type: String,
        enum: ["Pass", "Fail"],
        default: "Fail"
    },
    result: {
        type: String,
        default:0
    },
    resultPractical: {
        type: String,
        default: null
    },
    resultDate: {
        type: Date,
        default: null
    },
    theoryExamStatus: {
        type: String,
        enum: ["pending", "completed"],
        default: "pending"
    },
    practicalExamStatus: {
        type: String,
        enum: ["pending", "completed"],
        default: "pending"
    }
}, { timestamps: true });

const Enroll = mongoose.model("enroll", courseSchema);
module.exports = Enroll;
