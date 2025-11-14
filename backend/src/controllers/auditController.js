import Report from "../models/Report.js";
import { runPageSpeed } from "../services/pagespeedService.js";
import { scrapeMeta } from "../services/scrapeService.js";
import { generateSuggestions } from "../services/aiService.js";

const computePerformanceScore = (pageSpeedResult = {}) => {
  const scores = [
    pageSpeedResult?.mobile?.performanceScore,
    pageSpeedResult?.desktop?.performanceScore,
  ].filter((score) => typeof score === "number");

  if (!scores.length) return 0;

  const average = scores.reduce((sum, score) => sum + score, 0) / scores.length;
  return Math.round(average);
};

const computeMetaScore = (metaResult = {}) => {
  const checks = [
    Boolean(metaResult?.title),
    Boolean(metaResult?.metaDescription),
    Boolean(metaResult?.firstH1),
    Boolean(metaResult?.canonicalLinks?.length),
    typeof metaResult?.imagesMissingAlt === "number"
      ? metaResult.imagesMissingAlt === 0
      : false,
  ];

  const fulfilled = checks.filter(Boolean).length;
  return Math.round((fulfilled / checks.length) * 100);
};

export async function handleAudit(req, res) {
  const { url } = req.body;

  if (!url) return res.status(400).json({ message: "URL is required" });

  try {
    // Run PageSpeed + scrape concurrently
    const [pageSpeedResult, metaResult] = await Promise.all([
      runPageSpeed(url),
      scrapeMeta(url),
    ]);

    // Combine results
    const combined = { url, pageSpeed: pageSpeedResult, meta: metaResult };

    // Default empty suggestions
    let suggestions = [];

    // Try LLM suggestions, but don't fail the audit if it errors
    try {
      suggestions = await generateSuggestions(combined);
    } catch (llmErr) {
      console.error("LLM suggestions failed:", llmErr);
      suggestions = []; // return empty
    }

    // Compute overall score (60% performance, 40% meta completeness)
    const performanceScore = computePerformanceScore(pageSpeedResult);
    const metaScore = computeMetaScore(metaResult);
    const score = Math.round(0.6 * performanceScore + 0.4 * metaScore);

    // Save to MongoDB
    const report = new Report({
      url,
      createdAt: new Date(),
      pageSpeed: pageSpeedResult,
      meta: metaResult,
      suggestions,
      score,
      status: "done",
    });

    const savedReport = await report.save();

    res.json(savedReport);
  } catch (err) {
    console.error("handleAudit error:", err);
    res.status(500).json({ message: "Audit failed", error: err.message });
  }
}
