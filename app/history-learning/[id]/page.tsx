"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { HistoryClassEntry } from "../page";
import { generateHistoryLearningDescription } from "../../lib/ai-service";

export default function HistoryClassDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [classEntry, setClassEntry] = useState<HistoryClassEntry | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [expandedSections, setExpandedSections] = useState<{
    notes: boolean;
    facts: boolean;
    story: boolean;
    learning: boolean;
  }>({
    notes: false,
    facts: false,
    story: false,
    learning: false,
  });

  useEffect(() => {
    const classId = params.id as string;
    const savedClasses = localStorage.getItem("historyClasses");

    if (savedClasses) {
      const classes: HistoryClassEntry[] = JSON.parse(savedClasses);
      const foundClass = classes.find((cls) => cls.id === classId);

      if (foundClass) {
        setClassEntry(foundClass);
        // Keep all sections closed by default
        setExpandedSections({
          notes: false,
          facts: false,
          story: false,
          learning: false,
        });
      } else {
        // Class not found, redirect back
        router.push("/history-learning");
        return;
      }
    } else {
      // No classes found, redirect back
      router.push("/history-learning");
      return;
    }

    setIsLoading(false);
  }, [params.id, router]);

  const handleGenerateAI = async () => {
    if (!classEntry) return;

    setIsGenerating(true);
    try {
      const response = await generateHistoryLearningDescription(
        classEntry.title,
        classEntry.facts,
        classEntry.yearRange
      );

      if (response.success) {
        const updatedClass = {
          ...classEntry,
          aiDescription: response.summary || "",
          correctedFacts: response.rewrittenDescription || "",
          keyLearningPoints: response.keyLearningPoints || "",
        };

        // Update localStorage
        const savedClasses = localStorage.getItem("historyClasses");
        if (savedClasses) {
          const classes: HistoryClassEntry[] = JSON.parse(savedClasses);
          const updatedClasses = classes.map((cls) =>
            cls.id === classEntry.id ? updatedClass : cls
          );
          localStorage.setItem(
            "historyClasses",
            JSON.stringify(updatedClasses)
          );
        }

        setClassEntry(updatedClass);
        // Keep sections closed after AI generation
        setExpandedSections({
          notes: false,
          facts: false,
          story: false,
          learning: false,
        });
      } else {
        console.error("Failed to generate AI description:", response.error);
        alert("Failed to generate AI description. Please try again.");
      }
    } catch (error) {
      console.error("Error generating AI description:", error);
      alert("Error generating AI description. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatMarkdown = (text: string) => {
    if (!text) return "";

    return (
      text
        // Bold text
        .replace(
          /\*\*(.*?)\*\*/g,
          '<strong class="font-bold text-foreground">$1</strong>'
        )
        // Italic text
        .replace(/\*(.*?)\*/g, '<em class="italic text-foreground">$1</em>')
        // Code blocks (years/dates)
        .replace(
          /`(.*?)`/g,
          '<code class="bg-gray-100 px-2 py-1 rounded font-mono text-sm">$1</code>'
        )
        // Highlighted text
        .replace(
          /==(.*?)==/g,
          '<mark class="bg-yellow-200 px-1 rounded">$1</mark>'
        )
        // Underlined text
        .replace(/__(.*?)__/g, '<u class="underline decoration-primary">$1</u>')
        // Line breaks
        .replace(/\n/g, "<br>")
        // Clean up any remaining markdown symbols that weren't converted
        .replace(/\*\*/g, "") // Remove any remaining **
        .replace(/\*/g, "") // Remove any remaining *
        .replace(/`/g, "") // Remove any remaining `
        .replace(/==/g, "") // Remove any remaining ==
        .replace(/__/g, "") // Remove any remaining __
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!classEntry) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-foreground mb-4">
            Class not found
          </h2>
          <Link
            href="/history-learning"
            className="text-primary hover:text-accent font-medium"
          >
            ← Back to History Learning
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4">
            <Link
              href="/history-learning"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                {classEntry.title}
              </h1>
              <p className="text-lg text-muted-foreground">
                {classEntry.yearRange}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-4">
          {/* Original Notes Accordion */}
          <div className="bg-white rounded-lg shadow-md border border-border overflow-hidden">
            <button
              onClick={() => toggleSection("notes")}
              className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <h2 className="text-2xl font-semibold text-foreground flex items-center gap-3">
                <span className="text-2xl">📝</span>
                Your Notes
              </h2>
              <svg
                className={`w-6 h-6 text-muted-foreground transition-transform duration-200 ${
                  expandedSections.notes ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            {expandedSections.notes && (
              <div className="px-6 pb-6">
                <div className="bg-muted p-4 rounded-md">
                  <div
                    className="text-foreground leading-relaxed"
                    dangerouslySetInnerHTML={{
                      __html: formatMarkdown(classEntry.facts),
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* AI Generated Content */}
          {classEntry.aiDescription ? (
            <>
              {/* Organized Facts Accordion */}
              {classEntry.correctedFacts && (
                <div className="bg-white rounded-lg shadow-md border border-border overflow-hidden">
                  <button
                    onClick={() => toggleSection("facts")}
                    className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                  >
                    <h2 className="text-2xl font-semibold text-foreground flex items-center gap-3">
                      <span className="text-2xl">✅</span>
                      Organized Facts
                    </h2>
                    <svg
                      className={`w-6 h-6 text-muted-foreground transition-transform duration-200 ${
                        expandedSections.facts ? "rotate-180" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                  {expandedSections.facts && (
                    <div className="px-6 pb-6">
                      <div className="bg-soft-green p-4 rounded-md">
                        <div
                          className="text-foreground leading-relaxed"
                          dangerouslySetInnerHTML={{
                            __html: formatMarkdown(classEntry.correctedFacts),
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Narrative Story Accordion */}
              <div className="bg-white rounded-lg shadow-md border border-border overflow-hidden">
                <button
                  onClick={() => toggleSection("story")}
                  className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <h2 className="text-2xl font-semibold text-foreground flex items-center gap-3">
                    <span className="text-2xl">📖</span>
                    Narrative Story
                  </h2>
                  <svg
                    className={`w-6 h-6 text-muted-foreground transition-transform duration-200 ${
                      expandedSections.story ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                {expandedSections.story && (
                  <div className="px-6 pb-6">
                    <div className="bg-blue-50 p-4 rounded-md">
                      <div
                        className="text-foreground leading-relaxed"
                        dangerouslySetInnerHTML={{
                          __html: formatMarkdown(classEntry.aiDescription),
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Key Learning Points Accordion */}
              {classEntry.keyLearningPoints && (
                <div className="bg-white rounded-lg shadow-md border border-border overflow-hidden">
                  <button
                    onClick={() => toggleSection("learning")}
                    className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                  >
                    <h2 className="text-2xl font-semibold text-foreground flex items-center gap-3">
                      <span className="text-2xl">🎯</span>
                      Key Learning Points
                    </h2>
                    <svg
                      className={`w-6 h-6 text-muted-foreground transition-transform duration-200 ${
                        expandedSections.learning ? "rotate-180" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                  {expandedSections.learning && (
                    <div className="px-6 pb-6">
                      <div className="bg-yellow-50 p-4 rounded-md">
                        <div
                          className="text-foreground leading-relaxed"
                          dangerouslySetInnerHTML={{
                            __html: formatMarkdown(
                              classEntry.keyLearningPoints
                            ),
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </>
          ) : (
            <div className="bg-white rounded-lg shadow-md border border-border p-8 text-center">
              <div className="text-4xl mb-4">🤖</div>
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                Generate AI Description
              </h2>
              <p className="text-muted-foreground mb-6">
                Let AI organize your facts and create a narrative story for
                better understanding.
              </p>
              <button
                onClick={handleGenerateAI}
                disabled={isGenerating}
                className="bg-primary hover:bg-accent disabled:bg-muted text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center gap-3 mx-auto"
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Generating AI Description...
                  </>
                ) : (
                  <>
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                    Generate AI Description
                  </>
                )}
              </button>
            </div>
          )}

          {/* Footer */}
          <div className="bg-white rounded-lg shadow-md border border-border p-6">
            <div className="flex justify-between items-center">
              <p className="text-muted-foreground">
                Created: {formatDate(classEntry.createdAt)}
              </p>
              <Link
                href="/history-learning"
                className="text-primary hover:text-accent font-medium"
              >
                ← Back to All Classes
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
