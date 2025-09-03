"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      const storedKey = localStorage.getItem("historianAccessKey");
      const accessKey = process.env.NEXT_PUBLIC_ACCESS_KEY || "";

      if (storedKey === accessKey && accessKey) {
        setIsAuthenticated(true);
      } else {
        // Check if cookie exists as fallback
        const cookies = document.cookie.split(";");
        const accessKeyCookie = cookies.find((cookie) =>
          cookie.trim().startsWith("historianAccessKey=")
        );

        if (accessKeyCookie && accessKey) {
          const cookieValue = accessKeyCookie.split("=")[1];
          if (cookieValue === accessKey) {
            // Set localStorage from cookie
            localStorage.setItem("historianAccessKey", cookieValue);
            setIsAuthenticated(true);
            return;
          }
        }

        // Redirect to access page
        router.push("/access");
      }
      setIsLoading(false);
    };

    checkAuth();
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Verifying access...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect to access page
  }

  return <>{children}</>;
}
