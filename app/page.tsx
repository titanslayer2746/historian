"use client";

import { useState, useEffect } from "react";
import EntryForm from "./components/EntryForm";
import Timeline from "./components/Timeline";
import Dialog from "./components/Dialog";

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
    <div className="min-h-screen bg-bg">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-foreground">
              Historical Timeline
            </h1>
            <button
              onClick={() => setShowForm(true)}
              className="bg-primary hover:bg-accent text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
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
              Add Entry
            </button>
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
  );
}
