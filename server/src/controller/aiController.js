const {
  generateAIContent,
  getGeminiErrorInfo,
} = require("../utils/geminiService");

const chatWithGemini = async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({
        success: false,
        message: "Prompt is required",
      });
    }

    const result = await generateAIContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.status(200).json({
      success: true,
      data: text,
    });
  } catch (error) {
    const errorInfo = getGeminiErrorInfo(error);
    console.error(`Gemini controller request failed (${error?.name || "unknown error"}).`);
    res.status(errorInfo.status).json({
      success: false,
      message: errorInfo.message,
      ...(errorInfo.code ? { code: errorInfo.code } : {}),
    });
  }
};

module.exports = { chatWithGemini };
