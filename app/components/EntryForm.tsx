"use client";

import { useState, useEffect } from "react";
import { TimelineEntry } from "../page";
import Dialog from "./Dialog";

interface EntryFormProps {
  onAddEntry: (entry: {
    date: string;
    era: "AD" | "BC";
    title: string;
    description: string;
  }) => void;
  onEditEntry?: (entry: TimelineEntry) => void;
  editingEntry?: TimelineEntry | null;
  onCancel?: () => void;
}

export default function EntryForm({
  onAddEntry,
  onEditEntry,
  editingEntry,
  onCancel,
}: EntryFormProps) {
  const [formData, setFormData] = useState({
    date: "",
    era: "AD" as "AD" | "BC",
    title: "",
    description: "",
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

  // Update form data when editing entry changes
  useEffect(() => {
    if (editingEntry) {
      setFormData({
        date: editingEntry.date,
        era: editingEntry.era,
        title: editingEntry.title,
        description: editingEntry.description,
      });
    } else {
      setFormData({
        date: "",
        era: "AD",
        title: "",
        description: "",
      });
    }
  }, [editingEntry]);

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

    if (!formData.date || !formData.title || !formData.description) {
      showDialog(
        "Missing Information",
        "Please fill in all required fields (Year, Title, and Description).",
        "warning"
      );
      return;
    }

    // Validate date format (1-4 digit year)
    const year = parseInt(formData.date);
    if (isNaN(year) || year < 1 || year > 9999) {
      showDialog(
        "Invalid Year",
        "Please enter a valid year between 1 and 9999.",
        "warning"
      );
      return;
    }

    if (editingEntry && onEditEntry) {
      // Editing existing entry
      onEditEntry({
        ...editingEntry,
        ...formData,
      });
    } else {
      // Adding new entry
      onAddEntry(formData);
    }

    // Reset form
    setFormData({
      date: "",
      era: "AD",
      title: "",
      description: "",
    });
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const isEditing = !!editingEntry;

  return (
    <>
      <div className="bg-white rounded-lg shadow-lg p-6 border border-border">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-foreground">
            {isEditing ? "Edit Event" : "Add New Event"}
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
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2">
              <label
                htmlFor="date"
                className="block text-sm font-medium text-foreground mb-2"
              >
                Year *
              </label>
              <input
                type="text"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                placeholder="e.g., 1995, 95, 5"
                className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                maxLength={4}
              />
            </div>
            <div>
              <label
                htmlFor="era"
                className="block text-sm font-medium text-foreground mb-2"
              >
                Era *
              </label>
              <select
                id="era"
                name="era"
                value={formData.era}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="AD">AD</option>
                <option value="BC">BC</option>
              </select>
            </div>
          </div>

          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-foreground mb-2"
            >
              Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., Project Name"
              className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-foreground mb-2"
            >
              Description *
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Brief description of the event..."
              rows={4}
              className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
            />
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              className="flex-1 bg-primary text-white py-2 px-4 rounded-md hover:bg-accent transition-colors duration-200 font-medium"
            >
              {isEditing ? "Update Event" : "Add to Timeline"}
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
              <li>• Enter a year (1-4 digits, e.g., 1995, 95, 5)</li>
              <li>• Select AD (Anno Domini) or BC (Before Christ)</li>
              <li>• Add a descriptive title</li>
              <li>• Include location and details</li>
              <li>• Events automatically sort chronologically</li>
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
