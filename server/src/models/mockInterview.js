const mongoose = require("mongoose");

const mockInterview = new mongoose.Schema(
  {
    jsonMockResp: {
      type: String,
    },
    jobPosition: {
      type: String,
    },
    jobDesc: {
      type: String,
    },
    jobExperience: {
      type: String,
    },
    createdBy: {
      type: String,
      type: mongoose.Schema.ObjectId,
      ref: "Auth",
    },
    createdAt: {
      type: String,
    },
    mockId: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);
const MockInterview = mongoose.model("MockInterview", mockInterview);

module.exports = MockInterview;