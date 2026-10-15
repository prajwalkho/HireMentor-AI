const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();
const {
  generateAIContent,
  getGeminiRuntimeInfo,
  getGeminiErrorInfo,
} = require("./src/utils/geminiService");
const { connectDB } = require("./src/config/db");

console.info("Gemini runtime configuration", getGeminiRuntimeInfo());

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  "/profiles",
  express.static(path.join(process.cwd(), "uploads", "profiles"))
);

app.use(
  "/candidates",
  express.static(path.join(__dirname, "uploads/candidates"))
);

app.use(cookieParser());

const port = process.env.PORT || 5000;

const allowedOrigins = (process.env.CLIENT_URL || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const corsOptions = {
  origin(origin, callback) {
    const localDevelopmentOrigin =
      process.env.NODE_ENV !== "production" &&
      (origin === "http://localhost:5173" || origin === "http://localhost:4173");

    callback(null, !origin || allowedOrigins.includes(origin) || localDevelopmentOrigin);
  },
  credentials: true,
};

app.use(cors(corsOptions));

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

const databaseIndependentPaths = new Set([
  "/api/v1/ai/chat",
  "/api/generate-interview",
]);

app.use(async (req, res, next) => {
  if (databaseIndependentPaths.has(req.path.replace(/\/+$/, ""))) {
    return next();
  }

  try {
    await connectDB();
    next();
  } catch {
    console.error("MongoDB is unavailable; request could not be served.");
    res.status(503).json({
      success: false,
      message: "The database is temporarily unavailable. Please try again later.",
    });
  }
});

// ======================================================
// ROUTES
// ======================================================

const authRoute = require("./src/routes/authroutes");
const examRoute = require("./src/routes/examRoute");
const skillroute = require("./src/routes/skillRoute");
const roleRoutes = require("./src/routes/roleroutes");
const courseRoutes = require("./src/routes/courseRoutes");
const courseInfoRoutes = require("./src/routes/courseInfoRoutes");
const enrollRoutes = require("./src/routes/enrollroute");
const recruiterRoutes = require("./src/routes/recruiterRoutes");
const candidateInfo = require("./src/routes/candidateInformationcontrollerroute");
const Interview    = require("./src/routes/interviewroute");
const certRoute    = require("./src/routes/certificateRoute");

app.use("/api/v1/auth", authRoute);
app.use("/api/v2/exam", examRoute);
app.use("/api/v2/certificates", certRoute);
app.use("/api/v2/skill", skillroute);
app.use("/api/roles", roleRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/course-info", courseInfoRoutes);
app.use("/api/v2/enroll", enrollRoutes);
app.use("/api/recruiters", recruiterRoutes);
app.use("/api/v2/candidate", candidateInfo);
app.use("/api/v2/interview", Interview);

// ======================================================
// JUDGE0 CODE EXECUTION
// ======================================================

app.post("/api/v1/run-code", async (req, res) => {
  try {
    const { language_id, source_code } = req.body;

    const response = await axios.post(
      "https://ce.judge0.com/submissions?base64_encoded=false&wait=true",
      {
        source_code,
        language_id,
        stdin: "",
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error(
      "Judge0 Error:",
      error?.response?.data || error.message
    );

    res.status(500).json({
      error: "Code execution failed",
    });
  }
});

// ======================================================
// INTERVIEW QUESTION GENERATOR
// ======================================================

app.post("/api/generate-interview", async (req, res) => {
  try {
    const { jobPosition, jobDesc, jobExperience } = req.body;

    const prompt = `
Generate exactly 10 interview questions and answers in JSON array format.

Example:
[
  {
    "question":"What is Node.js?",
    "answer":"Node.js is a JavaScript runtime."
  }
]

Job Position: ${jobPosition}
Job Description: ${jobDesc}
Experience: ${jobExperience}

Return ONLY valid JSON.
`;

    const result = await generateAIContent(prompt);

    const response = await result.response;

    let text = response.text();

    // Remove markdown formatting
    text = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const parsed = JSON.parse(text);

    res.json({
      success: true,
      data: parsed,
    });
  } catch (error) {
    const errorInfo = getGeminiErrorInfo(error);
    console.error(
      `Gemini interview generation failed (${error?.name || "unknown error"}).`
    );

    res.status(errorInfo.status).json({
      success: false,
      error: errorInfo.message,
      ...(errorInfo.code ? { code: errorInfo.code } : {}),
    });
  }
});

// ======================================================
// AI CHAT API
// ======================================================

app.post("/api/v1/ai/chat", async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({
        error: "Prompt is required",
      });
    }

    const result = await generateAIContent(prompt);

    const response = await result.response;

    const aiResponse =
      response.text() || "No response generated";

    res.json({
      success: true,
      data: aiResponse,
    });
  } catch (error) {
    const errorInfo = getGeminiErrorInfo(error);
    console.error(
      `Gemini chat request failed (${error?.name || "unknown error"}).`
    );

    res.status(errorInfo.status).json({
      success: false,
      error: errorInfo.message,
      ...(errorInfo.code ? { code: errorInfo.code } : {}),
    });
  }
});

// ======================================================

if (require.main === module) {
  app.listen(port, () => {
    console.log(`✅ Server running on port ${port}`);
  });
}

module.exports = app;