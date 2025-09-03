"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AccessPage() {
  const [accessKey, setAccessKey] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    // Check if user already has access
    const storedKey = localStorage.getItem("historianAccessKey");
    const accessKey = process.env.NEXT_PUBLIC_ACCESS_KEY || "";
    if (storedKey === accessKey && accessKey) {
      router.push("/");
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Check if the access key matches
    const expectedKey = process.env.NEXT_PUBLIC_ACCESS_KEY || "";
    if (accessKey === expectedKey && expectedKey) {
      // Store the key in localStorage
      localStorage.setItem("historianAccessKey", accessKey);
      // Also set a cookie for middleware
      document.cookie = `historianAccessKey=${accessKey}; path=/; max-age=31536000`; // 1 year
      // Redirect to main page
      router.push("/");
    } else {
      setError("Invalid access key. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">🔐</div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Access Required
            </h1>
            <p className="text-gray-600">
              Enter your access key to continue to the Historian application
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="accessKey"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Access Key
              </label>
              <input
                id="accessKey"
                type="password"
                value={accessKey}
                onChange={(e) => setAccessKey(e.target.value)}
                placeholder="Enter your access key"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                required
                autoFocus
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || !accessKey.trim()}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Verifying...
                </>
              ) : (
                "Access Site"
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-xs text-gray-500">
              This application is protected by an access key system
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
