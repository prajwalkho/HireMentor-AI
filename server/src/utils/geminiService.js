const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const PRIMARY_MODEL = "gemini-3.8-flash";
const FALLBACK_MODEL = "gemini-3.6-flash";

const getErrorStatus = (error) =>
  Number(error?.status || error?.response?.status || error?.response?.data?.error?.code) || 0;

const getErrorMessage = (error) =>
  [
    error?.message,
    error?.status,
    error?.statusText,
    error?.response?.data?.error?.status,
    error?.response?.data?.error?.message,
  ]
    .filter(Boolean)
    .join(" ");

const redactApiKeys = (message, apiKeys) =>
  apiKeys
    .reduce((safeMessage, apiKey) => safeMessage.replaceAll(apiKey, "[REDACTED]"), message)
    .replace(/([?&]key=)[^&\s]+/gi, "$1[REDACTED]");

const isQuotaError = (error) =>
  getErrorStatus(error) === 429 ||
  /RESOURCE_EXHAUSTED|quota exceeded|rate[- ]limit/i.test(getErrorMessage(error));

const isInvalidKeyError = (error) => {
  const status = getErrorStatus(error);
  const message = getErrorMessage(error);
  const identifiesInvalidKey =
    /API_KEY_INVALID|(?:invalid|revoked|leaked|compromised|unauthorized).{0,30}api key|api key.{0,30}(?:invalid|revoked|leaked|compromised|unauthorized|not valid)|key.{0,20}(?:revoked|leaked|compromised)/i.test(
      message
    );

  return status === 401 || /UNAUTHENTICATED/i.test(message) || identifiesInvalidKey;
};

class GeminiServiceError extends Error {
  constructor(message, code) {
    super(message);
    this.name = "GeminiServiceError";
    this.code = code;
    this.status = 503;
  }
}

const parseApiKeys = (...configuredValues) =>
  [
    ...new Set(
      configuredValues
        .flatMap((value) => (value || "").split(/[,\r\n]+/))
        .map((key) => key.trim())
        .filter(Boolean)
    ),
  ];

const getConfiguredKeys = () =>
  parseApiKeys(process.env.GEMINI_API_KEYS, process.env.GEMINI_API_KEY);

const createGeminiService = ({
  apiKeys = getConfiguredKeys(),
  clientFactory = (apiKey) => new GoogleGenerativeAI(apiKey),
  logger = console,
} = {}) => {
  const keys = [...new Set(apiKeys.map((key) => key.trim()).filter(Boolean))];
  const disabledKeys = new Set();
  const clients = new Map();
  let nextKeyIndex = 0;

  const getClient = (keyIndex) => {
    if (!clients.has(keyIndex)) {
      clients.set(keyIndex, clientFactory(keys[keyIndex]));
    }
    return clients.get(keyIndex);
  };

  const generateContent = async (prompt, modelName = PRIMARY_MODEL) => {
    if (keys.length === 0) {
      throw new GeminiServiceError(
        "Gemini API keys are not configured on the server.",
        "GEMINI_KEYS_NOT_CONFIGURED"
      );
    }

    const activeKeyCount = keys.length - disabledKeys.size;
    if (activeKeyCount === 0) {
      throw new GeminiServiceError(
        "No valid Gemini API keys are available. Check the server configuration.",
        "GEMINI_KEYS_UNAVAILABLE"
      );
    }

    let quotaFailureCount = 0;
    const startKeyIndex = nextKeyIndex;

    for (let offset = 0; offset < keys.length; offset += 1) {
      const keyIndex = (startKeyIndex + offset) % keys.length;
      if (disabledKeys.has(keyIndex)) continue;

      try {
        const model = getClient(keyIndex).getGenerativeModel({ model: modelName });
        const result = await model.generateContent(prompt);
        nextKeyIndex = keyIndex;
        return result;
      } catch (error) {
        if (isQuotaError(error)) {
          quotaFailureCount += 1;
          nextKeyIndex = (keyIndex + 1) % keys.length;
          logger.warn(
            `Gemini key slot ${keyIndex + 1} is rate-limited or out of quota; trying the next configured key.`
          );
          continue;
        }

        if (isInvalidKeyError(error)) {
          disabledKeys.add(keyIndex);
          nextKeyIndex = (keyIndex + 1) % keys.length;
          logger.warn(
            `Gemini key slot ${keyIndex + 1} was rejected and has been disabled for this process; trying the next configured key.`
          );
          continue;
        }

        const diagnosticMessage = getErrorMessage(error);
        logger.error?.("Gemini request failed.", {
          model: modelName,
          keySlot: keyIndex + 1,
          status: getErrorStatus(error) || undefined,
          code: error?.response?.data?.error?.status || error?.code || undefined,
          message: redactApiKeys(diagnosticMessage, keys).slice(0, 500),
        });
        throw error;
      }
    }

    if (quotaFailureCount > 0) {
      throw new GeminiServiceError(
        "All configured Gemini API keys are currently rate-limited or out of quota. Retry after the quota resets.",
        "GEMINI_QUOTA_EXHAUSTED"
      );
    }

    throw new GeminiServiceError(
      "No valid Gemini API keys are available. Check the server configuration.",
      "GEMINI_KEYS_UNAVAILABLE"
    );
  };

  const generateAIContent = async (prompt) => {
    try {
      return await generateContent(prompt, PRIMARY_MODEL);
    } catch (error) {
      if (getErrorStatus(error) !== 503 || error.code) {
        throw error;
      }

      logger.warn(
        `Gemini ${PRIMARY_MODEL} is temporarily unavailable; retrying with ${FALLBACK_MODEL}.`
      );
      return generateContent(prompt, FALLBACK_MODEL);
    }
  };

  return {
    generateContent,
    generateAIContent,
    getConfigurationInfo: () => ({
      configuredKeyCount: keys.length,
      disabledKeyCount: disabledKeys.size,
      primaryModel: PRIMARY_MODEL,
      fallbackModel: FALLBACK_MODEL,
    }),
  };
};

const geminiService = createGeminiService();

const getGeminiErrorInfo = (error) => {
  if (error instanceof GeminiServiceError) {
    return { status: error.status, code: error.code, message: error.message };
  }

  return {
    status: 500,
    message: "The AI service could not complete the request. Please try again later.",
  };
};

module.exports = {
  createGeminiService,
  generateAIContent: geminiService.generateAIContent,
  getGeminiRuntimeInfo: geminiService.getConfigurationInfo,
  getGeminiErrorInfo,
  parseApiKeys,
};
