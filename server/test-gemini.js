const axios = require('axios');
require("dotenv").config();

async function test() {
  const key = process.env.GEMINI_API_KEY;
  console.log("Testing with key ending in:", key.slice(-4));
  
  try {
    const res = await axios.get(`https://generativelanguage.googleapis.com/v1beta/models?key=${key}`);
    console.log("✅ Models available:");
    res.data.models.forEach(m => console.log(m.name));
  } catch (e) {
    console.log("❌ Failed to list models:", e.response?.data || e.message);
  }
}

test();
