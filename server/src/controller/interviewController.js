const { google } = require('googleapis');
 


require('dotenv').config();
const MockInterview = require("../models/mockInterview");
const UserAnswer = require("../models/userAnswer");





const senData = require('../config/mail');  
const Interview = require('../models/interviewmodel');  
const { LinkUi } = require('../utils/LinkUi');
const SharedInterviewLink = require('../models/shareLinkschema');
const Auth = require('../models/authmodel');
const Candidate = require('../models/candidateInformationmodel');

// Custom link generator (you can customize as needed)
function generateInterviewLink(candidateEmail, interviewDate, interviewTime) {
  return `https://yourdomain.com/interview/${encodeURIComponent(candidateEmail)}-${interviewDate}-${interviewTime}`;
}

// Email sender
async function sendInterviewEmail(candidateEmail, interviewLink, candidateName, interviewType, interviewDate, interviewTime) {
  const htmlContent = LinkUi(candidateEmail, interviewLink, interviewDate, interviewTime, interviewType);
  await senData(candidateEmail, 'Interview Scheduled', htmlContent);
}

// Create or fetch shared link
async function getOrCreateSharedLink(candidateEmail, interviewLink) {
  try {
    let sharedLink = await SharedInterviewLink.findOne({ candidateEmail });

    if (!sharedLink) {
      sharedLink = new SharedInterviewLink({
        candidateEmail,
        googleMeetLink: interviewLink,
      });
      await sharedLink.save();
    }

    return sharedLink._id;
  } catch (error) {
    throw new Error('Error creating or fetching shared link.');
  }
}

// Main controller
exports.scheduleInterview = async (req, res) => {
  try {
    const loginUserId = req.user.id;

    const loginUser = await Auth.findById(loginUserId);
    if (!loginUser) {
      return res.status(404).json({
        success: false,
        message: "Logged-in user not found",
      });
    }

    const { role, candidateEmail, interviewDate, interviewTime } = req.body;

    if (!candidateEmail || !interviewDate || !interviewTime) {
      return res.status(400).json({
        success: false,
        message: "Candidate email, interview date, and time are required.",
      });
    }

    const candidateInfo = await Candidate.findOne({
      $and: [{ email: candidateEmail }, { role }],
    });

    if (!candidateInfo) {
      return res.status(404).json({
        success: false,
        message: "Candidate information not found. Please create candidate info first.",
      });
    }

    // Generate custom interview link
    const interviewLink = generateInterviewLink(candidateEmail, interviewDate, interviewTime);

    // Store shared link
    const sharedLinkId = await getOrCreateSharedLink(candidateEmail, interviewLink);

    // Save interview in DB
    const newInterview = new Interview({
      userId: loginUserId,
      candidateId: candidateInfo._id,
      candidateName: `${candidateInfo.first_Name} ${candidateInfo.last_Name}`,
      candidateEmail: candidateInfo.email,
      interviewDate,
      interviewTime,
      sharedLink: sharedLinkId,
      status: "Pending",
      interviewType: "LiveInterview",
      gender: candidateInfo.gender,
      role: candidateInfo.role,
      phoneNumber: candidateInfo.phoneNumber,
      address: candidateInfo.address,
      skills: candidateInfo.skill,
      graduation: candidateInfo.graduation,
      profile: candidateInfo.profile,
      resume: candidateInfo.file,
    });

    const savedInterview = await newInterview.save();

    if (!savedInterview) {
      return res.status(500).json({
        success: false,
        message: "Error saving interview in the database.",
      });
    }

    // Send email with interview link
    await sendInterviewEmail(
      candidateEmail,
      interviewLink,
      candidateInfo.first_Name,
      "LiveInterview",
      interviewDate,
      interviewTime
    );

    return res.status(201).json({
      success: true,
      message: "LiveInterview scheduled successfully.",
      interviewLink,
      sharedLinkId,
      interviewType: "LiveInterview",
      candidateDetails: {
        name: `${candidateInfo.first_Name} ${candidateInfo.last_Name}`,
        email: candidateInfo.email,
        gender: candidateInfo.gender,
        role: candidateInfo.role,
      },
    });
  } catch (error) {
    console.error("Error scheduling LiveInterview:", error);
    return res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};

exports.getCandidateInterviews = async (req, res) => {
  try {
    const loginUserId = req.user.id;


    const loginUser = await Auth.findById(loginUserId);
    if (!loginUser) {
      return res.status(404).json({
        success: false,
        message: "Logged-in user not found",
      });
    }


    const interviews = await Interview.find({ userId: loginUserId })
      .populate("sharedLink")
      .exec();

    

    return res.status(200).json({
      success: true,
      interviews,
    });
  } catch (error) {
    console.error("Error fetching interviews:", error);
    return res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};

exports.getInterviews = async (req, res) => {
  try {
    console.log("Hi ....................................");
    const interviews = await Interview.find()
      .populate("sharedLink")
      .exec();

    return res.status(200).json({
      success: true,
      interviews,
    });
  } catch (error) {
    console.error("Error fetching interviews:", error);
    return res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};
// Get combined interviews 
exports.getCandidateInterviewsByID = async (req, res) => {
  try {

    const interviews = await Interview.findById(req.params.id)
      .populate("sharedLink")
      .exec();

    
    return res.status(200).json({
      success: true,
      interviews: interviews,
    });
  } catch (error) {
    console.log(error);
    
    return res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};

//change status by recruiter
exports.updateInterviewStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, selected } = req.body;
   
    let interview;
  

    interview = await Interview.findById(id);


    if (!interview) {
      interview = await LiveInterviewModel.findById(id);


      if (!interview) {
        return res.status(404).json({ message: 'Interview not found.' });
      }
    }


    if (status) {
      interview.status = status;
    }


    if (selected !== undefined) {
      interview.selected = selected;
    }


    await interview.save();

   
    return res.status(200).json({
      message: 'Interview updated successfully.',
      interview,
    });
  } catch (error) {
    
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
};



//pratik
exports.createMockInterview = async (req, res) => {
  try {
    const {
      jsonMockResp,
      jobPosition,
      jobDesc,
      jobExperience,
      createdBy,
      mockId,
    } = req.body;

   
    if (!jobPosition || !jobDesc || !jobExperience || !createdBy || !mockId) {
      return res.status(400).json({
        success: false,
        message:
          "All fields are required (jobPosition, jobDesc, jobExperience, createdBy, mockId).",
      });
    }

    
    const newMockInterview = await MockInterview.create({
      jsonMockResp,
      jobPosition,
      jobDesc,
      jobExperience,
      createdBy,
      mockId,
      createdAt: new Date().toISOString(),
    });

    return res.status(201).json({
      success: true,
      message: "Mock interview created successfully",
      data: newMockInterview,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

exports.getMockInterviewByMockId = async (req, res) => {
  try {
    const { mockId } = req.params;

    
    if (!mockId) {
      return res.status(400).json({
        success: false,
        message: "mockId is required",
      });
    }

    
    const mockInterview = await MockInterview.findOne({ mockId });

    if (!mockInterview) {
      return res.status(404).json({
        success: false,
        message: "Mock interview not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Mock interview fetched successfully",
      data: mockInterview,
    });
  } catch (error) {

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

exports.createUserAnswer = async (req, res) => {
  try {
    const {
      mockIdRef,
      question,
      correctAns,
      userAns,
      feedback,
      rating,
      userEmail,
    } = req.body;

    
    if (!mockIdRef || !question || !userAns || !userEmail) {
      return res.status(400).json({
        success: false,
        message:
          "All fields are required (mockIdRef, question, userAns, userEmail).",
      });
    }

    
    const newUserAnswer = await UserAnswer.create({
      mockIdRef,
      question,
      correctAns,
      userAns,
      feedback,
      rating,
      userEmail,
    });

    return res.status(201).json({
      success: true,
      message: "User answer saved successfully",
      data: newUserAnswer,
    });
  } catch (error) {

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

exports.getUserAnswersByMockIdRef = async (req, res) => {
  try {
    const { mockIdRef } = req.params;

    if (!mockIdRef) {
      return res.status(400).json({
        success: false,
        message: "mockIdRef is required",
      });
    }

    const userAnswers = await UserAnswer.find({ mockIdRef });

    if (userAnswers.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No user answers found for the given Exam.",
        data: []
      });
    }

    return res.status(200).json({
      success: true,
      message: "User answers fetched successfully",
      data: userAnswers,
    });
  } catch (error) {

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

exports.getMockInterviewsByCreatedBy = async (req, res) => {
  try {
    const { createdBy } = req.params;

   
    if (!createdBy) {
      return res.status(400).json({
        success: false,
        message: "createdBy is required",
      });
    }

    
    const mockInterviews = await MockInterview.find({ createdBy });

   

    return res.status(200).json({
      success: true,
      message: "Mock interviews fetched successfully",
      data: mockInterviews,
    });
  } catch (error) {

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};









