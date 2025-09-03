"use client";

import { HistoryClassEntry } from "../history-learning/page";

interface HistoryClassCardProps {
  classEntry: HistoryClassEntry;
  onDelete: (cls: HistoryClassEntry) => void;
  onEdit: (cls: HistoryClassEntry) => void;
  onCardClick: (classId: string) => void;
}

export default function HistoryClassCard({
  classEntry,
  onDelete,
  onEdit,
  onCardClick,
}: HistoryClassCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md border border-border overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-200 min-h-[200px]">
      {/* Card Header - Always Visible */}
      <div
        className="bg-gradient-to-r from-primary to-accent p-6 text-white h-full flex flex-col justify-between"
        onClick={() => onCardClick(classEntry.id)}
      >
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h3 className="text-xl font-semibold mb-2">{classEntry.title}</h3>
            <p className="text-base opacity-90">{classEntry.yearRange}</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(classEntry);
              }}
              className="p-2 hover:bg-gray-200 hover:bg-opacity-40 rounded transition-colors"
              title="Edit"
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
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(classEntry);
              }}
              className="p-2 hover:bg-gray-200 hover:bg-opacity-40 rounded transition-colors"
              title="Delete"
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
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Click to View Indicator */}
        <div className="mt-4 flex items-center justify-center">
          <div className="text-center">
            <p className="text-sm opacity-90 mb-2">Click to view details</p>
            <svg
              className="w-5 h-5 mx-auto opacity-75"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
