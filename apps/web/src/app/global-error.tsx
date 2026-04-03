"use client";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en" className="dark">
      <body className="flex min-h-screen items-center justify-center bg-[#040404] text-white">
        <div className="text-center px-6">
          <h1 className="text-4xl font-bold mb-4">Something went wrong</h1>
          <p className="text-white/50 mb-8">
            We&apos;re sorry — please try again.
          </p>
          <button
            onClick={reset}
            className="rounded-full bg-[#C9A84C] px-8 py-3 text-sm font-semibold text-black hover:bg-[#C9A84C]/90 transition-colors"
          >
            Try Again
          </button>
        </div>
      </body>
    </html>
  );
}
