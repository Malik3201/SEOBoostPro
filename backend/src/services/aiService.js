import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.LLM_API_KEY,
  baseURL: process.env.LLM_ENDPOINT,
});

export async function generateSuggestions(report) {
  try {
    const response = await client.responses.create({
      model: "openai/gpt-oss-20b",
      input: `Generate 5 SEO suggestions for the following data:\n${JSON.stringify(
        report,
        null,
        2
      )}`,
      max_output_tokens: 300,
    });

    // Extract text from output array
    let outputText = "";
    for (const item of response.output || []) {
      if (item.type === "message") {
        for (const content of item.content || []) {
          if (content.type === "output_text" && content.text) {
            outputText += content.text + "\n";
          }
        }
      }
    }

    // Split by lines and filter empty ones
    const suggestions = outputText.split("\n").filter((line) => line.trim());

    return suggestions;
  } catch (err) {
    console.error("generateSuggestions error:", err);
    throw new Error("Failed to generate SEO suggestions with Groq API");
  }
}
