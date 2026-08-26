const { GoogleGenerativeAI } = require('@google/generative-ai');

const EXAM_DATA_SCHEMA = `{
  "name": "Full exam name",
  "slug": "url-friendly-slug",
  "categories": ["General", "OBC", "SC", "ST", "EWS"],
  "subjects": ["Subject1", "Subject2"],
  "maxScore": 100,
  "description": "One sentence about the exam",
  "history": [
    { "year": 2023, "category": "General", "closingRank": 5000, "closingScore": 85 }
  ],
  "seats": [
    { "year": 2025, "category": "General", "totalSeats": 10000, "registeredApplicants": 500000, "appearedApplicants": 450000 },
    { "year": 2026, "category": "General", "totalSeats": 10500, "registeredApplicants": 520000, "appearedApplicants": 470000 }
  ]
}`;

function parseJsonFromResponse(text) {
  const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
  return JSON.parse(cleaned);
}

async function fetchExamDataFromGemini(examName, hints = {}) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured on the server');
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: process.env.GEMINI_MODEL || 'gemini-2.0-flash',
    generationConfig: { responseMimeType: 'application/json' },
  });

  const hintLines = [];
  if (hints.description) hintLines.push(`Description hint: ${hints.description}`);
  if (hints.maxScore) hintLines.push(`Max score hint: ${hints.maxScore}`);
  if (hints.categories?.length) hintLines.push(`Categories hint: ${hints.categories.join(', ')}`);

  const prompt = `You are an expert on Indian competitive examinations and their cutoff trends.

Generate structured data for this exam: "${examName}"
${hintLines.length ? hintLines.join('\n') : ''}

Return ONLY valid JSON matching this schema (no markdown):
${EXAM_DATA_SCHEMA}

Requirements:
- Include 3-5 years of historical cutoff data (2021-2025) for each major category
- history: closingRank and closingScore per year per category (use realistic official estimates)
- seats: data for years 2025 and 2026 for each category in categories array
- slug: lowercase, hyphenated, no special characters
- subjects: list the actual paper sections/subjects for this exam
- maxScore: the actual maximum marks for this exam
- Use realistic numbers based on publicly known trends for this specific exam`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();
  const data = parseJsonFromResponse(text);

  if (!data.name || !data.categories?.length || !data.history?.length) {
    throw new Error('AI returned incomplete exam data');
  }

  return data;
}

module.exports = { fetchExamDataFromGemini };
