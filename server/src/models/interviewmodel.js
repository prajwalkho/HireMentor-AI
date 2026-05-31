const mongoose = require('mongoose');

const interviewSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Auth', required: true },
    candidateName: { type: String, required: true },
    candidateEmail: { type: String},
    interviewDate: { type: String, required: true },
    interviewTime: { type: String, required: true },
    sharedLink: { type: mongoose.Schema.Types.ObjectId, ref: 'SharedInterviewLink' },
    status: { type: String, enum: ['Pending', 'Completed', 'Not_Attended', 'Attended'], default: 'Pending' },
    selected: { type: String, enum: ['Selected', 'Not_Selected'], default: 'Not_Selected' },
    interviewType: { type: String, enum: ['HR', 'LiveInterview'], default:"LiveInterview" }, // HR or Live
    gender:{type:String},
    role:{type:String},
    phoneNumber:{type:String},
    address:{type:String},
    profile:{type:String},
    candidateId: { type: mongoose.Schema.Types.ObjectId, ref: "candidateInformation" },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Interview', interviewSchema);
