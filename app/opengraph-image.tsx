import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "GovPulse India — Public data, made useful";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          background: "#1a1411",
          color: "#f6efe6",
          display: "flex",
          flexDirection: "column",
          padding: "72px 80px",
          fontFamily: "serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div
            style={{
              width: 16,
              height: 16,
              borderRadius: 999,
              background: "#e58a5a",
            }}
          />
          <div style={{ fontSize: 30, fontWeight: 500 }}>
            GovPulse <span style={{ opacity: 0.55, fontStyle: "italic" }}>India</span>
          </div>
        </div>

        <div
          style={{
            marginTop: "auto",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              fontSize: 110,
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
              fontWeight: 400,
            }}
          >
            Public data,
          </div>
          <div
            style={{
              fontSize: 110,
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
              fontStyle: "italic",
              color: "#e58a5a",
              fontWeight: 400,
            }}
          >
            made useful.
          </div>
          <div
            style={{
              marginTop: 32,
              fontSize: 28,
              opacity: 0.7,
              fontFamily: "sans-serif",
            }}
          >
            🌬️ AQI · 🌊 Rivers · 🌧️ Rainfall · ☀️ Solar
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
