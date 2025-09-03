"use client";

import { useState, useRef, useEffect } from "react";
import { TimelineEntry } from "../page";
import Dialog from "./Dialog";
import AISummaryBox from "./AISummaryBox";

interface TimelineProps {
  entries: TimelineEntry[];
  onDeleteEntry: (id: string) => void;
  onEditEntry: (entry: TimelineEntry) => void;
  scrollToEntryId?: string;
  onUpdateEntryDescription?: (entryId: string, newDescription: string) => void;
}

export default function Timeline({
  entries,
  onDeleteEntry,
  onEditEntry,
  scrollToEntryId,
  onUpdateEntryDescription,
}: TimelineProps) {
  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean;
    entryId: string;
    entryTitle: string;
  }>({
    isOpen: false,
    entryId: "",
    entryTitle: "",
  });

  const [aiDialog, setAiDialog] = useState<{
    isOpen: boolean;
    entryId: string;
  }>({
    isOpen: false,
    entryId: "",
  });

  const timelineRef = useRef<HTMLDivElement>(null);

  // Scroll to specific entry when scrollToEntryId changes
  useEffect(() => {
    if (scrollToEntryId && timelineRef.current) {
      const targetElement = document.getElementById(
        `timeline-entry-${scrollToEntryId}`
      );
      if (targetElement) {
        // Add a small delay to ensure the DOM is updated
        setTimeout(() => {
          targetElement.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });

          // Add a highlight effect
          targetElement.classList.add("highlight-entry");
          setTimeout(() => {
            targetElement.classList.remove("highlight-entry");
          }, 2000);
        }, 100);
      }
    }
  }, [scrollToEntryId]);

  const handleAIDialogClose = (enhancedDescription?: string) => {
    if (enhancedDescription && onUpdateEntryDescription) {
      onUpdateEntryDescription(aiDialog.entryId, enhancedDescription);
    }
    setAiDialog({ ...aiDialog, isOpen: false });
  };

  return (
    <>
      <div className="relative" ref={timelineRef}>
        {/* Central Timeline Line */}
        <div className="absolute left-1/2 transform -translate-x-1/2 w-0.5 bg-foreground h-full"></div>

        <div className="space-y-8">
          {entries.map((entry, index) => (
            <TimelineItem
              key={entry.id}
              entry={entry}
              index={index}
              onDelete={(id, title) => {
                setDeleteDialog({
                  isOpen: true,
                  entryId: id,
                  entryTitle: title,
                });
              }}
              onEdit={onEditEntry}
              onDotClick={(entryId) => {
                setAiDialog({
                  isOpen: true,
                  entryId: entryId,
                });
              }}
            />
          ))}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog
        isOpen={deleteDialog.isOpen}
        onClose={() => setDeleteDialog({ ...deleteDialog, isOpen: false })}
        onConfirm={() => {
          onDeleteEntry(deleteDialog.entryId);
          setDeleteDialog({ ...deleteDialog, isOpen: false });
        }}
        title="Delete Event"
        message={`Are you sure you want to delete "${deleteDialog.entryTitle}"? This action cannot be undone.`}
        type="danger"
        confirmText="Delete"
        cancelText="Cancel"
      />

      {/* AI Summary Dialog */}
      <AISummaryDialog
        isOpen={aiDialog.isOpen}
        onClose={handleAIDialogClose}
        entryId={aiDialog.entryId}
        entries={entries}
      />
    </>
  );
}

interface TimelineItemProps {
  entry: TimelineEntry;
  index: number;
  onDelete: (id: string, title: string) => void;
  onEdit: (entry: TimelineEntry) => void;
  onDotClick: (entryId: string) => void;
}

function TimelineItem({
  entry,
  index,
  onDelete,
  onEdit,
  onDotClick,
}: TimelineItemProps) {
  const isEven = index % 2 === 0;
  const position = isEven ? "left" : "right";

  return (
    <div
      id={`timeline-entry-${entry.id}`}
      className="relative flex items-center transition-all duration-500"
    >
      {/* Timeline Dot */}
      <div
        className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-primary rounded-full border-4 border-white shadow-lg z-10 cursor-pointer hover:scale-110 transition-transform duration-200"
        onClick={() => onDotClick(entry.id)}
        title="Click for AI Reference"
      ></div>

      {/* Content Container */}
      <div
        className={`w-5/12 ${position === "left" ? "pr-8" : "pl-8 ml-auto"}`}
      >
        <div className="bg-white rounded-lg shadow-lg p-6 border border-border hover:shadow-xl transition-all duration-200 group relative">
          {/* Year and Era */}
          <div className="text-2xl font-bold text-primary mb-2">
            {entry.date} {entry.era}
          </div>

          {/* Title */}
          <h3 className="text-lg font-semibold text-foreground mb-3">
            {entry.title}
          </h3>

          {/* Description - Hidden by default, shown on hover */}
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div
              className="text-muted-foreground text-sm leading-relaxed mb-4"
              dangerouslySetInnerHTML={{ __html: entry.description }}
            />
          </div>

          {/* Action Buttons - Bottom Right Corner */}
          <div className="absolute bottom-3 right-3 flex gap-1">
            <button
              onClick={() => onEdit(entry)}
              className="flex items-center gap-1 px-2 py-1 text-xs bg-soft-green text-foreground rounded-md hover:bg-accent hover:text-white transition-colors duration-200"
              title="Edit entry"
            >
              <svg
                className="w-3 h-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </button>
            <button
              onClick={() => onDelete(entry.id, entry.title)}
              className="flex items-center gap-1 px-2 py-1 text-xs bg-red-100 text-red-600 rounded-md hover:bg-red-500 hover:text-white transition-colors duration-200"
              title="Delete entry"
            >
              <svg
                className="w-3 h-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          </div>

          {/* Hover indicator */}
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 mt-3">
            <div className="flex items-center text-xs text-muted-foreground">
              <span className="mr-2">Hover for details</span>
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Connecting Line */}
      <div
        className={`absolute top-1/2 transform -translate-y-1/2 w-8 h-0.5 bg-foreground ${
          position === "left" ? "right-1/2" : "left-1/2"
        }`}
      ></div>
    </div>
  );
}

// AI Summary Dialog Component
interface AISummaryDialogProps {
  isOpen: boolean;
  onClose: (enhancedDescription?: string) => void;
  entryId: string;
  entries: TimelineEntry[];
}

function AISummaryDialog({
  isOpen,
  onClose,
  entryId,
  entries,
}: AISummaryDialogProps) {
  const entry = entries.find((e) => e.id === entryId);
  const [enhancedDescription, setEnhancedDescription] = useState<string>("");

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen || !entry) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col">
        <div className="p-6 flex-shrink-0">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🤖</span>
              <h3 className="text-lg font-semibold text-foreground">
                AI Reference - {entry.date} {entry.era}
              </h3>
            </div>
            <button
              onClick={() => onClose()}
              className="text-muted-foreground hover:text-foreground transition-colors duration-200"
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-6">
          <AISummaryBox
            entry={entry}
            isVisible={true}
            position="center"
            onEnhancedDescription={(description) =>
              setEnhancedDescription(description)
            }
          />
        </div>

        {/* Actions - Fixed at bottom */}
        <div className="p-6 flex-shrink-0 border-t border-border">
          <div className="flex justify-between items-center">
            <button
              onClick={() => onClose()}
              className="px-4 py-2 border border-border text-foreground rounded-md hover:bg-muted transition-colors duration-200 font-medium"
            >
              Close
            </button>
            {enhancedDescription && (
              <button
                onClick={() => onClose(enhancedDescription)}
                className="px-4 py-2 bg-primary hover:bg-accent text-white rounded-md transition-colors duration-200 font-medium"
              >
                Apply Enhanced Description
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
