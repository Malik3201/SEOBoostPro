import { GoogleAuth } from "google-auth-library";
import fetch from "node-fetch";
import path from "path";

const keyFilePath = path.join(
  process.cwd(),
  "backend/keys/seoboostpro-797255167c1b.json"
); // adjust path

async function getAccessToken() {
  try {
    const auth = new GoogleAuth({
      keyFile: keyFilePath,
      scopes: ["https://www.googleapis.com/auth/ai.generativelanguage"],
    });

    const client = await auth.getClient();
    const token = await client.getAccessToken();
    if (!token || !token.token) throw new Error("No access token returned");
    return token.token;
  } catch (err) {
    console.error("getAccessToken error:", err);
    throw new Error("Authentication failed for LLM service");
  }
}

export async function generateSuggestions(report) {
  try {
    const accessToken = await getAccessToken();

    const response = await fetch(process.env.LLM_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        // Gemini request body
        prompt: `Generate 5 SEO suggestions for the following data:\n${JSON.stringify(
          report,
          null,
          2
        )}`,
        maxOutputTokens: 300,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("LLM request failed:", errText);
      throw new Error("LLM request failed");
    }

    const data = await response.json();
    // Adjust based on Gemini output structure
    const suggestions = data.candidates?.[0]?.content?.split("\n") || [];
    return suggestions;
  } catch (err) {
    console.error("generateSuggestions error:", err);
    throw new Error("Failed to generate SEO suggestions");
  }
}
