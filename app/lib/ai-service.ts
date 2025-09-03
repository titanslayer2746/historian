import { GoogleGenAI } from "@google/genai";

// Initialize the AI client
const ai = new GoogleGenAI({
  apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY || "",
});

export interface AIResponse {
  success: boolean;
  summary?: string;
  rewrittenDescription?: string;
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
