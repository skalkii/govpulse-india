"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
}: {
  error: Error & { digest?: string };
}) {
  useEffect(() => {
    console.error("[GovPulse] global error:", error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          fontFamily: "system-ui, sans-serif",
          padding: "2rem",
          textAlign: "center",
          background: "#1a1411",
          color: "#f6efe6",
          minHeight: "100vh",
        }}
      >
        <div style={{ maxWidth: 480, margin: "4rem auto" }}>
          <div style={{ fontSize: 48 }}>⚠️</div>
          <h1 style={{ marginTop: "1rem", fontSize: 28, fontWeight: 400 }}>
            GovPulse hit a fatal error
          </h1>
          <p style={{ marginTop: "0.5rem", fontSize: 14, opacity: 0.7 }}>
            {error.message || "Reload the page or come back later."}
          </p>
          {error.digest && (
            <p
              style={{
                marginTop: "0.25rem",
                fontFamily: "ui-monospace, monospace",
                fontSize: 11,
                opacity: 0.5,
              }}
            >
              Reference: {error.digest}
            </p>
          )}
          <a
            href="/"
            style={{
              display: "inline-block",
              marginTop: "1.5rem",
              padding: "0.5rem 1rem",
              background: "#e58a5a",
              color: "#1a1411",
              borderRadius: 8,
              textDecoration: "none",
              fontWeight: 500,
            }}
          >
            Back home
          </a>
        </div>
      </body>
    </html>
  );
}
