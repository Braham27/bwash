"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Dashboard error:", error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="text-center space-y-4 max-w-md">
        <h2 className="text-xl font-bold text-foreground">Something went wrong</h2>
        <p className="text-sm text-foreground/50">
          {error.message || "An unexpected error occurred loading your dashboard."}
        </p>
        {error.digest && (
          <p className="text-xs text-foreground/30">Error ID: {error.digest}</p>
        )}
        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            onClick={reset}
            className="btn-primary text-sm px-6 py-2"
          >
            Try Again
          </button>
          <Link href="/" className="btn-secondary text-sm px-6 py-2">
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
