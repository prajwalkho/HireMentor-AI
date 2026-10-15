const assert = require("node:assert/strict");
const { after, before, test } = require("node:test");

process.env.DATABASE_URL = "";
process.env.GEMINI_API_KEYS = "";
process.env.GEMINI_API_KEY = "";
process.env.NODE_ENV = "production";

const app = require("../server");

let server;
let baseUrl;

before(async () => {
  server = app.listen(0);
  await new Promise((resolve) => server.once("listening", resolve));
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

after(async () => {
  if (server) {
    await new Promise((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve()));
    });
  }
});

test("Gemini chat reaches Gemini configuration handling without MongoDB", async () => {
  const response = await fetch(`${baseUrl}/api/v1/ai/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt: "test" }),
  });
  const body = await response.json();

  assert.equal(response.status, 503);
  assert.equal(body.code, "GEMINI_KEYS_NOT_CONFIGURED");
});

test("interview generation reaches Gemini configuration handling without MongoDB", async () => {
  const response = await fetch(`${baseUrl}/api/generate-interview`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ jobPosition: "test" }),
  });
  const body = await response.json();

  assert.equal(response.status, 503);
  assert.equal(body.code, "GEMINI_KEYS_NOT_CONFIGURED");
});

test("database-backed API requests still require MongoDB", async () => {
  const response = await fetch(`${baseUrl}/api/v2/exam/exams`);
  const body = await response.json();

  assert.equal(response.status, 503);
  assert.match(body.message, /database is temporarily unavailable/i);
});
