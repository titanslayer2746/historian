"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import HistoryClassForm from "../components/HistoryClassForm";
import HistoryClassCard from "../components/HistoryClassCard";
import Dialog from "../components/Dialog";
import { generateHistoryLearningDescription } from "../lib/ai-service";

export interface HistoryClassEntry {
  id: string;
  title: string;
  yearRange: string;
  facts: string;
  aiDescription?: string;
  correctedFacts?: string;
  keyLearningPoints?: string;
  createdAt: string;
}

export default function HistoryLearningPage() {
  const router = useRouter();
  const [classes, setClasses] = useState<HistoryClassEntry[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingClass, setEditingClass] = useState<HistoryClassEntry | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
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

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [classToDelete, setClassToDelete] = useState<HistoryClassEntry | null>(
    null
  );

  // Load classes from localStorage on component mount
  useEffect(() => {
    const savedClasses = localStorage.getItem("historyClasses");
    if (savedClasses) {
      setClasses(JSON.parse(savedClasses));
    }
    setIsLoading(false);
  }, []);

  // Save classes to localStorage whenever classes change
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem("historyClasses", JSON.stringify(classes));
    }
  }, [classes, isLoading]);

  const addClass = async (
    newClass: Omit<HistoryClassEntry, "id" | "createdAt">
  ) => {
    const classEntry: HistoryClassEntry = {
      ...newClass,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };

    setClasses((prev) => [...prev, classEntry]);
    setShowForm(false);

    // Auto-generate AI description
    try {
      const response = await generateHistoryLearningDescription(
        classEntry.title,
        classEntry.facts,
        classEntry.yearRange
      );

      if (response.success) {
        // Update the class with AI-generated content
        const updatedClass = {
          ...classEntry,
          aiDescription: response.summary || "",
          correctedFacts: response.rewrittenDescription || "",
          keyLearningPoints: response.keyLearningPoints || "",
        };

        setClasses((prev) =>
          prev.map((cls) => (cls.id === classEntry.id ? updatedClass : cls))
        );
      }
    } catch (error) {
      console.error("Failed to auto-generate AI description:", error);
    }
  };

  const editClass = (updatedClass: HistoryClassEntry) => {
    setClasses((prev) =>
      prev.map((cls) => (cls.id === updatedClass.id ? updatedClass : cls))
    );
    setShowForm(false);
    setEditingClass(null);
  };

  const deleteClass = (id: string) => {
    setClasses((prev) => prev.filter((cls) => cls.id !== id));
  };

  const handleDeleteClick = (cls: HistoryClassEntry) => {
    setClassToDelete(cls);
    setShowDeleteDialog(true);
  };

  const handleDeleteConfirm = () => {
    if (classToDelete) {
      deleteClass(classToDelete.id);
      setShowDeleteDialog(false);
      setClassToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteDialog(false);
    setClassToDelete(null);
  };

  const handleEditClick = (cls: HistoryClassEntry) => {
    setEditingClass(cls);
    setShowForm(true);
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingClass(null);
  };

  const handleCardClick = (classId: string) => {
    router.push(`/history-learning/${classId}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg w-full">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-border w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Link
                href="/"
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
              <h1 className="text-3xl font-bold text-foreground">
                History Learning
              </h1>
            </div>
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
              Add History Class
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {classes.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📚</div>
              <h2 className="text-2xl font-semibold text-foreground mb-2">
                No History Classes Yet
              </h2>
              <p className="text-muted-foreground mb-6">
                Start building your history learning collection by adding your
                first class.
              </p>
              <button
                onClick={() => setShowForm(true)}
                className="bg-primary hover:bg-accent text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
              >
                Add Your First Class
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {classes.map((cls) => (
                <HistoryClassCard
                  key={cls.id}
                  classEntry={cls}
                  onDelete={handleDeleteClick}
                  onEdit={handleEditClick}
                  onCardClick={handleCardClick}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* History Class Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <HistoryClassForm
              onAddClass={addClass}
              onEditClass={editClass}
              editingClass={editingClass}
              onCancel={handleFormCancel}
            />
          </div>
        </div>
      )}

      {/* Dialog */}
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

      {/* Delete Confirmation Dialog */}
      {showDeleteDialog && classToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="text-center">
              <div className="text-4xl mb-4">🗑️</div>
              <h2 className="text-2xl font-semibold text-foreground mb-2">
                Delete History Class
              </h2>
              <p className="text-muted-foreground mb-6">
                Are you sure you want to delete &quot;{classToDelete.title}
                &quot;? This action cannot be undone.
              </p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={handleDeleteCancel}
                  className="px-4 py-2 text-muted-foreground hover:text-foreground font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
