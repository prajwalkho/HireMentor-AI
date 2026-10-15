const assert = require("node:assert/strict");
const test = require("node:test");
const {
  createGeminiService,
  getGeminiErrorInfo,
  parseApiKeys,
} = require("./geminiService");

const createLogger = () => ({ warn() {} });

const createFakeClientFactory = (handlers, calls) => (key) => ({
  getGenerativeModel: ({ model }) => ({
    generateContent: async (prompt) => {
      calls.push({ key, model, prompt });
      const handler = handlers[key];
      return handler ? handler({ model, prompt }) : { key, model, prompt };
    },
  }),
});

test("parses and deduplicates comma- or newline-separated environment keys", () => {
  assert.deepEqual(
    parseApiKeys(" key-a,key-b\nkey-a ", "key-c"),
    ["key-a", "key-b", "key-c"]
  );
});

test("rotates to the next key after a 429 and returns its response", async () => {
  const calls = [];
  const service = createGeminiService({
    apiKeys: ["authorized-key-a", "authorized-key-b"],
    clientFactory: createFakeClientFactory(
      {
        "authorized-key-a": async () => {
          throw { status: 429 };
        },
      },
      calls
    ),
    logger: createLogger(),
  });

  const result = await service.generateContent("hello", "test-model");

  assert.equal(result.key, "authorized-key-b");
  assert.deepEqual(
    calls.map(({ key }) => key),
    ["authorized-key-a", "authorized-key-b"]
  );
});

test("disables an invalid key and does not retry it on later requests", async () => {
  const calls = [];
  const logs = [];
  const service = createGeminiService({
    apiKeys: ["invalid-key", "authorized-key"],
    clientFactory: createFakeClientFactory(
      {
        "invalid-key": async () => {
          throw { status: 400, message: "API key not valid" };
        },
      },
      calls
    ),
    logger: { warn: (message) => logs.push(message) },
  });

  await service.generateContent("first request");
  await service.generateContent("second request");

  assert.equal(calls.filter(({ key }) => key === "invalid-key").length, 1);
  assert.equal(calls.filter(({ key }) => key === "authorized-key").length, 2);
  assert.equal(logs.some((message) => /invalid-key|authorized-key/.test(message)), false);
});

test("returns a clear quota error after every available key returns 429", async () => {
  const calls = [];
  const service = createGeminiService({
    apiKeys: ["authorized-key-a", "authorized-key-b"],
    clientFactory: createFakeClientFactory(
      {
        "authorized-key-a": async () => {
          throw { status: 429 };
        },
        "authorized-key-b": async () => {
          throw { status: 429 };
        },
      },
      calls
    ),
    logger: createLogger(),
  });

  await assert.rejects(service.generateContent("hello"), (error) => {
    const info = getGeminiErrorInfo(error);
    assert.equal(info.status, 503);
    assert.equal(info.code, "GEMINI_QUOTA_EXHAUSTED");
    assert.match(info.message, /Retry after the quota resets/);
    return true;
  });
  assert.equal(calls.length, 2);
});

test("does not retry exhausted keys again using the fallback model", async () => {
  const calls = [];
  const service = createGeminiService({
    apiKeys: ["authorized-key-a", "authorized-key-b"],
    clientFactory: createFakeClientFactory(
      {
        "authorized-key-a": async () => {
          throw { status: 429 };
        },
        "authorized-key-b": async () => {
          throw { status: 429 };
        },
      },
      calls
    ),
    logger: createLogger(),
  });

  await assert.rejects(service.generateAIContent("hello"), (error) => {
    assert.equal(getGeminiErrorInfo(error).code, "GEMINI_QUOTA_EXHAUSTED");
    return true;
  });
  assert.equal(calls.length, 2);
  assert.deepEqual(
    calls.map(({ model }) => model),
    ["gemini-3.8-flash", "gemini-3.8-flash"]
  );
});

test("does not rotate keys for unrelated request errors", async () => {
  const calls = [];
  const service = createGeminiService({
    apiKeys: ["authorized-key-a", "authorized-key-b"],
    clientFactory: createFakeClientFactory(
      {
        "authorized-key-a": async () => {
          throw { status: 400, message: "Invalid prompt format" };
        },
      },
      calls
    ),
    logger: createLogger(),
  });

  await assert.rejects(service.generateContent("hello"), (error) => {
    assert.equal(error.message, "Invalid prompt format");
    return true;
  });
  assert.equal(calls.length, 1);
});

test("uses the existing fallback model on a 503 without treating it as quota rotation", async () => {
  const calls = [];
  const service = createGeminiService({
    apiKeys: ["authorized-key"],
    clientFactory: createFakeClientFactory(
      {
        "authorized-key": async ({ model, prompt }) => {
          if (model === "gemini-3.8-flash") throw { status: 503 };
          return { model, prompt };
        },
      },
      calls
    ),
    logger: createLogger(),
  });

  const result = await service.generateAIContent("hello");

  assert.equal(result.model, "gemini-3.6-flash");
  assert.deepEqual(
    calls.map(({ model }) => model),
    ["gemini-3.8-flash", "gemini-3.6-flash"]
  );
});

test("logs actionable Gemini errors without logging API keys", async () => {
  const apiKey = "authorized-secret-key";
  const logs = [];
  const service = createGeminiService({
    apiKeys: [apiKey],
    clientFactory: () => ({
      getGenerativeModel: () => ({
        generateContent: async () => {
          throw {
            status: 403,
            message: `Request failed for key ${apiKey}`,
          };
        },
      }),
    }),
    logger: {
      warn() {},
      error: (message, details) => logs.push({ message, details }),
    },
  });

  await assert.rejects(service.generateContent("hello"));

  assert.equal(logs.length, 1);
  assert.equal(logs[0].details.status, 403);
  assert.equal(logs[0].details.message.includes(apiKey), false);
  assert.match(logs[0].details.message, /\[REDACTED\]/);
});

test("reports Gemini configuration without exposing key values", () => {
  const service = createGeminiService({
    apiKeys: ["authorized-key-a", "authorized-key-b"],
    clientFactory: () => ({}),
    logger: createLogger(),
  });

  assert.deepEqual(service.getConfigurationInfo(), {
    configuredKeyCount: 2,
    disabledKeyCount: 0,
    primaryModel: "gemini-3.8-flash",
    fallbackModel: "gemini-3.6-flash",
  });
});
