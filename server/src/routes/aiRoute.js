const express = require("express");
const router = express.Router();
const { chatWithGemini } = require("../controller/aiController");

// Define the chat endpoint
router.post("/chat", chatWithGemini);

module.exports = router;
