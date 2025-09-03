"use client";

import { useState, useEffect, useCallback } from "react";
import {
  AIResponse,
  getCachedOrGenerateSummary,
  hasStoredSummary,
  getStoredSummary,
} from "../lib/ai-service";
import { TimelineEntry } from "../page";

interface AISummaryBoxProps {
  entry: TimelineEntry;
  isVisible: boolean;
  position: "left" | "right" | "center";
  onEnhancedDescription?: (description: string) => void;
}

export default function AISummaryBox({
  entry,
  isVisible,
  position,
  onEnhancedDescription,
}: AISummaryBoxProps) {
  const [aiResponse, setAiResponse] = useState<AIResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const checkAndGenerateSummary = useCallback(async () => {
    // First check if summary already exists in localStorage
    if (hasStoredSummary(entry.id)) {
      const storedSummary = getStoredSummary(entry.id);
      if (storedSummary) {
        setAiResponse(storedSummary);
        return;
      }
    }

    // If no stored summary, generate new one
    setIsLoading(true);
    try {
      const response = await getCachedOrGenerateSummary(
        entry.id,
        entry.title,
        entry.description,
        entry.date,
        entry.era
      );
      setAiResponse(response);
    } catch {
      setAiResponse({
        success: false,
        error: "Failed to generate AI summary",
      });
    } finally {
      setIsLoading(false);
    }
  }, [entry.id, entry.title, entry.description, entry.date, entry.era]);

  useEffect(() => {
    if (isVisible && !aiResponse) {
      checkAndGenerateSummary();
    }
  }, [isVisible, entry.id, aiResponse, checkAndGenerateSummary]);

  useEffect(() => {
    if (aiResponse?.rewrittenDescription && onEnhancedDescription) {
      onEnhancedDescription(aiResponse.rewrittenDescription);
    }
  }, [aiResponse?.rewrittenDescription, onEnhancedDescription]);

  if (!isVisible) return null;

  // For center position (dialog), don't use positioning classes
  if (position === "center") {
    return (
      <div className="bg-white rounded-lg border border-border p-4 w-full">
        {/* Header */}
        <div className="flex items-center gap-2 mb-3">
          <div className="w-2 h-2 bg-primary rounded-full"></div>
          <h4 className="font-semibold text-sm text-foreground">
            AI Reference
          </h4>
          {isLoading && (
            <div className="ml-auto">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="space-y-2">
              <div className="h-3 bg-muted rounded animate-pulse"></div>
              <div className="h-3 bg-muted rounded animate-pulse w-3/4"></div>
              <div className="h-3 bg-muted rounded animate-pulse w-1/2"></div>
            </div>
          ) : aiResponse?.success ? (
            <>
              {/* Rewritten Description */}
              {aiResponse.rewrittenDescription && (
                <div className="border-l-4 border-primary pl-3 py-2 bg-soft-green/20 rounded-r">
                  <h5 className="font-medium text-sm text-foreground mb-1">
                    Enhanced Description:
                  </h5>
                  <div
                    className="text-sm text-muted-foreground leading-relaxed"
                    dangerouslySetInnerHTML={{
                      __html: aiResponse.rewrittenDescription || "",
                    }}
                  />
                </div>
              )}

              {/* Historical Analysis */}
              <div>
                <h5 className="font-medium text-sm text-foreground mb-2">
                  Historical Analysis:
                </h5>
                <div
                  className="text-sm text-muted-foreground leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: aiResponse.summary || "" }}
                />
              </div>
            </>
          ) : (
            <div className="text-sm text-red-500">
              <p className="font-medium mb-1">Unable to generate summary</p>
              <p className="text-xs">{aiResponse?.error}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-3 pt-2 border-t border-border">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Powered by Gemini AI</span>
            <span>
              {entry.date} {entry.era}
            </span>
          </div>
        </div>
      </div>
    );
  }

  // For left/right positions (timeline hover boxes)
  const positionClasses =
    position === "left" ? "right-full mr-8" : "left-full ml-8";

  return (
    <div
      className={`absolute top-1/2 transform -translate-y-1/2 ${positionClasses} z-20`}
    >
      <div className="bg-white rounded-lg shadow-xl border border-border p-4 max-w-xs w-80">
        {/* Header */}
        <div className="flex items-center gap-2 mb-3">
          <div className="w-2 h-2 bg-primary rounded-full"></div>
          <h4 className="font-semibold text-sm text-foreground">
            AI Reference
          </h4>
          {isLoading && (
            <div className="ml-auto">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="space-y-3">
          {isLoading ? (
            <div className="space-y-2">
              <div className="h-3 bg-muted rounded animate-pulse"></div>
              <div className="h-3 bg-muted rounded animate-pulse w-3/4"></div>
              <div className="h-3 bg-muted rounded animate-pulse w-1/2"></div>
            </div>
          ) : aiResponse?.success ? (
            <>
              {/* Rewritten Description */}
              {aiResponse.rewrittenDescription && (
                <div className="border-l-2 border-primary pl-2 py-1 bg-soft-green/20 rounded-r">
                  <h5 className="font-medium text-xs text-foreground mb-1">
                    Enhanced:
                  </h5>
                  <div
                    className="text-xs text-muted-foreground leading-relaxed"
                    dangerouslySetInnerHTML={{
                      __html: aiResponse.rewrittenDescription || "",
                    }}
                  />
                </div>
              )}

              {/* Historical Analysis */}
              <div>
                <h5 className="font-medium text-xs text-foreground mb-1">
                  Analysis:
                </h5>
                <div
                  className="text-xs text-muted-foreground leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: aiResponse.summary || "" }}
                />
              </div>
            </>
          ) : (
            <div className="text-sm text-red-500">
              <p className="font-medium mb-1">Unable to generate summary</p>
              <p className="text-xs">{aiResponse?.error}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-3 pt-2 border-t border-border">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Powered by Gemini AI</span>
            <span>
              {entry.date} {entry.era}
            </span>
          </div>
        </div>

        {/* Arrow pointing to the timeline dot */}
        <div
          className={`absolute top-1/2 transform -translate-y-1/2 w-0 h-0 border-4 border-transparent ${
            position === "left"
              ? "border-l-white -right-1"
              : "border-r-white -left-1"
          }`}
        ></div>
      </div>
    </div>
  );
}
