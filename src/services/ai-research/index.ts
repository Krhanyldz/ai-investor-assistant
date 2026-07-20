import { personalizedAdviceRefusal, type ResearchAnalysisResult, type ResearchContext } from "@/domain/ai-research";
import { generateOpenAIResearch } from "@/services/ai-research/openai";

const advicePattern = /\b(should i|do you recommend|buy|sell|hold|allocate|allocation|leverage|position size|portfolio percentage)\b/i;

export function isPersonalizedAdviceRequest(question?: string) {
  return Boolean(question && advicePattern.test(question));
}

export async function generateResearchAnalysis(context: ResearchContext): Promise<ResearchAnalysisResult> {
  if (isPersonalizedAdviceRequest(context.question)) {
    return { ok: false, code: "refused", message: personalizedAdviceRefusal };
  }
  return generateOpenAIResearch(context);
}
