const path = require('path');
const fs = require('fs');
const senData = require("../config/mail");
const Auth = require("../models/authmodel");
const Enroll = require("../models/enrollCoursemodel");
const Exam = require("../models/examManagemenModel");
const { hash } = require("../utils/hashpassword");
const { ForgotFormat } = require("../utils/resetpasswordui");
const OTP_EXPIRATION_TIME = 30 * 1000;
const otpGnerator = require("otp-generator");
const bcrypt = require("bcryptjs");
const { generateToeken } = require("../utils/GenerateToken");
const { loginUi } = require("../utils/loginGoogleUi");
const otpStore = {};

// Configure upload directory
const UPLOAD_DIR = path.join(process.cwd(), 'uploads');
const PROFILE_DIR = path.join(UPLOAD_DIR, 'profiles');


// Ensure directories exist
[UPLOAD_DIR, PROFILE_DIR].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

//register
exports.register = async (req, res) => {
  try {
    const {
      first_Name,
      last_Name,
      email,
      birth_Date,
      gender,
      role,
      password,
      Cpassword,
    } = req.body;

    if (
      !first_Name ||
      !last_Name ||
      !email ||
      !birth_Date ||
      !gender ||
      !password ||
      !Cpassword
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    if (Cpassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Confirm password must be at least 6 characters",
      });
    }

    const existingUserByEmail = await Auth.findOne({ email });
    if (existingUserByEmail) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }

    if (password !== Cpassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match",
      });
    }

    const hashpassword = await hash(password);

    const user = await Auth.create({
      first_Name,
      last_Name,
      email,
      birth_Date,
      gender,
      role,
      password,
      password: hashpassword,
      role: role || "user",
    });

    if (user) {
      res.status(200).json({
        success: true,
        message: "User Registration Completed...",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server error",
    });
  }
};
// // Login function
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    let user = await Auth.findOne({ email });
    let isRecruiter = false;

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    if (user.isBlocked) {
      return res.status(403).json({
        success: false,
        message: "Your account has been blocked. Please contact admin.",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    await Auth.findByIdAndUpdate(user._id, {
      $set: { lastLogin: new Date() },
      $inc: { loginCount: 1 },
    });

    const token = generateToeken(user._id, res);

    return res.status(200).json({
      success: true,
      message: "Logged in successfully",
      user: {
        ...user._doc,
        password: "",
        userType: isRecruiter ? "recruiter" : "user",
      },
      token,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "An error occurred during login",
    });
  }
};

exports.loginWithGoogle = async (req, res) => {
  try {
    const { email, users } = req.body;
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email are required",
      });
    }
    let user = await Auth.findOne({ email });

    if (!user) {
      function generatePassword(firstName) {
        const randomNumber = Math.floor(100 + Math.random() * 900);
        return `${firstName}@${randomNumber}`;
      }
      const generatedPassword = generatePassword(
        users.displayName?.split(" ")[0] || "User"
      );
      const hashPassword = await hash(generatedPassword, 10);

      user = await Auth.create({
        first_Name: users.displayName?.split(" ")[0] || "First",
        last_Name: users.displayName?.split(" ")[1] || "Last",
        email: email,
        // birth_Date: users.birthDate || null,
        // gender: users.gender || "other",
        phoneNumber: users.phoneNumber || null,
        address: users.address || "N/A",
        // role: "user",
        password: hashPassword,
        profilePhoto: { url: users.photoURL || null },
      });

      await senData(
        user.email,
        "Google login password",
        loginUi(user.email, generatedPassword)
      );
    }

    const token = generateToeken(user._id, res);
    return res.status(200).json({
      success: true,
      message: "Logged in successfully",
      user: {
        ...user._doc,
        password: "",
      },
      token,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "An error occurred during login",
    });
  }
};

exports.logout = async (req, res) => {
  try {
    res.clearCookie("interview_ai", {
      path: "/",
      httpOnly: true,
      sameSite: "Strict",
      secure: process.env.NODE_ENV !== "development",
    });

    return res
      .status(200)
      .json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

exports.SendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Please, enter an email address!",
      });
    }

    const otp = otpGnerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

    const currentTime = new Date();

    const account = await Auth.findOne({ email });
    if (!account) {
      return res.status(404).json({
        success: false,
        message: "Email is not registered!",
      });
    }

    if (account.otpExpiration && account.otpExpiration > currentTime) {
      const remainingTime = Math.ceil(
        (account.otpExpiration - currentTime) / 1000
      );
    }

    account.otp = otp;
    account.otpExpiration = new Date(
      currentTime.getTime() + OTP_EXPIRATION_TIME
    );
    await account.save();

    await senData(
      account.email,
      "foget your password",
      ForgotFormat(account.email, otp)
    );

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully to your email!",
    });
  } catch (error) {
    console.error("Error sending OTP:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

exports.SendEmailCode = async (req, res) => {
  try {
    const { email } = req.body;
    const existingUserByEmail = await Auth.findOne({ email });
    if (existingUserByEmail) {
      return res.status(400).json({
        success: false,
        message: "Email Already Exists",
      });
    }
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Please, enter an email address!",
      });
    }

    const otp = otpGnerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

    otpStore[email] = { otp, expiresAt: Date.now() + 3 * 60 * 1000 };

    await senData(
      email,
      "Verify your Account",
      `<h1>
           ${email} 
       </h1>
       <h2>
           ${otp} 
       </h2>`
    );

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully to your email!",
    });
  } catch (error) {
    console.error("Error sending OTP:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

exports.verifyEmailCode = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email/Phone and OTP are required",
      });
    }

    const storedOtpInfo = otpStore[email];
    if (!storedOtpInfo || storedOtpInfo.expiresAt < Date.now()) {
      return res.status(400).json({ message: "OTP expired or not found" });
    }
    if (otp === storedOtpInfo.otp) {
      delete otpStore[email];
      return res.status(200).json({ message: "OTP verified successfully!" });
    } else {
      return res.status(401).json({ message: "Invalid OTP" });
    }

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email/Phone and OTP are required",
      });
    }

    let account;

    account = await Auth.findOne({ email: email });

    if (!account) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (account.otp != otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    return res.status(200).json({
      success: true,
      message: "OTP verified successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
//reset password
exports.ResetPassword = async (req, res) => {
  try {
    const { email, new_pass, confirm_pass } = req.body;

    if (new_pass.length < 6 || confirm_pass.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long",
      });
    }

    if (new_pass !== confirm_pass) {
      return res.status(400).json({
        success: false,
        message: "Password and confirm password do not match",
      });
    }

    const account = await Auth.findOne({ email });

    if (!account) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const hashedPassword = await hash(new_pass);

    account.password = hashedPassword;
    await account.save();

    return res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const userId = req.user._id;
    const { oldPassword, newPassword, confirmPassword } = req.body;

    if (!oldPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "New password must be at least 6 characters",
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "New passwords do not match",
      });
    }

    const user = await Auth.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Incorrect current password",
      });
    }

    const hashedPassword = await hash(newPassword);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
exports.getProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await Auth.findById(userId).select(
      "-password -otp -otpExpiration"
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const { first_Name, last_Name, birth_Date, gender, email } = req.body;

    if (email) {
      const existingUser = await Auth.findOne({ email, _id: { $ne: userId } });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "Email already exists",
        });
      }
    }

    let updateData = {
      first_Name,
      last_Name,
      birth_Date,
      gender,
      email,
    };

    if (req.file) {
      const ext = path.extname(req.file.originalname);
      const filename = `profile-${userId}-${Date.now()}${ext}`;
      const filePath = path.join(PROFILE_DIR, filename);

      // Move the file to the upload directory
      await fs.promises.rename(req.file.path, filePath);

      // Store as object to match schema
      updateData.profilePhoto = {
        public_id: filename,
        url: `profiles/${filename}`
      };

      // Optional: Delete old photo
      const user = await Auth.findById(userId);
      if (user.profilePhoto && user.profilePhoto.url) {
        const oldPhotoPath = user.profilePhoto.url.replace('profiles/', '');
        const oldFilePath = path.join(PROFILE_DIR, oldPhotoPath);
        if (fs.existsSync(oldFilePath)) {
          fs.unlinkSync(oldFilePath);
        }
      }
    }

    const updatedUser = await Auth.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select("-password -otp -otpExpiration");

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

exports.deleteProfilePhoto = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await Auth.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Delete photo from local storage if exists
    if (user.profilePhoto && user.profilePhoto.url) {
      const photoPath = user.profilePhoto.url.replace('profiles/', '');
      const filePath = path.join(PROFILE_DIR, photoPath);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    user.profilePhoto = undefined;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile photo deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
//get all user
exports.getAllUser = async (req, res) => {
  try {
    const { search, role: filterRole, status } = req.query;
    const query = {};

    if (filterRole) {
      query.role = filterRole;
    } else {
      query.role = "user";
    }

    if (status === "blocked") query.isBlocked = true;
    else if (status === "active") query.isBlocked = false;

    if (search) {
      query.$or = [
        { first_Name: { $regex: search, $options: "i" } },
        { last_Name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const users = await Auth.find(query).select("-password -otp -otpExpiration").sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: users,
      count: users.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Admin: Get user by ID with analytics
exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await Auth.findById(id).select("-password -otp -otpExpiration");

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const [enrollments, exams] = await Promise.all([
      Enroll.find({ user: id })
        .populate("course", "title courseType")
        .populate("courseOverview", "title")
        .populate("role", "roleName"),
      Exam.find({ user: id })
        .populate("course", "title")
        .sort({ createdAt: -1 })
        .limit(10),
    ]);

    const totalEnrolled = enrollments.length;
    const completedCourses = enrollments.filter(e => e.theoryExamStatus === "completed").length;
    const pendingCourses = totalEnrolled - completedCourses;
    const passedExams = exams.filter(e => e.result === "Pass").length;
    const avgScore = exams.length
      ? Math.round(exams.reduce((sum, e) => sum + (parseFloat(e.Score) || 0), 0) / exams.length)
      : 0;

    res.status(200).json({
      success: true,
      data: {
        user,
        analytics: {
          totalEnrolled,
          completedCourses,
          pendingCourses,
          totalExams: exams.length,
          passedExams,
          failedExams: exams.length - passedExams,
          avgScore,
          loginCount: user.loginCount || 0,
          lastLogin: user.lastLogin,
        },
        enrollments,
        recentExams: exams,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Admin: Block or unblock user
exports.toggleBlockUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await Auth.findById(id);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    user.isBlocked = !user.isBlocked;
    await user.save();

    res.status(200).json({
      success: true,
      message: user.isBlocked ? "User blocked successfully" : "User unblocked successfully",
      isBlocked: user.isBlocked,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Admin: Delete user
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await Auth.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Admin: Get dashboard stats
exports.getAdminStats = async (req, res) => {
  try {
    const [totalUsers, blockedUsers, totalExams, passedExams] = await Promise.all([
      Auth.countDocuments({ role: "user" }),
      Auth.countDocuments({ role: "user", isBlocked: true }),
      Exam.countDocuments(),
      Exam.countDocuments({ result: "Pass" }),
    ]);

    const recentUsers = await Auth.find({ role: "user" })
      .select("-password -otp -otpExpiration")
      .sort({ createdAt: -1 })
      .limit(5);

    const topStudents = await Exam.aggregate([
      { $match: { result: "Pass" } },
      { $group: { _id: "$user", avgScore: { $avg: { $toDouble: "$Score" } }, examCount: { $sum: 1 } } },
      { $sort: { avgScore: -1 } },
      { $limit: 5 },
      { $lookup: { from: "auths", localField: "_id", foreignField: "_id", as: "userInfo" } },
      { $unwind: "$userInfo" },
      { $project: { avgScore: 1, examCount: 1, "userInfo.first_Name": 1, "userInfo.last_Name": 1, "userInfo.email": 1, "userInfo.profilePhoto": 1 } },
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        activeUsers: totalUsers - blockedUsers,
        blockedUsers,
        totalExams,
        passedExams,
        failedExams: totalExams - passedExams,
        recentUsers,
        topStudents,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
