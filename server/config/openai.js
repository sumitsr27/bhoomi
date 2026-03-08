const OpenAI = require("openai");

let openai = null;

if (process.env.OPENAI_API_KEY) {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
  console.log("OpenAI enabled");
} else {
  console.log("OpenAI disabled (no API key)");
}

module.exports = openai;