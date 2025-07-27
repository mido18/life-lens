import { GoogleGenerativeAI } from '@google/generative-ai';
import { UserInput, ReportData } from '../types/user';

// Initialize Google Gemini API
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

// Prompt templates for report generation
const FREE_REPORT_PROMPT = (input: UserInput) => `
Generate a 200-300 word life report for ${input.name}, aged ${input.ageRange}, whose biggest goal is ${input.biggestGoal}. Their personality is described as "${input.personalityWord}", current mood is "${input.currentMood}", and they face the challenge: "${input.challenge || 'None'}". They focus on ${input.areaOfFocus.join(', ')}, have a ${input.riskComfortLevel} risk comfort level, dream of ${input.dreamDestination}, and believe in ${input.fateVsPath}. Provide an engaging overview with 1-2 actionable suggestions and a teaser for a premium report.
`;

const PREMIUM_REPORT_PROMPT = (input: UserInput) => `
You are an insightful life-coach AI.

Return ONLY valid JSON (no markdown, no code fences) that follows this exact schema:
{
  "introduction": string,
  "lifePath": string,
  "strengths": string,
  "actionPlan": string,
  "challenges": string,
  "aspirationalVision": string,
  "conclusion": string
}

Each field must contain one or more paragraphs. The entire output should be roughly 1,000+ words in total.

Generate the JSON for ${input.name}, aged ${input.ageRange}, whose biggest goal is ${input.biggestGoal}. Personality: "${input.personalityWord}". Current mood: "${input.currentMood}". Challenge: "${input.challenge || 'None'}". Areas of focus: ${input.areaOfFocus.join(', ')}. Risk comfort: ${input.riskComfortLevel}. Dream destination: ${input.dreamDestination}. Belief about fate vs path: ${input.fateVsPath}.
`;

// Generate report using Google Gemini API or fallback
export async function generateReport(input: UserInput, isPremium: boolean): Promise<ReportData> {
  const reportId = input.name + Date.now().toString();
  try {
    const prompt = isPremium ? PREMIUM_REPORT_PROMPT(input) : FREE_REPORT_PROMPT(input);
    const result = await model.generateContent(prompt);
    const raw = result.response.text().trim();

    // Attempt to parse structured JSON for premium reports
    type Sections = NonNullable<ReportData['sections']>;
    let premiumSections: Partial<Sections> | null = null;
    if (isPremium) {
      try {
        premiumSections = JSON.parse(raw);
      } catch (e) {
        console.warn('Failed to parse JSON from Gemini, falling back to entire text');
      }
    }

    const content = raw;

    return {
      reportId,
      input,
      isPremium,
      ...(isPremium
        ? {
            sections: (() => {
              const defaultSections: Sections = {
                introduction: content,
                lifePath: content,
                strengths: content,
                actionPlan: content,
                challenges: content,
                aspirationalVision: content,
                conclusion: content,
              };
              return premiumSections ? { ...defaultSections, ...premiumSections } : defaultSections;
            })(),
          }
        : { content: content }),
    };
  } catch (err) {
    // Fallback rule-based generator
    const fallbackContent = `
      ${input.name}, your life path is shaped by your ${input.personalityWord} personality and ${input.currentMood} mood. 
      Focus on ${input.biggestGoal} by setting clear goals in ${input.areaOfFocus.join(', ')}. 
      ${isPremium ? 'Detailed strategies include...' : 'Consider a premium report for deeper insights.'}
    `;
    
    return {
      reportId,
      input,
      isPremium,
      ...(isPremium
        ? {
            sections: {
              introduction: fallbackContent,
              lifePath: fallbackContent,
              strengths: fallbackContent,
              actionPlan: fallbackContent,
              challenges: fallbackContent,
              aspirationalVision: fallbackContent,
              conclusion: fallbackContent,
            },
          }
        : { content: fallbackContent }),
    };
  }
}