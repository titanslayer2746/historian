"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import EntryForm from "./components/EntryForm";
import Timeline from "./components/Timeline";
import ProtectedRoute from "./components/ProtectedRoute";

export interface TimelineEntry {
  id: string;
  date: string;
  era: "AD" | "BC";
  title: string;
  description: string;
}

export default function Home() {
  const [entries, setEntries] = useState<TimelineEntry[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingEntry, setEditingEntry] = useState<TimelineEntry | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [scrollToEntryId, setScrollToEntryId] = useState<string | undefined>();

  // Load entries from localStorage on component mount
  useEffect(() => {
    const savedEntries = localStorage.getItem("timelineEntries");
    if (savedEntries) {
      setEntries(JSON.parse(savedEntries));
    } else {
      // Default entries if none exist
      setEntries([
        {
          id: "1",
          date: "1066",
          era: "AD",
          title: "Battle of Hastings",
          description: "A battle happened in 1066",
        },
        {
          id: "2",
          date: "1215",
          era: "AD",
          title: "Magna Carta",
          description: "Important document was signed",
        },
        {
          id: "3",
          date: "1492",
          era: "AD",
          title: "Columbus Discovers America",
          description: "Columbus found new land",
        },
      ]);
    }
    setIsLoading(false);
  }, []);

  // Save entries to localStorage whenever entries change
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem("timelineEntries", JSON.stringify(entries));
    }
  }, [entries, isLoading]);

  const addEntry = (newEntry: Omit<TimelineEntry, "id">) => {
    const entry: TimelineEntry = {
      ...newEntry,
      id: Date.now().toString(),
    };

    setEntries((prev) => {
      const updated = [...prev, entry];
      return updated.sort((a, b) => {
        const yearA = parseInt(a.date);
        const yearB = parseInt(b.date);
        const adjustedYearA = a.era === "BC" ? -yearA : yearA;
        const adjustedYearB = b.era === "BC" ? -yearB : yearB;
        return adjustedYearA - adjustedYearB;
      });
    });

    setScrollToEntryId(entry.id);
    setTimeout(() => {
      setScrollToEntryId(undefined);
    }, 3000);

    setShowForm(false);
  };

  const editEntry = (updatedEntry: TimelineEntry) => {
    setEntries((prev) => {
      const updated = prev.map((entry) =>
        entry.id === updatedEntry.id ? updatedEntry : entry
      );
      return updated.sort((a, b) => {
        const yearA = parseInt(a.date);
        const yearB = parseInt(b.date);
        const adjustedYearA = a.era === "BC" ? -yearA : yearA;
        const adjustedYearB = b.era === "BC" ? -yearB : yearB;
        return adjustedYearA - adjustedYearB;
      });
    });

    setScrollToEntryId(updatedEntry.id);
    setTimeout(() => {
      setScrollToEntryId(undefined);
    }, 3000);

    setShowForm(false);
    setEditingEntry(null);
  };

  const deleteEntry = (id: string) => {
    setEntries((prev) => prev.filter((entry) => entry.id !== id));
  };

  const updateEntryDescription = (entryId: string, newDescription: string) => {
    setEntries((prev) =>
      prev.map((entry) =>
        entry.id === entryId ? { ...entry, description: newDescription } : entry
      )
    );
  };

  const handleEditClick = (entry: TimelineEntry) => {
    setEditingEntry(entry);
    setShowForm(true);
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingEntry(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-bg">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-border sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-6">
                <h1 className="text-2xl font-bold text-foreground">
                  Historical Timeline
                </h1>
                <nav className="hidden md:flex items-center gap-6">
                  <Link
                    href="/"
                    className="text-primary font-medium border-b-2 border-primary pb-1"
                  >
                    Timeline
                  </Link>
                  <Link
                    href="/history-learning"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    History Learning
                  </Link>
                </nav>
              </div>
              <div className="flex items-center gap-3">
                <Link
                  href="/history-learning"
                  className="text-primary hover:text-accent font-medium transition-colors duration-200 flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-primary/10"
                >
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
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                  <span className="hidden sm:inline">History Learning</span>
                </Link>
                <button
                  onClick={() => setShowForm(true)}
                  className="bg-primary hover:bg-accent text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
                >
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
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  <span className="hidden sm:inline">Add Entry</span>
                </button>
                <button
                  onClick={() => {
                    localStorage.removeItem("historianAccessKey");
                    document.cookie =
                      "historianAccessKey=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
                    window.location.href = "/access";
                  }}
                  className="text-gray-600 hover:text-gray-800 transition-colors duration-200 flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100"
                  title="Logout"
                >
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
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {entries.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📅</div>
              <h2 className="text-2xl font-semibold text-foreground mb-2">
                No Timeline Events Yet
              </h2>
              <p className="text-muted-foreground mb-6">
                Start building your historical timeline by adding your first
                event.
              </p>
              <button
                onClick={() => setShowForm(true)}
                className="bg-primary hover:bg-accent text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
              >
                Add Your First Event
              </button>
            </div>
          ) : (
            <Timeline
              entries={entries}
              onDeleteEntry={deleteEntry}
              onEditEntry={handleEditClick}
              scrollToEntryId={scrollToEntryId}
              onUpdateEntryDescription={updateEntryDescription}
            />
          )}
        </main>

        {/* Entry Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
              <EntryForm
                onAddEntry={addEntry}
                onEditEntry={editEntry}
                editingEntry={editingEntry}
                onCancel={handleFormCancel}
              />
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
