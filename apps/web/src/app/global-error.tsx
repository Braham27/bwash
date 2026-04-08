"use client";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en" className="dark">
      <body className="flex min-h-screen items-center justify-center bg-luxury-black text-foreground">
        <div className="text-center px-6">
          <h1 className="text-4xl font-bold mb-4">Something went wrong</h1>
          <p className="text-foreground/50 mb-8">
            We&apos;re sorry — please try again.
          </p>
          <button
            onClick={reset}
            className="rounded-full bg-[#2563EB] px-8 py-3 text-sm font-semibold text-white hover:bg-[#2563EB]/90 transition-colors"
          >
            Try Again
          </button>
        </div>
      </body>
    </html>
  );
}
