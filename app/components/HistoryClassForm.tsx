"use client";

import { useState, useEffect } from "react";
import { HistoryClassEntry } from "../history-learning/page";
import Dialog from "./Dialog";

interface HistoryClassFormProps {
  onAddClass: (entry: {
    title: string;
    yearRange: string;
    facts: string;
  }) => void;
  onEditClass?: (entry: HistoryClassEntry) => void;
  editingClass?: HistoryClassEntry | null;
  onCancel?: () => void;
}

export default function HistoryClassForm({
  onAddClass,
  onEditClass,
  editingClass,
  onCancel,
}: HistoryClassFormProps) {
  const [formData, setFormData] = useState({
    title: "",
    yearRange: "",
    facts: "",
  });

  const [dialog, setDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type: "danger" | "warning" | "info";
  }>({
    isOpen: false,
    title: "",
    message: "",
    type: "info",
  });

  // Update form data when editing class changes
  useEffect(() => {
    if (editingClass) {
      setFormData({
        title: editingClass.title,
        yearRange: editingClass.yearRange,
        facts: editingClass.facts,
      });
    } else {
      setFormData({
        title: "",
        yearRange: "",
        facts: "",
      });
    }
  }, [editingClass]);

  const showDialog = (
    title: string,
    message: string,
    type: "danger" | "warning" | "info" = "info"
  ) => {
    setDialog({
      isOpen: true,
      title,
      message,
      type,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.yearRange || !formData.facts) {
      showDialog(
        "Missing Information",
        "Please fill in all required fields (Title, Year Range, and Facts).",
        "warning"
      );
      return;
    }

    if (editingClass && onEditClass) {
      // Editing existing class
      onEditClass({
        ...editingClass,
        ...formData,
      });
    } else {
      // Adding new class
      onAddClass(formData);
    }

    // Reset form
    setFormData({
      title: "",
      yearRange: "",
      facts: "",
    });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const isEditing = !!editingClass;

  return (
    <>
      <div className="bg-white rounded-lg shadow-lg p-6 border border-border">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-foreground">
            {isEditing ? "Edit History Class" : "Add New History Class"}
          </h2>
          {onCancel && (
            <button
              onClick={onCancel}
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-foreground mb-2"
            >
              Class Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., Ancient India, Mughal Empire, British Rule"
              className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          <div>
            <label
              htmlFor="yearRange"
              className="block text-sm font-medium text-foreground mb-2"
            >
              Year Range *
            </label>
            <input
              type="text"
              id="yearRange"
              name="yearRange"
              value={formData.yearRange}
              onChange={handleChange}
              placeholder="e.g., 1757-1857, 1857-1947, 1947-present"
              className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          <div>
            <label
              htmlFor="facts"
              className="block text-sm font-medium text-foreground mb-2"
            >
              Historical Facts & Notes *
            </label>
            <textarea
              id="facts"
              name="facts"
              value={formData.facts}
              onChange={handleChange}
              placeholder="Enter your short notes, dates, events, and facts here. For example:

1757 Plassey battle
Robert Clive
Siraj-ud-Daulah defeated
Mir Jafar betrayal

The AI will organize these facts chronologically and create a narrative story."
              rows={8}
              className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
            />
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              className="flex-1 bg-primary text-white py-2 px-4 rounded-md hover:bg-accent transition-colors duration-200 font-medium"
            >
              {isEditing ? "Update Class" : "Add History Class"}
            </button>
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 border border-border text-foreground rounded-md hover:bg-muted transition-colors duration-200 font-medium"
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        {!isEditing && (
          <div className="mt-6 p-4 bg-soft-green rounded-md">
            <h3 className="font-medium text-foreground mb-2">How it works:</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Enter a descriptive title for your history class/topic</li>
              <li>• Specify the year range (e.g., 1757-1857)</li>
              <li>• Add your short notes with dates, events, and facts</li>
              <li>
                • AI will organize facts chronologically and create a narrative
                story
              </li>
              <li>
                • Perfect for SSC exam preparation and understanding historical
                context
              </li>
            </ul>
          </div>
        )}
      </div>

      {/* Custom Dialog */}
      <Dialog
        isOpen={dialog.isOpen}
        onClose={() => setDialog({ ...dialog, isOpen: false })}
        onConfirm={() => setDialog({ ...dialog, isOpen: false })}
        title={dialog.title}
        message={dialog.message}
        type={dialog.type}
        confirmText="OK"
        cancelText=""
      />
    </>
  );
}
