import { GoogleGenAI } from "@google/genai";

// Initialize the AI client
const ai = new GoogleGenAI({
  apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY || "",
});

export interface AIResponse {
  success: boolean;
  summary?: string;
  rewrittenDescription?: string;
  keyLearningPoints?: string;
  error?: string;
}

// localStorage keys
const AI_SUMMARIES_KEY = "ai_summaries";

// Helper functions for localStorage
function getStoredSummaries(): Record<string, AIResponse> {
  if (typeof window === "undefined") return {};

  try {
    const stored = localStorage.getItem(AI_SUMMARIES_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch (error) {
    console.error("Error reading AI summaries from localStorage:", error);
    return {};
  }
}

function storeSummary(entryId: string, response: AIResponse): void {
  if (typeof window === "undefined") return;

  try {
    const summaries = getStoredSummaries();
    summaries[entryId] = response;
    localStorage.setItem(AI_SUMMARIES_KEY, JSON.stringify(summaries));
  } catch (error) {
    console.error("Error storing AI summary to localStorage:", error);
  }
}

export async function generateEventSummary(
  title: string,
  description: string,
  year: string,
  era: string
): Promise<AIResponse> {
  try {
    // Check if API key is available
    if (!process.env.NEXT_PUBLIC_GEMINI_API_KEY) {
      return {
        success: false,
        error:
          "Gemini API key not configured. Please add NEXT_PUBLIC_GEMINI_API_KEY to your environment variables.",
      };
    }

    const prompt = `Analyze this historical event and provide two outputs:

Event: ${title}
Year: ${year} ${era}
Original Description: ${description}

**OUTPUT 1: Rewritten Description (2 lines)**
Rewrite the original description in a more historically accurate and engaging way. Make it:
- Factually correct with verified historical details
- More engaging and descriptive
- Approximately 2 lines long
- Include real numbers and specific details when relevant
- Use proper historical terminology

**OUTPUT 2: Comprehensive Historical Analysis (4-6 sentences)**
Provide a detailed historical analysis including:
1. **Historical Context**: What led to this event and the broader historical circumstances
2. **Key Details**: Important dates, locations, and people involved
3. **Related Events**: Mention 2-3 significant events that happened before or after this event
4. **Historical Impact**: How this event influenced later developments, societies, or other historical events
5. **Long-term Significance**: Why this event is remembered and studied today

**CRITICAL REQUIREMENTS**:
- **Use ONLY real, factual numbers and statistics** from verified historical sources
- **Include specific dates, years, durations, distances, population numbers, casualties, economic figures, etc.**
- **Verify all information** - do not make up or estimate any numbers
- **Cite specific historical facts** rather than general statements
- **Use precise measurements** when available (e.g., "15,000 soldiers" not "thousands of soldiers")
- **Include relevant statistics** that make the narrative more engaging and factual

**IMPORTANT**: Highlight important keywords, dates, names, locations, and significant terms using HTML span tags with light green background. Use this format: <span style="background-color: #e6f8ef; padding: 2px 4px; border-radius: 3px;">keyword</span>

Examples of what to highlight:
- Important dates (years, specific dates)
- Key historical figures and names
- Significant locations and places
- Important events and battles
- Political movements and ideologies
- Cultural and social changes
- Economic terms and concepts
- **Real numbers and statistics** (casualties, population, distances, durations, etc.)

**FORMAT YOUR RESPONSE AS:**
**Rewritten Description:**
[Your 2-line rewritten description here]

**Historical Analysis:**
[Your comprehensive 4-6 sentence analysis with highlighted keywords]

Make both outputs informative, engaging, and historically accurate with verified facts and real numbers.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-exp",
      contents: prompt,
    });

    const fullResponse = response.text?.trim();

    if (!fullResponse) {
      return {
        success: false,
        error: "Failed to generate summary",
      };
    }

    // Parse the response to extract rewritten description and historical analysis
    const rewrittenDescriptionMatch = fullResponse.match(
      /\*\*Rewritten Description:\*\*\s*([\s\S]*?)(?=\*\*Historical Analysis:\*\*)/
    );
    const historicalAnalysisMatch = fullResponse.match(
      /\*\*Historical Analysis:\*\*\s*([\s\S]*?)$/
    );

    const rewrittenDescription = rewrittenDescriptionMatch
      ? rewrittenDescriptionMatch[1].trim()
      : "";
    const historicalAnalysis = historicalAnalysisMatch
      ? historicalAnalysisMatch[1].trim()
      : "";

    return {
      success: true,
      summary: historicalAnalysis,
      rewrittenDescription: rewrittenDescription,
    };
  } catch (error) {
    console.error("AI Service Error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

// Cache for storing generated summaries (in-memory)
const summaryCache = new Map<string, AIResponse>();

export async function getCachedOrGenerateSummary(
  entryId: string,
  title: string,
  description: string,
  year: string,
  era: string
): Promise<AIResponse> {
  // First check localStorage
  const storedSummaries = getStoredSummaries();
  if (storedSummaries[entryId]) {
    // Store in memory cache for faster access
    summaryCache.set(entryId, storedSummaries[entryId]);
    return storedSummaries[entryId];
  }

  // Then check memory cache
  if (summaryCache.has(entryId)) {
    return summaryCache.get(entryId)!;
  }

  // Generate new summary
  const summary = await generateEventSummary(title, description, year, era);

  // Store in both memory cache and localStorage
  summaryCache.set(entryId, summary);
  storeSummary(entryId, summary);

  return summary;
}

// Function to clear cache (useful for testing or when API key changes)
export function clearSummaryCache(): void {
  summaryCache.clear();
  if (typeof window !== "undefined") {
    localStorage.removeItem(AI_SUMMARIES_KEY);
  }
}

// Function to get stored summary without generating
export function getStoredSummary(entryId: string): AIResponse | null {
  const storedSummaries = getStoredSummaries();
  return storedSummaries[entryId] || null;
}

// Function to check if summary exists
export function hasStoredSummary(entryId: string): boolean {
  const storedSummaries = getStoredSummaries();
  return entryId in storedSummaries;
}

// New function for history learning AI descriptions
export async function generateHistoryLearningDescription(
  title: string,
  facts: string,
  yearRange: string
): Promise<AIResponse> {
  try {
    // Check if API key is available
    if (!process.env.NEXT_PUBLIC_GEMINI_API_KEY) {
      return {
        success: false,
        error:
          "Gemini API key not configured. Please add NEXT_PUBLIC_GEMINI_API_KEY to your environment variables.",
      };
    }

    const prompt = `I am preparing for SSC exams. I will provide you with my short notes containing years, dates, events, and facts from history. Your task is to:

1. **Correct any mistakes** if found.
2. **Arrange the facts** in proper chronological or thematic order.
3. **Add missing connections** between the points so it becomes a smooth narrative.
4. **Explain the context and importance** of each event in simple language.
5. **Present it like a story or flow of events**, not just bullet points, so I can understand the cause–effect and continuity in history.
6. **IMPORTANT**: Underline and highlight important keywords, dates, names, and concepts throughout your response using markdown formatting:
   - Use **bold** for key historical figures, important dates, and major events
   - Use *italic* for significant places, treaties, and important terms
   - Use \`code blocks\` for years and specific dates
   - Use ==highlight== for crucial concepts and cause-effect relationships
   - Use __underline__ for important historical movements and policies

**Class Title:** ${title}
**Year Range:** ${yearRange}
**My Notes:**
${facts}

Please provide:
1. **Corrected and Organized Facts** - List the facts in proper chronological order with any corrections
2. **Narrative Story** - A smooth, flowing narrative that connects all the facts and explains the historical context
3. **Key Learning Points** - 3-4 important takeaways for SSC exam preparation

Format your response as:
**Corrected Facts:**
[Chronologically ordered facts with corrections and highlighting]

**Narrative Story:**
[Your flowing narrative with highlighting]

**Key Learning Points:**
• [Point 1 with highlighting]
• [Point 2 with highlighting]
• [Point 3 with highlighting]
• [Point 4 with highlighting]

Remember to use the formatting consistently throughout all sections to make important information stand out. Make it engaging, easy to understand, and perfect for SSC exam preparation.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-exp",
      contents: prompt,
    });

    const fullResponse = response.text?.trim();

    if (!fullResponse) {
      return {
        success: false,
        error: "Failed to generate history learning description",
      };
    }

    // Parse the response to extract different sections
    const correctedFactsMatch = fullResponse.match(
      /\*\*Corrected Facts:\*\*\s*([\s\S]*?)(?=\*\*Narrative Story:\*\*)/
    );
    const narrativeStoryMatch = fullResponse.match(
      /\*\*Narrative Story:\*\*\s*([\s\S]*?)(?=\*\*Key Learning Points:\*\*)/
    );
    const keyLearningPointsMatch = fullResponse.match(
      /\*\*Key Learning Points:\*\*\s*([\s\S]*?)$/
    );

    const correctedFacts = correctedFactsMatch
      ? correctedFactsMatch[1].trim()
      : "";
    const narrativeStory = narrativeStoryMatch
      ? narrativeStoryMatch[1].trim()
      : "";
    const keyLearningPoints = keyLearningPointsMatch
      ? keyLearningPointsMatch[1].trim()
      : "";

    return {
      success: true,
      summary: narrativeStory,
      rewrittenDescription: correctedFacts,
      keyLearningPoints: keyLearningPoints,
    };
  } catch (error) {
    console.error("History Learning AI Service Error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}
