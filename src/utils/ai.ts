import { GoogleGenerativeAI } from '@google/generative-ai';
import { UserInput, ReportData } from '../types/user';

// Initialize Google Gemini API
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

// Prompt templates for report generation
const FREE_REPORT_PROMPT = (input: UserInput) => `
Generate a 200-300 word life report for ${input.name}, aged ${input.ageRange}, whose biggest goal is ${input.biggestGoal}. Their personality is described as "${input.personalityWord}", current mood is "${input.currentMood}", and they face the challenge: "${input.challenge || 'None'}". They focus on ${input.areaOfFocus.join(', ')}, have a ${input.riskComfortLevel} risk comfort level, dream of ${input.dreamDestination}, and believe in ${input.fateVsPath}. Provide an engaging overview with 1-2 actionable suggestions and a teaser for a premium report.
`;

const PREMIUM_REPORT_PROMPT = (input: UserInput) => `
Generate a 1,000+ word life report for ${input.name}, aged ${input.ageRange}, whose biggest goal is ${input.biggestGoal}. Their personality is "${input.personalityWord}", current mood is "${input.currentMood}", and they face the challenge: "${input.challenge || 'None'}". They focus on ${input.areaOfFocus.join(', ')}, have a ${input.riskComfortLevel} risk comfort level, dream of ${input.dreamDestination}, and believe in ${input.fateVsPath}. Structure the report with sections: Introduction, Life Path Overview, Strengths and Opportunities, Action Plan, Overcoming Challenges, Aspirational Vision, Conclusion.
`;

// Generate report using Google Gemini API or fallback
export async function generateReport(input: UserInput, isPremium: boolean): Promise<ReportData> {
  const reportId = input.name + Date.now().toString();
  try {
    const prompt = isPremium ? PREMIUM_REPORT_PROMPT(input) : FREE_REPORT_PROMPT(input);
    const result = await model.generateContent(prompt);
    const content = result.response.text();

    return {
      reportId,
      input,
      isPremium,
      ...(isPremium
        ? {
            sections: {
              introduction: content.slice(0, 200),
              lifePath: content.slice(200, 400),
              strengths: content.slice(400, 600),
              actionPlan: content.slice(600, 800),
              challenges: content.slice(800, 1000),
              aspirationalVision: content.slice(1000, 1200),
              conclusion: content.slice(1200, 1400),
            },
          }
        : { content: content.slice(0, 300) }),
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
        : { content: fallbackContent.slice(0, 250) }),
    };
  }
}