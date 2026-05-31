const mongoose = require("mongoose");

const userAnswerSchema = new mongoose.Schema(
  {
    mockIdRef: {
      type: String,
      required: true,
    },
    question: {
      type: String,
      required: true,
    },
    correctAns: {
      type: String,
    },
    userAns: {
      type: String,
    },
    feedback: {
      type: String,
    },
    rating: {
      type: String,
    },
    userEmail: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const UserAnswer = mongoose.model("UserAnswer", userAnswerSchema);

module.exports = UserAnswer;
