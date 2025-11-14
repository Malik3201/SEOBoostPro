import OpenAI from "openai";

// Initialize OpenAI client with Grok AI endpoint
const client = new OpenAI({
  apiKey: process.env.LLM_API_KEY || process.env.GROK_API_KEY,
  baseURL: process.env.LLM_ENDPOINT || process.env.GROK_ENDPOINT || "https://api.x.ai/v1",
});

export async function generateSuggestions(report) {
  try {
    // Extract key information for suggestions
    const url = report.url || "the website";
    const performanceScore = report.pageSpeed?.mobile?.performanceScore || report.pageSpeed?.desktop?.performanceScore || "N/A";
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

    const response = await client.chat.completions.create({
      model: process.env.GROK_MODEL || "grok-beta",
      messages: [
        {
          role: "system",
          content: "You are an expert SEO consultant. Provide clear, actionable SEO improvement suggestions.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      max_tokens: 500,
      temperature: 0.7,
    });

    // Extract the response text
    const responseText = response.choices?.[0]?.message?.content || "";

    if (!responseText) {
      console.warn("Empty response from AI service");
      return [];
    }

    // Parse suggestions - split by lines and filter
    let suggestions = responseText
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => {
        // Keep lines that look like suggestions (start with number, bullet, or dash)
        return (
          line.length > 10 &&
          (line.match(/^\d+\./) || line.match(/^[-•*]/) || line.length > 20)
        );
      })
      .map((line) => {
        // Remove numbering/bullets if present
        return line.replace(/^\d+\.\s*/, "").replace(/^[-•*]\s*/, "").trim();
      })
      .filter((line) => line.length > 0);

    // If we got suggestions, return them (limit to 5)
    if (suggestions.length > 0) {
      return suggestions.slice(0, 5);
    }

    // Fallback: try to extract any meaningful text
    const fallbackSuggestions = responseText
      .split(/\n+/)
      .map((line) => line.trim())
      .filter((line) => line.length > 15 && line.length < 200)
      .slice(0, 5);

    return fallbackSuggestions.length > 0 ? fallbackSuggestions : [];
  } catch (err) {
    console.error("generateSuggestions error:", err);
    console.error("Error details:", {
      message: err.message,
      status: err.status,
      response: err.response?.data,
    });
    // Return empty array instead of throwing to not break the audit
    return [];
  }
}
