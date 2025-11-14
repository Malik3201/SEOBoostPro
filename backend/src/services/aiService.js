import OpenAI from "openai";

// Initialize Groq client
const client = new OpenAI({
  apiKey: process.env.LLM_API_KEY,
  baseURL: process.env.LLM_ENDPOINT,
});

export async function generateSuggestions(report) {
  try {
    // Create a response using Groq API
    const response = await client.responses.create({
      model: "openai/gpt-oss-20b",
      input: `Generate 5 SEO suggestions for the following data:\n${JSON.stringify(
        report,
        null,
        2
      )}`,
      // Optional parameters
      max_output_tokens: 300,
    });

    // Groq response text
    const outputText = response.output_text || "";

    // Split suggestions by line
    const suggestions = outputText.split("\n").filter((line) => line.trim());

    return suggestions;
  } catch (err) {
    console.error("generateSuggestions error:", err);
    throw new Error("Failed to generate SEO suggestions with Groq API");
  }
}
