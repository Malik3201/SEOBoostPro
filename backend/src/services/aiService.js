import OpenAI from "openai";

// Initialize OpenAI client with Groq API endpoint
const client = new OpenAI({
  apiKey: process.env.LLM_API_KEY || process.env.GROQ_API_KEY,
  baseURL: process.env.LLM_ENDPOINT || "https://api.groq.com/openai/v1",
});

export async function generateSuggestions(report) {
  try {
    const url = report.url || "the website";
    const performanceScore =
      report.pageSpeed?.mobile?.performanceScore ||
      report.pageSpeed?.desktop?.performanceScore ||
      "N/A";
    const hasTitle = report.meta?.title ? "Yes" : "No";
    const hasDescription = report.meta?.metaDescription ? "Yes" : "No";
    const hasH1 = report.meta?.firstH1 ? "Yes" : "No";
    const missingAltTags = report.meta?.imagesMissingAlt || 0;
    const statusCode = report.meta?.statusCode || "N/A";

    const prompt = `You are an SEO expert. Analyze the following website data and provide 5 actionable SEO improvement suggestions. Format each suggestion as a separate line starting with a number (1., 2., 3., etc.). Be specific and practical.

Website: ${url}
Performance Score: ${performanceScore}
Has Title Tag: ${hasTitle}
Has Meta Description: ${hasDescription}
Has H1 Tag: ${hasH1}
Images Missing Alt Tags: ${missingAltTags}
HTTP Status Code: ${statusCode}

Provide 5 SEO suggestions:`;

    // Use Groq Responses API
    const response = await client.responses.create({
      model: process.env.GROQ_MODEL || "openai/gpt-oss-20b",
      input: prompt,
      max_output_tokens: 500,
      temperature: 0.7,
    });

    // Extract all output_text from response.output
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

    if (!outputText) {
      console.warn("Empty response from AI service");
      return [];
    }

    // Parse suggestions - split by lines and filter
    const suggestions = outputText
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 10)
      .map((line) => line.replace(/^\d+\.\s*/, "").trim())
      .slice(0, 5); // Limit to 5 suggestions

    return suggestions;
  } catch (err) {
    console.error("generateSuggestions error:", err);
    console.error("Error details:", {
      message: err.message,
      status: err.status,
      response: err.response?.data,
    });
    return [];
  }
}
